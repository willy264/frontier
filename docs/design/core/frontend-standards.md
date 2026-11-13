# Frontend standards, SEO and performance

Use strict TypeScript, semantic HTML, one h1, ordered headings, landmarks, and button versus link correctly. Server components are the default in new Next.js work. Keep substantial content typed and separate from layout. Validate user input on the server or contract boundary.

## Accessibility

Keep focus visible, support keyboard operation, give icon buttons accessible names, label fields, link errors to inputs, and make all status changes readable without color or motion. Targets are at least 24x24px and preferably 44x44px on touch. Reflow at 320px and 200% zoom.

## Media

Use descriptive alt text for meaningful images and empty alt for decoration. Reserve dimensions or aspect ratio, use AVIF/WebP when applicable, lazy-load below-the-fold media, and provide pause controls for autoplay video.

## Performance and SEO

Target LCP <= 2.5s, INP <= 200ms, CLS <= 0.1 at p75 mobile. Lazy-load heavy libraries. Use unique title and description per route, canonical metadata, OG/Twitter metadata, structured data where truthful, sitemap, and robots for public marketing routes.

For FRONTIER, prioritize live contract reads and stable map layout over new effects. Do not claim Lighthouse results without running Lighthouse.
