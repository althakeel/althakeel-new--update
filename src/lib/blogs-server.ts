import { WithId } from 'mongodb';
import { BlogPost, BlogsBannerCard, BlogsPageBannerConfig, slugify } from '@/lib/blogs';
import { getMongoDb } from '@/lib/mongodb';

const BLOGS_COLLECTION = 'blogs';
const SITE_CONTENT_COLLECTION = 'siteContent';
const BLOGS_BANNER_KEY = 'blogsPageBanner';

interface BlogDocument extends BlogPost {
  updatedAt?: number;
  updatedBy?: string | null;
}

interface BlogsBannerDocument {
  key: string;
  bannerUrl: string;
  card: BlogsBannerCard;
  updatedAt?: number;
  updatedBy?: string | null;
}

const emptyBannerCard = (): BlogsBannerCard => ({
  titleEn: '',
  titleAr: '',
  subEn: '',
  subAr: '',
});

const normalizeBlogPost = (blog: BlogPost): BlogPost => ({
  ...blog,
  slug: slugify(blog.slug || blog.title || blog.id),
  title: blog.title.trim(),
  titleAr: blog.titleAr?.trim() || undefined,
  shortDescription: blog.shortDescription.trim(),
  shortDescriptionAr: blog.shortDescriptionAr?.trim() || undefined,
  content: blog.content.trim(),
  contentAr: blog.contentAr?.trim() || undefined,
  image: blog.image.trim(),
  imageAr: blog.imageAr?.trim() || undefined,
  bannerImage: blog.bannerImage?.trim() || undefined,
  bannerImageAr: blog.bannerImageAr?.trim() || undefined,
});

const normalizeBannerCard = (card?: Partial<BlogsBannerCard>): BlogsBannerCard => ({
  titleEn: card?.titleEn?.trim() || '',
  titleAr: card?.titleAr?.trim() || '',
  subEn: card?.subEn?.trim() || '',
  subAr: card?.subAr?.trim() || '',
});

const toBlogPost = (blog: WithId<BlogDocument> | BlogDocument): BlogPost => normalizeBlogPost({
  id: blog.id,
  slug: blog.slug,
  title: blog.title,
  titleAr: blog.titleAr,
  shortDescription: blog.shortDescription,
  shortDescriptionAr: blog.shortDescriptionAr,
  content: blog.content,
  contentAr: blog.contentAr,
  date: blog.date,
  image: blog.image,
  imageAr: blog.imageAr,
  bannerImage: blog.bannerImage,
  bannerImageAr: blog.bannerImageAr,
  createdAt: blog.createdAt,
});

const buildUniqueSlug = async (slug: string, blogId: string) => {
  const db = await getMongoDb();
  const collection = db.collection<BlogDocument>(BLOGS_COLLECTION);
  const baseSlug = slugify(slug || blogId);
  let candidate = baseSlug;
  let counter = 1;

  while (await collection.findOne({ slug: candidate, id: { $ne: blogId } as unknown as string })) {
    counter += 1;
    candidate = `${baseSlug}-${counter}`;
  }

  return candidate;
};

export const listBlogsFromMongo = async (): Promise<BlogPost[]> => {
  const db = await getMongoDb();
  const blogs = await db
    .collection<BlogDocument>(BLOGS_COLLECTION)
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  return blogs.map(toBlogPost);
};

export const getBlogBySlugFromMongo = async (slug: string): Promise<BlogPost | null> => {
  const db = await getMongoDb();
  const blog = await db.collection<BlogDocument>(BLOGS_COLLECTION).findOne({ slug });
  return blog ? toBlogPost(blog) : null;
};

export const getBlogByIdFromMongo = async (id: string): Promise<BlogPost | null> => {
  const db = await getMongoDb();
  const blog = await db.collection<BlogDocument>(BLOGS_COLLECTION).findOne({ id });
  return blog ? toBlogPost(blog) : null;
};

export const saveBlogToMongo = async (blog: BlogPost, updatedBy?: string): Promise<BlogPost> => {
  const db = await getMongoDb();
  const collection = db.collection<BlogDocument>(BLOGS_COLLECTION);
  const normalizedBlog = normalizeBlogPost(blog);
  const uniqueSlug = await buildUniqueSlug(normalizedBlog.slug, normalizedBlog.id);
  const savedBlog: BlogPost = {
    ...normalizedBlog,
    slug: uniqueSlug,
    createdAt: normalizedBlog.createdAt || Date.now(),
  };

  await collection.updateOne(
    { id: savedBlog.id },
    {
      $set: {
        ...savedBlog,
        updatedAt: Date.now(),
        updatedBy: updatedBy || null,
      },
    },
    { upsert: true }
  );

  return savedBlog;
};

export const deleteBlogFromMongo = async (blogId: string) => {
  const db = await getMongoDb();
  await db.collection<BlogDocument>(BLOGS_COLLECTION).deleteOne({ id: blogId });
};

export const loadBlogsPageBannerConfigFromMongo = async (): Promise<BlogsPageBannerConfig> => {
  const db = await getMongoDb();
  const document = await db.collection<BlogsBannerDocument>(SITE_CONTENT_COLLECTION).findOne({ key: BLOGS_BANNER_KEY });

  if (!document) {
    return {
      bannerUrl: '',
      card: emptyBannerCard(),
    };
  }

  return {
    bannerUrl: document.bannerUrl || '',
    card: normalizeBannerCard(document.card),
  };
};

export const saveBlogsPageBannerConfigToMongo = async (payload: {
  bannerUrl?: string;
  card?: BlogsBannerCard;
  updatedBy?: string;
}): Promise<BlogsPageBannerConfig> => {
  const db = await getMongoDb();
  const current = await loadBlogsPageBannerConfigFromMongo();
  const nextConfig: BlogsPageBannerConfig = {
    bannerUrl: payload.bannerUrl ?? current.bannerUrl,
    card: normalizeBannerCard(payload.card || current.card),
  };

  await db.collection<BlogsBannerDocument>(SITE_CONTENT_COLLECTION).updateOne(
    { key: BLOGS_BANNER_KEY },
    {
      $set: {
        key: BLOGS_BANNER_KEY,
        bannerUrl: nextConfig.bannerUrl,
        card: nextConfig.card,
        updatedAt: Date.now(),
        updatedBy: payload.updatedBy || null,
      },
    },
    { upsert: true }
  );

  return nextConfig;
};