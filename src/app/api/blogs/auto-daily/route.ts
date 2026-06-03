import { NextResponse } from 'next/server';
import { ImageKit } from '@imagekit/nodejs';
import { BlogPost, slugify } from '@/lib/blogs';
import { deleteBlogFromMongo, listBlogsFromMongo, saveBlogToMongo } from '@/lib/blogs-server';

interface GeneratedBlogPayload {
  title?: string;
  titleAr?: string;
  shortDescription?: string;
  shortDescriptionAr?: string;
  content?: string;
  contentAr?: string;
}

interface SourceArticle {
  title: string;
  summary: string;
  url: string;
  publishedAt: number;
  imageUrl?: string;
}

interface OpenAIResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

interface OpenAIImageResponse {
  data?: Array<{
    b64_json?: string;
    url?: string;
  }>;
}

interface UnsplashResponse {
  results?: Array<{
    urls?: {
      regular?: string;
    };
  }>;
}

interface PexelsResponse {
  photos?: Array<{
    src?: {
      large2x?: string;
      large?: string;
      medium?: string;
    };
  }>;
}

const DEFAULT_IMAGE = '/assets/banner/DB1.webp';
const AUTO_BLOG_ID_PREFIX = 'auto-openai-';
const AUTO_BLOG_INTERVAL_DAYS = 5;
const MAX_AUTO_BLOGS = 50;
const TITLE_GENERATION_ATTEMPTS = 3;
const TOPIC_ANGLE_HINTS = [
  'compliance checklist',
  'common mistakes and prevention',
  'step-by-step process for applicants',
  'costs and timelines',
  'residents vs non-residents',
  'business-owner perspective',
];
const KHAALEJ_KEYWORD_TOPICS = [
  'Tax law changes UAE',
  'UAE finance news',
  'VAT updates UAE',
  'Audit regulations updates',
  'UAE tax alerts',
  'What changed in UAE law',
  'UAE policy updates',
  'UAE regulatory news',
  'Dubai business updates',
  'Legal alert',
  'Tax alerts',
  'Court decisions and legal insights',
  'Freezone updates',
  'Corporate update',
  'Licensing updates',
  'Freezone updates UAE',
  'Mainland updates UAE',
  'Startup regulations UAE',
  'Business compliance updates UAE',
];
const DEFAULT_WEB_SOURCE_URLS = ['https://www.khaleejtimes.com/', 'https://www.khaleejtimes.com/uae/legal'];
const LOCAL_UAE_LEGAL_IMAGES = [
  '/assets/banner/DB1.webp',
  '/assets/banner/DB1B.webp',
  '/assets/banner/MB1.webp',
  '/assets/bannerSlider/main2.webp',
  '/assets/bannerSlider/main3.webp',
  '/assets/bannerSlider/main5.webp',
  '/assets/service/7.webp',
  '/assets/service/8.webp',
];

const imagekit = process.env.IMAGEKIT_PRIVATE_KEY && process.env.IMAGEKIT_URL_ENDPOINT
  ? new ImageKit({
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY || '',
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    } as any)
  : null;

const normalizeTitle = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const daysBetween = (fromMs: number, toMs: number) => (toMs - fromMs) / (1000 * 60 * 60 * 24);
const getDateKey = () => new Date().toISOString().split('T')[0];

const formatBlogDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(date.getUTCDate()).padStart(2, '0');
  const hh = String(date.getUTCHours()).padStart(2, '0');
  const min = String(date.getUTCMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min} UTC`;
};

const stripHtml = (input: string): string => input.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

const decodeHtmlEntities = (value: string): string =>
  value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

const parseGeneratedPayload = (raw: string): GeneratedBlogPayload => {
  try {
    return JSON.parse(raw) as GeneratedBlogPayload;
  } catch {
    return {};
  }
};

const hasValidAutomationToken = (request: Request): boolean => {
  const configuredSecret = process.env.BLOGS_AUTOMATION_SECRET || process.env.CRON_SECRET;

  if (!configuredSecret) {
    return process.env.NODE_ENV !== 'production';
  }

  const authHeader = request.headers.get('authorization') || '';
  return authHeader === `Bearer ${configuredSecret}`;
};

const extractDescriptionImage = (description: string): string | undefined => {
  const decoded = decodeHtmlEntities(description || '');
  const imageMatch = decoded.match(/<img[^>]+src=["']([^"']+)["']/i);
  return imageMatch?.[1]?.trim() || undefined;
};

const parseRssArticles = (xml: string): SourceArticle[] => {
  const items = xml.match(/<item[\s\S]*?<\/item>/gi) || [];

  return items.reduce<SourceArticle[]>((acc, item) => {
    const title = item.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || '';
    const description = item.match(/<description>([\s\S]*?)<\/description>/i)?.[1] || '';
    const link = item.match(/<link>([\s\S]*?)<\/link>/i)?.[1] || '';
    const pubDate = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/i)?.[1] || '';
    const mediaContentUrl = item.match(/<media:content[^>]*url=["']([^"']+)["']/i)?.[1] || '';
    const enclosureImageUrl = item.match(/<enclosure[^>]*url=["']([^"']+)["'][^>]*type=["']image\//i)?.[1] || '';
    const descriptionImageUrl = extractDescriptionImage(description) || '';

    const publishedAt = Date.parse(pubDate);
    if (!title.trim() || !Number.isFinite(publishedAt)) {
      return acc;
    }

    acc.push({
      title: stripHtml(title),
      summary: stripHtml(description),
      url: link.trim(),
      publishedAt,
      imageUrl: mediaContentUrl.trim() || enclosureImageUrl.trim() || descriptionImageUrl.trim() || undefined,
    });

    return acc;
  }, []);
};

const absoluteUrl = (baseUrl: string, maybeRelative: string): string => {
  try {
    return new URL(maybeRelative, baseUrl).toString();
  } catch {
    return maybeRelative.trim();
  }
};

const safeJsonParse = (value: string): unknown => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const asString = (value: unknown): string => {
  if (typeof value === 'string') {
    return value.trim();
  }
  return '';
};

const firstString = (...values: unknown[]): string => {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }
  return '';
};

const normalizeImageField = (value: unknown): string => {
  if (typeof value === 'string') {
    return value.trim();
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      const normalized = normalizeImageField(item);
      if (normalized) {
        return normalized;
      }
    }
    return '';
  }
  if (value && typeof value === 'object') {
    const candidate = value as Record<string, unknown>;
    return firstString(candidate.url, candidate.contentUrl, candidate.secureUrl);
  }
  return '';
};

const collectJsonNodes = (value: unknown, output: Array<Record<string, unknown>>): void => {
  if (!value) {
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      collectJsonNodes(item, output);
    }
    return;
  }

  if (typeof value !== 'object') {
    return;
  }

  const objectValue = value as Record<string, unknown>;
  output.push(objectValue);

  const graph = objectValue['@graph'];
  if (graph) {
    collectJsonNodes(graph, output);
  }

  for (const propertyValue of Object.values(objectValue)) {
    if (propertyValue && typeof propertyValue === 'object') {
      collectJsonNodes(propertyValue, output);
    }
  }
};

const parseJsonLdArticles = (html: string, sourcePageUrl: string): SourceArticle[] => {
  const scriptMatches = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || [];
  const articles: SourceArticle[] = [];

  for (const scriptTag of scriptMatches) {
    const payloadMatch = scriptTag.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
    const payloadRaw = payloadMatch?.[1]?.trim();
    if (!payloadRaw) {
      continue;
    }

    const parsed = safeJsonParse(payloadRaw);
    if (!parsed) {
      continue;
    }

    const nodes: Array<Record<string, unknown>> = [];
    collectJsonNodes(parsed, nodes);

    for (const node of nodes) {
      const typeRaw = node['@type'];
      const typeList = Array.isArray(typeRaw) ? typeRaw.map((value) => asString(value).toLowerCase()) : [asString(typeRaw).toLowerCase()];
      const isArticleType = typeList.some((type) => type.includes('article') || type.includes('newsarticle'));
      if (!isArticleType) {
        continue;
      }

      const title = firstString(node.headline, node.name);
      const description = firstString(node.description, node.abstract);
      const url = firstString(node.url, node.mainEntityOfPage);
      const dateValue = firstString(node.datePublished, node.dateCreated, node.dateModified);
      const publishedAt = Date.parse(dateValue);
      if (!title || !url || !Number.isFinite(publishedAt)) {
        continue;
      }

      const image = normalizeImageField(node.image);
      articles.push({
        title: stripHtml(title),
        summary: stripHtml(description || title),
        url: absoluteUrl(sourcePageUrl, url),
        publishedAt,
        imageUrl: image ? absoluteUrl(sourcePageUrl, image) : undefined,
      });
    }
  }

  return articles;
};

const parseAnchorArticles = (html: string, sourcePageUrl: string): SourceArticle[] => {
  const host = (() => {
    try {
      return new URL(sourcePageUrl).hostname;
    } catch {
      return '';
    }
  })();

  const now = Date.now();
  const anchorMatches = html.match(/<a[^>]+href=["'][^"']+["'][^>]*>[\s\S]*?<\/a>/gi) || [];
  const articles: SourceArticle[] = [];

  for (const anchor of anchorMatches) {
    const href = anchor.match(/href=["']([^"']+)["']/i)?.[1]?.trim() || '';
    const linkTextRaw = stripHtml(anchor);
    const linkText = decodeHtmlEntities(linkTextRaw).trim();

    if (!href || !linkText || linkText.length < 25) {
      continue;
    }

    const fullUrl = absoluteUrl(sourcePageUrl, href);
    if (!fullUrl.startsWith('http')) {
      continue;
    }

    if (host && !fullUrl.includes(host)) {
      continue;
    }

    if (!/\/uae\/legal/i.test(fullUrl) && !/legal/i.test(linkText)) {
      continue;
    }

    articles.push({
      title: linkText,
      summary: linkText,
      url: fullUrl,
      publishedAt: now,
      imageUrl: undefined,
    });
  }

  return articles;
};

const extractMetaContent = (html: string, propertyNames: string[]): string => {
  for (const propertyName of propertyNames) {
    const pattern = new RegExp(
      `<meta[^>]+(?:property|name)=["']${propertyName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'][^>]*content=["']([^"']+)["'][^>]*>`,
      'i'
    );
    const match = html.match(pattern);
    if (match?.[1]) {
      return match[1].trim();
    }
  }

  return '';
};

const fetchImageFromArticlePage = async (articleUrl: string): Promise<string | undefined> => {
  try {
    const response = await fetch(articleUrl, {
      cache: 'no-store',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AlmahyBot/1.0; +https://almahy.com)',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    if (!response.ok) {
      return undefined;
    }

    const html = await response.text();
    const metaImage = firstString(
      extractMetaContent(html, ['og:image', 'twitter:image', 'twitter:image:src', 'article:image']),
      extractMetaContent(html, ['og:image:secure_url'])
    );
    if (metaImage) {
      return metaImage;
    }

    const fromJsonLd = parseJsonLdArticles(html, articleUrl)[0]?.imageUrl;
    if (fromJsonLd) {
      return fromJsonLd;
    }

    const imgMatch = html.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
    return imgMatch?.[1]?.trim() || undefined;
  } catch (error) {
    console.error('Failed to fetch article image:', articleUrl, error);
    return undefined;
  }
};

const fetchArticlesFromWebPage = async (url: string): Promise<SourceArticle[]> => {
  try {
    const response = await fetch(url, {
      cache: 'no-store',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AlmahyBot/1.0; +https://almahy.com)',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    if (!response.ok) {
      return [];
    }

    const html = await response.text();
    const fromJsonLd = parseJsonLdArticles(html, url);
    if (fromJsonLd.length > 0) {
      return Promise.all(
        fromJsonLd.map(async (article) => ({
          ...article,
          imageUrl: article.imageUrl || (await fetchImageFromArticlePage(article.url)),
        }))
      );
    }

    const fromAnchors = parseAnchorArticles(html, url);
    return Promise.all(
      fromAnchors.map(async (article) => ({
        ...article,
        imageUrl: article.imageUrl || (await fetchImageFromArticlePage(article.url)),
      }))
    );
  } catch (error) {
    console.error('Failed to load web source:', url, error);
    return [];
  }
};

const loadSourceArticles = async (): Promise<SourceArticle[]> => {
  const rawUrls = process.env.THIRD_PARTY_BLOG_RSS_URLS || '';
  const rssUrls = rawUrls
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  const rawWebUrls = process.env.THIRD_PARTY_BLOG_WEB_URLS || '';
  const configuredWebUrls = rawWebUrls
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
  const webUrls = Array.from(new Set([...DEFAULT_WEB_SOURCE_URLS, ...configuredWebUrls]));

  if (rssUrls.length === 0 && webUrls.length === 0) {
    return [];
  }

  const rssArticlesList = await Promise.all(
    rssUrls.map(async (url) => {
      try {
        const response = await fetch(url, { cache: 'no-store' });
        if (!response.ok) {
          return [] as SourceArticle[];
        }

        const xml = await response.text();
        return parseRssArticles(xml);
      } catch (error) {
        console.error('Failed to load RSS source:', url, error);
        return [] as SourceArticle[];
      }
    })
  );

  const webArticlesList = await Promise.all(webUrls.map((url) => fetchArticlesFromWebPage(url)));

  const dedupedByUrl = new Map<string, SourceArticle>();
  const combined = [...rssArticlesList.flat(), ...webArticlesList.flat()];

  for (const article of combined) {
    const key = article.url.trim().toLowerCase();
    if (!key) {
      continue;
    }
    const existing = dedupedByUrl.get(key);
    if (!existing || article.publishedAt > existing.publishedAt) {
      dedupedByUrl.set(key, article);
    }
  }

  return Array.from(dedupedByUrl.values()).sort((a, b) => b.publishedAt - a.publishedAt);
};

const pickFirstUnusedImage = (candidates: Array<string | null | undefined>, excludeUrls?: Set<string>): string | null => {
  for (const candidate of candidates) {
    const normalized = (candidate || '').trim();
    if (!normalized) {
      continue;
    }
    if (excludeUrls?.has(normalized)) {
      continue;
    }
    return normalized;
  }
  return null;
};

const pickLocalUaeLegalImage = (seedText: string, excludeUrls?: Set<string>): string => {
  let hash = 0;
  const normalizedSeed = seedText || Date.now().toString();
  for (let index = 0; index < normalizedSeed.length; index += 1) {
    hash = (hash * 31 + normalizedSeed.charCodeAt(index)) >>> 0;
  }

  for (let offset = 0; offset < LOCAL_UAE_LEGAL_IMAGES.length; offset += 1) {
    const image = LOCAL_UAE_LEGAL_IMAGES[(hash + offset) % LOCAL_UAE_LEGAL_IMAGES.length];
    if (!excludeUrls?.has(image)) {
      return image;
    }
  }

  return DEFAULT_IMAGE;
};

const buildImageQuery = (contentText: string): string => {
  const cleaned = contentText
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .filter((token) => token.length > 2)
    .slice(0, 10)
    .join(' ');

  return `${cleaned} uae dubai legal law firm corporate office contract compliance meeting`;
};

const buildAiImagePrompt = (contextText: string): string => {
  const cleaned = contextText.replace(/\s+/g, ' ').trim().slice(0, 500);
  return [
    'Create a photorealistic, professional hero image for a UAE legal services blog.',
    'Scene should show legal/corporate context in UAE: office, contracts, business meeting, legal documents, courthouse details.',
    'Do not use nature landscapes, beaches, mountains, forests, or abstract art.',
    'No text overlays, no logos, no watermarks.',
    `Topic context: ${cleaned || 'UAE legal compliance for businesses and residents.'}`,
  ].join(' ');
};

const uploadAiImageToImageKit = async (params: {
  b64Image?: string;
  sourceUrl?: string;
  uniquenessKey: string;
}): Promise<string | null> => {
  if (!imagekit) {
    return null;
  }

  const fileNameBase = slugify(`legal-uae-${params.uniquenessKey}`) || `legal-uae-${Date.now()}`;
  const fileName = `${fileNameBase}.png`;

  const filePayload = params.b64Image
    ? `data:image/png;base64,${params.b64Image}`
    : params.sourceUrl || '';

  if (!filePayload) {
    return null;
  }

  const uploaded = await imagekit.files.upload({
    file: filePayload,
    fileName,
    folder: '/almahy/blogs/ai-generated',
    useUniqueFileName: true,
  });

  return uploaded.url || null;
};

const generateAiLegalImage = async (contextText: string, uniquenessKey: string): Promise<string | null> => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return null;
  }

  const baseUrl = (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
  const imageModel = process.env.OPENAI_IMAGE_MODEL || 'gpt-image-1';

  const response = await fetch(`${baseUrl}/images/generations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: imageModel,
      prompt: buildAiImagePrompt(contextText),
      size: '1536x1024',
      n: 1,
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('OpenAI image generation failed:', errorText);
    return null;
  }

  const data = (await response.json()) as OpenAIImageResponse;
  const firstImage = data.data?.[0];
  if (!firstImage) {
    return null;
  }

  try {
    const uploadedUrl = await uploadAiImageToImageKit({
      b64Image: firstImage.b64_json,
      sourceUrl: firstImage.url,
      uniquenessKey,
    });

    if (uploadedUrl) {
      return uploadedUrl;
    }
  } catch (error) {
    console.error('Failed to upload AI image to ImageKit:', error);
  }

  return firstImage.url || null;
};

const fetchPexelsImage = async (query: string, excludeUrls?: Set<string>): Promise<string | null> => {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) {
    return null;
  }

  const response = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=6&orientation=landscape`,
    {
      headers: { Authorization: apiKey },
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as PexelsResponse;
  const candidates = (data.photos || []).map((photo) => photo.src?.large2x || photo.src?.large || photo.src?.medium || null);
  return pickFirstUnusedImage(candidates, excludeUrls);
};

const fetchUnsplashImage = async (query: string, excludeUrls?: Set<string>): Promise<string | null> => {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    return null;
  }

  const response = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=6&orientation=landscape`,
    {
      headers: { Authorization: `Client-ID ${accessKey}` },
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as UnsplashResponse;
  const candidates = (data.results || []).map((item) => item.urls?.regular || null);
  return pickFirstUnusedImage(candidates, excludeUrls);
};

const fetchContextualImage = async (
  contentText: string,
  options?: { excludeUrls?: Set<string>; uniquenessKey?: string; preferAi?: boolean; allowLocalFallback?: boolean }
): Promise<string> => {
  const query = buildImageQuery(contentText);
  const excludeUrls = options?.excludeUrls;

  if (options?.preferAi) {
    try {
      const aiImage = await generateAiLegalImage(contentText, options?.uniquenessKey || Date.now().toString());
      if (aiImage && !excludeUrls?.has(aiImage)) {
        return aiImage;
      }
    } catch (error) {
      console.error('AI image generation failed:', error);
    }
  }

  try {
    const pexels = await fetchPexelsImage(query, excludeUrls);
    if (pexels) {
      return pexels;
    }
  } catch (error) {
    console.error('Pexels image fetch failed:', error);
  }

  try {
    const unsplash = await fetchUnsplashImage(query, excludeUrls);
    if (unsplash) {
      return unsplash;
    }
  } catch (error) {
    console.error('Unsplash image fetch failed:', error);
  }

  if (options?.allowLocalFallback === false) {
    return '';
  }

  const seed = slugify(`${contentText}-${options?.uniquenessKey || Date.now().toString()}`) || Date.now().toString();
  return pickLocalUaeLegalImage(seed, excludeUrls);
};

const buildImageSearchContext = (payload: GeneratedBlogPayload, source?: SourceArticle): string => {
  return [
    payload.title || '',
    payload.shortDescription || '',
    (payload.content || '').slice(0, 360),
    source?.title || '',
    source?.summary || '',
  ]
    .join(' ')
    .trim();
};

const generateBlogContent = async (
  source?: SourceArticle,
  avoidTitles: string[] = [],
  angleHint?: string
): Promise<GeneratedBlogPayload> => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured.');
  }

  const baseUrl = (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
  const model = process.env.OPENAI_PRODUCT_AUTOFILL_MODEL || 'gpt-4.1-mini';
  const today = getDateKey();

  const prompt = [
    'Create one professional legal blog post for a UAE legal services company.',
    'Focus on practical and compliant advice for residents, non-residents, and businesses.',
    'Keep it educational and non-definitive (not legal advice).',
    angleHint ? `Topic angle: ${angleHint}.` : '',
    avoidTitles.length > 0 ? `Avoid titles similar to: ${avoidTitles.join(' | ')}.` : '',
    'Do not copy source text verbatim; write original wording.',
    'Return JSON only with keys: title, titleAr, shortDescription, shortDescriptionAr, content, contentAr.',
    'Use plain text only (no markdown).',
    'English content should be around 450-700 words.',
    source
      ? `Source context: title="${source.title}", summary="${source.summary}", url="${source.url}", publishedAt="${new Date(source.publishedAt).toISOString()}".`
      : 'No source article is provided; pick a relevant UAE legal topic.',
    `Use this date context: ${today}.`,
  ]
    .filter(Boolean)
    .join(' ');

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content: 'You are a legal content writer. Output only valid JSON matching requested keys.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI request failed: ${errorText}`);
  }

  const data = (await response.json()) as OpenAIResponse;
  const content = data.choices?.[0]?.message?.content || '{}';
  return parseGeneratedPayload(content);
};

const buildAutoBlog = async (
  payload: GeneratedBlogPayload,
  source?: SourceArticle,
  options?: { excludeUrls?: Set<string> }
): Promise<BlogPost> => {
  const today = getDateKey();
  const id = `${AUTO_BLOG_ID_PREFIX}${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const fallbackTitle = `UAE Legal Update - ${today}`;

  const title = (payload.title || fallbackTitle).trim();
  const shortDescription = (payload.shortDescription || 'UAE legal update for residents and businesses.').trim();
  const content = (payload.content || 'New legal update will be available soon.').trim();
  const publishedAt = source?.publishedAt || Date.now();

  const sourceImage = source?.imageUrl?.trim() || '';
  const sourceImageAllowed = sourceImage && !options?.excludeUrls?.has(sourceImage);

  const image = sourceImageAllowed
    ? sourceImage
    : await fetchContextualImage(
        buildImageSearchContext(
          {
            ...payload,
            title,
            shortDescription,
            content,
          },
          source
        ),
        {
          excludeUrls: options?.excludeUrls,
          uniquenessKey: id,
        }
      );

  return {
    id,
    slug: slugify(title || id),
    title,
    titleAr: payload.titleAr?.trim() || undefined,
    shortDescription,
    shortDescriptionAr: payload.shortDescriptionAr?.trim() || undefined,
    content,
    contentAr: payload.contentAr?.trim() || undefined,
    date: formatBlogDate(publishedAt),
    image,
    imageAr: image,
    bannerImage: image,
    bannerImageAr: image,
    createdAt: publishedAt,
  };
};

const parseFillTarget = (requestUrl: URL): number | null => {
  const rawTarget = requestUrl.searchParams.get('fillTo');
  if (!rawTarget) {
    return null;
  }

  const parsed = Number(rawTarget);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return Math.min(Math.floor(parsed), MAX_AUTO_BLOGS);
};

const shouldRefreshImages = (requestUrl: URL): boolean => requestUrl.searchParams.get('refreshImages') === '1';
const shouldDedupe = (requestUrl: URL): boolean => requestUrl.searchParams.get('dedupe') === '1';
const shouldRefreshOnlyDuplicates = (requestUrl: URL): boolean => requestUrl.searchParams.get('onlyDuplicates') === '1';
const parseRefreshBlogId = (requestUrl: URL): string | null => requestUrl.searchParams.get('blogId')?.trim() || null;
const parseManualKhaleejCount = (requestUrl: URL): number => {
  const enabled = requestUrl.searchParams.get('addKhaleej') === '1';
  if (!enabled) {
    return 0;
  }

  const rawCount = requestUrl.searchParams.get('count');
  if (!rawCount) {
    return 5;
  }

  const parsed = Number(rawCount);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 5;
  }

  return Math.min(Math.floor(parsed), 10);
};

const isKhaleejLegalArticle = (article: SourceArticle): boolean => {
  const url = article.url.toLowerCase();
  return url.includes('khaleejtimes.com') && url.includes('/uae/legal');
};

const runDailyGeneration = async (request: Request) => {
  if (!hasValidAutomationToken(request)) {
    return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 });
  }

  const requestUrl = new URL(request.url);
  const force = requestUrl.searchParams.get('force') === '1';
  const fillTarget = parseFillTarget(requestUrl);
  const refreshImages = shouldRefreshImages(requestUrl);
  const refreshOnlyDuplicates = shouldRefreshOnlyDuplicates(requestUrl);
  const refreshBlogId = parseRefreshBlogId(requestUrl);
  const manualKhaleejCount = parseManualKhaleejCount(requestUrl);
  const dedupe = shouldDedupe(requestUrl);

  const sourceArticles = await loadSourceArticles();
  const allBlogs = await listBlogsFromMongo();
  const autoBlogs = allBlogs.filter((blog) => blog.id.startsWith(AUTO_BLOG_ID_PREFIX));

  if (dedupe) {
    const sortedAutoBlogs = [...autoBlogs].sort((a, b) => b.createdAt - a.createdAt);
    const seenTitles = new Set<string>();
    const removedIds: string[] = [];

    for (const blog of sortedAutoBlogs) {
      const key = normalizeTitle(blog.title || blog.slug || '');
      if (!key) {
        continue;
      }

      if (seenTitles.has(key)) {
        await deleteBlogFromMongo(blog.id);
        removedIds.push(blog.id);
      } else {
        seenTitles.add(key);
      }
    }

    return NextResponse.json({
      success: true,
      skipped: removedIds.length === 0,
      mode: 'dedupe',
      removed: removedIds.length,
      removedIds,
    });
  }

  if (refreshImages) {
    if (autoBlogs.length === 0) {
      return NextResponse.json({
        success: true,
        skipped: true,
        message: 'No auto blogs found to refresh images.',
        refreshed: 0,
      });
    }

    const imageUsage = new Map<string, number>();
    for (const blog of autoBlogs) {
      const key = (blog.image || '').trim();
      if (!key) {
        continue;
      }
      imageUsage.set(key, (imageUsage.get(key) || 0) + 1);
    }

    const refreshTargets = refreshOnlyDuplicates
      ? autoBlogs.filter((blog) => {
          const key = (blog.image || '').trim();
          const usage = key ? imageUsage.get(key) || 0 : 0;
          return usage > 1 || key === DEFAULT_IMAGE;
        })
      : autoBlogs;

    const scopedTargets = refreshBlogId
      ? refreshTargets.filter((blog) => blog.id === refreshBlogId)
      : refreshTargets;

    if (scopedTargets.length === 0) {
      return NextResponse.json({
        success: true,
        skipped: true,
        mode: 'refreshImages',
        message: refreshBlogId ? 'No matching auto blog found for refresh.' : 'No duplicate auto-blog images found.',
        refreshed: 0,
      });
    }

    const refreshedIds: string[] = [];
    const failedIds: string[] = [];
    const usedImageUrls = new Set<string>(
      autoBlogs
        .map((blog) => (blog.image || '').trim())
        .filter((value) => Boolean(value) && value !== DEFAULT_IMAGE)
    );

    for (const existingBlog of scopedTargets) {
      const context = [existingBlog.title, existingBlog.shortDescription, existingBlog.content.slice(0, 320)]
        .filter(Boolean)
        .join(' ');
      const nextImage = await fetchContextualImage(context, {
        excludeUrls: usedImageUrls,
        uniquenessKey: existingBlog.id,
        preferAi: true,
        allowLocalFallback: false,
      });
      if (!nextImage) {
        failedIds.push(existingBlog.id);
        continue;
      }
      usedImageUrls.add(nextImage);

      const updatedBlog: BlogPost = {
        ...existingBlog,
        image: nextImage,
        imageAr: nextImage,
        bannerImage: nextImage,
        bannerImageAr: nextImage,
      };

      const saved = await saveBlogToMongo(updatedBlog, 'auto-openai-image-refresh');
      refreshedIds.push(saved.id);
    }

    return NextResponse.json({
      success: true,
      skipped: refreshedIds.length === 0,
      mode: 'refreshImages',
      refreshed: refreshedIds.length,
      refreshedIds,
      failed: failedIds.length,
      failedIds,
      message: failedIds.length > 0 ? 'Some blog images could not be regenerated from AI.' : undefined,
    });
  }

  if (manualKhaleejCount > 0) {
    const knownTitles = new Set(allBlogs.map((blog) => normalizeTitle(blog.title || blog.slug || '')).filter(Boolean));
    const usedImageUrls = new Set<string>(
      allBlogs
        .map((blog) => (blog.image || '').trim())
        .filter((value) => Boolean(value) && value !== DEFAULT_IMAGE)
    );
    const usedKhaleejUrls = new Set<string>();
    const khaleejArticles = sourceArticles.filter((article) => isKhaleejLegalArticle(article));

    if (khaleejArticles.length === 0) {
      return NextResponse.json({
        success: true,
        skipped: true,
        mode: 'manualKhaleej',
        requested: manualKhaleejCount,
        created: 0,
        message: 'No Khaleej Times legal source articles were found.',
      });
    }

    const createdIds: string[] = [];
    const usedSourceUrls: string[] = [];
    const currentAutoBlogs = [...autoBlogs];

    for (let index = 0; index < manualKhaleejCount; index += 1) {
      const source = khaleejArticles.find((article) => !usedKhaleejUrls.has(article.url));
      if (!source) {
        break;
      }

      usedKhaleejUrls.add(source.url);
      let saved: BlogPost | null = null;

      for (let attempt = 0; attempt < TITLE_GENERATION_ATTEMPTS; attempt += 1) {
        const angleHint = KHAALEJ_KEYWORD_TOPICS[(index + attempt) % KHAALEJ_KEYWORD_TOPICS.length];
        const avoidTitles = Array.from(knownTitles).slice(-40);
        const generated = await generateBlogContent(source, avoidTitles, angleHint);
        const blogDraft = await buildAutoBlog(generated, source, { excludeUrls: usedImageUrls });
        const normalized = normalizeTitle(blogDraft.title || blogDraft.slug || '');

        if (normalized && knownTitles.has(normalized)) {
          continue;
        }

        if (currentAutoBlogs.length >= MAX_AUTO_BLOGS) {
          const oldestAutoBlog = currentAutoBlogs.reduce((oldest, current) =>
            current.createdAt < oldest.createdAt ? current : oldest
          );
          await deleteBlogFromMongo(oldestAutoBlog.id);
          const removeIndex = currentAutoBlogs.findIndex((blog) => blog.id === oldestAutoBlog.id);
          if (removeIndex >= 0) {
            currentAutoBlogs.splice(removeIndex, 1);
          }
        }

        saved = await saveBlogToMongo(blogDraft, 'manual-khaleej');
        currentAutoBlogs.push(saved);
        usedImageUrls.add(blogDraft.image);
        if (normalized) {
          knownTitles.add(normalized);
        }
        break;
      }

      if (saved) {
        createdIds.push(saved.id);
        usedSourceUrls.push(source.url);
      }
    }

    return NextResponse.json({
      success: true,
      skipped: createdIds.length === 0,
      mode: 'manualKhaleej',
      requested: manualKhaleejCount,
      created: createdIds.length,
      createdIds,
      usedSources: usedSourceUrls,
    });
  }

  if (fillTarget) {
    const toGenerate = Math.max(0, fillTarget - autoBlogs.length);
    const knownTitles = new Set(allBlogs.map((blog) => normalizeTitle(blog.title || blog.slug || '')).filter(Boolean));

    if (toGenerate === 0) {
      return NextResponse.json({
        success: true,
        skipped: true,
        message: 'Auto blogs already meet target.',
        autoBlogCount: autoBlogs.length,
        target: fillTarget,
      });
    }

    const createdIds: string[] = [];
    const usedSourceUrls = new Set<string>();
    const usedImageUrls = new Set<string>(
      allBlogs
        .map((blog) => (blog.image || '').trim())
        .filter((value) => Boolean(value) && value !== DEFAULT_IMAGE)
    );

    for (let index = 0; index < toGenerate; index += 1) {
      const source =
        sourceArticles.find((article) => !usedSourceUrls.has(article.url)) ||
        sourceArticles[index % Math.max(sourceArticles.length, 1)] ||
        undefined;

      if (source?.url) {
        usedSourceUrls.add(source.url);
      }

      let saved: BlogPost | null = null;

      for (let attempt = 0; attempt < TITLE_GENERATION_ATTEMPTS; attempt += 1) {
        const angleHint = TOPIC_ANGLE_HINTS[(index + attempt) % TOPIC_ANGLE_HINTS.length];
        const avoidTitles = Array.from(knownTitles).slice(-30);
        const generated = await generateBlogContent(source, avoidTitles, angleHint);
        const blogDraft = await buildAutoBlog(generated, source, { excludeUrls: usedImageUrls });
        const normalized = normalizeTitle(blogDraft.title || blogDraft.slug || '');

        if (normalized && knownTitles.has(normalized)) {
          continue;
        }

        saved = await saveBlogToMongo(blogDraft, 'auto-openai');
        usedImageUrls.add(blogDraft.image);
        if (normalized) {
          knownTitles.add(normalized);
        }
        break;
      }

      if (saved) {
        createdIds.push(saved.id);
      }
    }

    return NextResponse.json({
      success: true,
      skipped: false,
      mode: 'fillTo',
      created: createdIds.length,
      autoBlogCount: autoBlogs.length + createdIds.length,
      target: fillTarget,
      createdIds,
    });
  }

  const latestAutoBlog = autoBlogs.reduce<BlogPost | null>((latest, current) => {
    if (!latest) {
      return current;
    }
    return current.createdAt > latest.createdAt ? current : latest;
  }, null);

  if (!force && latestAutoBlog) {
    const elapsedDays = daysBetween(latestAutoBlog.createdAt, Date.now());
    if (elapsedDays < AUTO_BLOG_INTERVAL_DAYS) {
      const nextEligibleAt = new Date(latestAutoBlog.createdAt + AUTO_BLOG_INTERVAL_DAYS * 24 * 60 * 60 * 1000).toISOString();
      return NextResponse.json({
        success: true,
        skipped: true,
        message: 'Next auto blog is not due yet.',
        nextEligibleAt,
        autoBlogCount: autoBlogs.length,
      });
    }
  }

  if (autoBlogs.length >= MAX_AUTO_BLOGS) {
    const oldestAutoBlog = autoBlogs.reduce((oldest, current) =>
      current.createdAt < oldest.createdAt ? current : oldest
    );
    await deleteBlogFromMongo(oldestAutoBlog.id);
  }

  const source = sourceArticles[0];
  const knownTitles = new Set(allBlogs.map((blog) => normalizeTitle(blog.title || blog.slug || '')).filter(Boolean));
  const usedImageUrls = new Set<string>(
    allBlogs
      .map((blog) => (blog.image || '').trim())
      .filter((value) => Boolean(value) && value !== DEFAULT_IMAGE)
  );
  let saved: BlogPost | null = null;

  for (let attempt = 0; attempt < TITLE_GENERATION_ATTEMPTS; attempt += 1) {
    const angleHint = TOPIC_ANGLE_HINTS[attempt % TOPIC_ANGLE_HINTS.length];
    const generated = await generateBlogContent(source, Array.from(knownTitles).slice(-30), angleHint);
    const blogDraft = await buildAutoBlog(generated, source, { excludeUrls: usedImageUrls });
    const normalized = normalizeTitle(blogDraft.title || blogDraft.slug || '');

    if (normalized && knownTitles.has(normalized)) {
      continue;
    }

    saved = await saveBlogToMongo(blogDraft, 'auto-openai');
    break;
  }

  if (!saved) {
    return NextResponse.json({
      success: true,
      skipped: true,
      message: 'Could not generate a unique blog title after retries.',
    });
  }

  return NextResponse.json({ success: true, skipped: false, blog: saved });
};

export async function GET(request: Request) {
  try {
    return await runDailyGeneration(request);
  } catch (error) {
    console.error('Blogs auto-daily GET error:', error);
    return NextResponse.json({ success: false, message: 'Failed to generate daily blog.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    return await runDailyGeneration(request);
  } catch (error) {
    console.error('Blogs auto-daily POST error:', error);
    return NextResponse.json({ success: false, message: 'Failed to generate daily blog.' }, { status: 500 });
  }
}
