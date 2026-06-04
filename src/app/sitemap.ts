import type { MetadataRoute } from "next";
import { listBlogsFromMongo } from "@/lib/blogs-server";

const DEFAULT_SITE_URL = "https://almahy.com";
const LOCALES = ["en", "ar"] as const;
const SECOND_PASSPORT_COUNTRIES = [
  "antigua-barbuda",
  "st-kitts-nevis",
  "saint-lucia",
  "dominica",
  "turkiye",
] as const;

const getBaseUrl = () => {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || DEFAULT_SITE_URL;
  return configuredUrl.replace(/\/$/, "");
};

const buildAbsoluteUrl = (baseUrl: string, path: string) => `${baseUrl}${path}`;
type SitemapEntry = MetadataRoute.Sitemap[number];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const now = new Date();

  const rootRoutes = [
    "/",
    "/contact",
    "/login",
    "/our-history",
    "/packages",
    "/portal",
    "/about/our-history",
    "/about/who-we-are",
  ];

  const localizedRoutes = [
    "",
    "/about",
    "/accounting-services",
    "/admin",
    "/blogs",
    "/contact",
    "/corporate-services",
    "/dashboard",
    "/expert-reports",
    "/legal-services",
    "/login",
    "/notary-public-services",
    "/pricing-table",
    "/privacy",
    "/professional-services",
    "/profile",
    "/second-passport",
    "/services",
    "/tax-services",
    "/terms",
  ];

  const staticEntries: SitemapEntry[] = [
    ...rootRoutes.map(
      (route): SitemapEntry => ({
        url: buildAbsoluteUrl(baseUrl, route),
        lastModified: now,
        changeFrequency: "weekly",
        priority: route === "/" ? 1 : 0.75,
      })
    ),
    ...LOCALES.flatMap((locale) =>
      localizedRoutes.map(
        (route): SitemapEntry => ({
          url: buildAbsoluteUrl(baseUrl, `/${locale}${route}`),
          lastModified: now,
          changeFrequency: route === "" ? "daily" : "weekly",
          priority: route === "" ? 0.95 : 0.8,
        })
      )
    ),
    ...LOCALES.flatMap((locale) =>
      SECOND_PASSPORT_COUNTRIES.map(
        (country): SitemapEntry => ({
          url: buildAbsoluteUrl(baseUrl, `/${locale}/second-passport/${country}`),
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.7,
        })
      )
    ),
  ];

  try {
    const blogs = await listBlogsFromMongo();
    const blogEntries: SitemapEntry[] = blogs.flatMap((blog) =>
      LOCALES.map(
        (locale): SitemapEntry => ({
          url: buildAbsoluteUrl(baseUrl, `/${locale}/blogs/${encodeURIComponent(blog.slug)}`),
          lastModified: blog.createdAt ? new Date(blog.createdAt) : now,
          changeFrequency: "weekly",
          priority: 0.7,
        })
      )
    );

    return [...staticEntries, ...blogEntries];
  } catch (error) {
    console.error("Sitemap blog loading failed, returning static entries only.", error);
    return staticEntries;
  }
}
