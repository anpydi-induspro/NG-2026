# Between the Lines

A personal blog built with Astro.

## Make it yours
- Site name, tagline, and your name: `src/consts.ts`
- About page: `src/pages/about.astro`
- Posts: Markdown files in `src/content/posts` (see the "How to publish a new post" sample)
- Colors and fonts: `src/styles/global.css`

## Go live (free hosting on Cloudflare Pages)
1. Create a GitHub account, make a new repository, and upload all these files.
2. Sign in at dash.cloudflare.com, open Workers & Pages, choose Create, then Pages, then Connect to Git.
3. Pick your repository. Set Framework preset to Astro (build command `npm run build`, output folder `dist`).
4. Deploy. You'll get a free address like between-the-lines.pages.dev.
5. Optional: buy a domain, add it under Custom domains, and update `site` in `astro.config.mjs`.

## Preview on your computer (optional)
Install Node.js, then run `npm install` and `npm run dev`.
