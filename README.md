# Oussama Khela — Portfolio

3D portfolio for Oussama Khela, graphic designer, infographiste and video editor based in Fès, Morocco.

Built with Vite, React, TypeScript, Tailwind CSS v4, React Three Fiber / drei, GSAP (ScrollTrigger) and Lenis.

## Getting started

```bash
npm install
npm run dev
```

Production build: `npm run build` (output in `dist/`).

## Editing content

- **Projects** — `src/data/works.ts` (`WORKS`, `CATEGORIES`, experience, education, contact). Images live in `public/works/`. Set `featured: true` to show a project in the 3D "Selected works" ring.
- **Showreel** — set `REEL_SRC` in `src/components/EditSuite.tsx` (e.g. `"/reel.mp4"` in `public/`) and the monitor scrubs the real video with the scroll.
- **Palette** — tokens in `src/index.css` (`@theme`): saffron, henna and zellige green on kohl black, taken from the Chouara tannery dye vats.

## Credits

The curved 3D carousel is adapted from "Tweenly Curved Carousel" by Manjunath Irukulla (21st.dev, MIT License).
