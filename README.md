This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Auto Blog Generation

This project includes an automated blog generator endpoint at `/api/blogs/auto-daily`.

Required environment variables:

- `OPENAI_API_KEY`
- `OPENAI_BASE_URL` (default: `https://api.openai.com/v1`)
- `OPENAI_PRODUCT_AUTOFILL_MODEL` (default: `gpt-4.1-mini`)
- `BLOGS_AUTOMATION_SECRET` or `CRON_SECRET`

Optional for third-party sourcing:

- `THIRD_PARTY_BLOG_RSS_URLS` (comma-separated RSS feed URLs)
- `THIRD_PARTY_BLOG_WEB_URLS` (comma-separated web category/source URLs)
- `PEXELS_API_KEY` (preferred for contextual images)
- `UNSPLASH_ACCESS_KEY` (fallback image source)

How it works:

- It generates one blog every 5 days using OpenAI.
- Auto-generated posts use ids prefixed with `auto-openai-`.
- If RSS sources are configured, blog date uses the source post publish time (not the same date for all posts).
- If RSS sources are configured, OpenAI writes original content based on third-party source context.
- If web source URLs are configured (or defaulted), the generator also ingests article links from pages like Khaleej Times UAE Legal.
- Existing manual blogs are never deleted by this automation.
- Auto-generated blogs are kept until there are 50.
- Once 50 auto blogs exist, each new auto blog deletes only the oldest auto blog.
- If called before 5 days have passed, generation is skipped unless `?force=1` is provided.
- To start now and fill auto blogs immediately, call with `?fillTo=50`.
- Manual creation and editing in the dashboard continues to work as before.
- Images are fetched from third-party image providers by topic when API keys are configured.

Manual trigger examples:

```bash
curl -X POST "https://your-domain.com/api/blogs/auto-daily" \
	-H "Authorization: Bearer YOUR_AUTOMATION_SECRET"
```

Force regenerate for today:

```bash
curl -X POST "https://your-domain.com/api/blogs/auto-daily?force=1" \
	-H "Authorization: Bearer YOUR_AUTOMATION_SECRET"
```

Bootstrap now until 50 auto blogs:

```bash
curl -X POST "https://your-domain.com/api/blogs/auto-daily?fillTo=50" \
	-H "Authorization: Bearer YOUR_AUTOMATION_SECRET"
```

Refresh images for existing auto blogs now:

```bash
curl -X POST "https://your-domain.com/api/blogs/auto-daily?refreshImages=1" \
	-H "Authorization: Bearer YOUR_AUTOMATION_SECRET"
```

Manually add 5 blogs from Khaleej Times legal source:

```bash
curl -X POST "https://your-domain.com/api/blogs/auto-daily?addKhaleej=1&count=5" \
	-H "Authorization: Bearer YOUR_AUTOMATION_SECRET"
```

Remove repeated existing auto blogs (keeps newest per title):

```bash
curl -X POST "https://your-domain.com/api/blogs/auto-daily?dedupe=1" \
	-H "Authorization: Bearer YOUR_AUTOMATION_SECRET"
```

Scheduling:

- `vercel.json` includes an every-5-days cron schedule (`0 5 */5 * *`) that calls `/api/blogs/auto-daily`.
- On Vercel, configure `CRON_SECRET` so scheduled calls are authorized.
