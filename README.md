# FUELIX — React + Three.js

Complete React source for Zeeshan's animated protein-bar concept store.

## Windows / VS Code mein chalana

1. Node.js 22 LTS (ya newer supported LTS) install karein.
2. ZIP extract karein. `fuelix-react` folder VS Code mein open karein.
3. Terminal > New Terminal open karein aur run karein:

```bash
npm install
npm run dev
```

Terminal mein jo localhost link aaye usay browser mein open karein.
`index.html` ko direct double-click karne ke bajaye Vite server use karein.

## Production build

```bash
npm run build
npm run preview
```

`dist/` mein deployable website banti hai. ZIP mein verified production build
bhi included hai. React source edit karne ke baad build dobara run karein.

## Included features

- React state for flavours, cart, quantity, product details and demo orders.
- Three.js 3D chocolate bar with procedural chocolate/crunch textures.
- Scroll-controlled wrapper reveal and layer separation.
- Layer buttons, separation slider, drag rotation and auto rotation.
- CSS 3D fallback when WebGL is unavailable.
- Responsive layout and reduced-motion support.
- Local browser cart persistence, dialog keyboard controls and focus handling.

## Project files

- `src/App.jsx`: React shop state, product details, shopping bag and demo order.
- `src/components/Storefront.jsx`: page layout, hero and product storytelling.
- `src/chocolate.js`: Three.js renderer, scroll animation and CSS fallback.
- `src/styles.css`: all styling and responsive layouts.
- `src/main.jsx`: React entry point.
- `package.json` / `package-lock.json`: dependencies and scripts.

## Notes

This is a concept brand and demo store. All prices, pack weights, product copy
and formulation details are illustrative. No real payments, order service,
shipping, authentication or backend are configured. Demo order completion is
local to the browser. No API keys or credentials are required.

Google Fonts are loaded over the internet, with system-font fallbacks. The
first npm install needs internet; the 3D library is bundled at build time.

WebGL rendering requires browser graphics support. When unavailable, the
animated CSS 3D fallback is shown. WebGL could not be visually tested in the
build environment because graphics support was disabled; fallback visuals and
shop interactions were checked on the original site. The React production
build is checked separately.

## Third-party software

React, React DOM, Three.js and Vite are third-party open-source dependencies.
Their license notices are supplied by the respective npm packages; see
THIRD_PARTY_NOTICES.md. No node_modules, private hosting configuration,
credentials or deployment access tokens are included in this ZIP.
