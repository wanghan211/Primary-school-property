# User Prompts Collection (EduHomes SG)

This document compiles all user prompts submitted during the development, iteration, API integration, and deployment of **EduHomes SG (Primary School Property Intelligence Platform)** in chronological order.

---

## Prompt 1: Initial Product Concept & Core Features

```text
build a website that can track all the primary schools in SG and related properties within 1km and 2km. Features:
1. show real-time live map of 1km and 2km boundary of primary schools
2. check real-time and historical transactions for related property within 1km and 2km. The property type includes: HDB and private condo/landed
3. API support: real-time OneMap API (token lasts 3 days, can renew, provides SLA authentic basemap and school coordinates), Singapore URA API (private properties and carparks), Singapore real-time HDB API (10,000 recent transactions)
4. modern interactive UI with filters, charts, radius analysis, and route planning
```

### Context & Implementation:
- Initial project architecture as a React + Vite + TypeScript application with Express API server.
- Interactive Leaflet geodesic map rendering 1km & 2km circular boundary rings for Singapore Primary Schools.
- Integrated official Singapore Land Authority (SLA) OneMap API, Data.gov.sg HDB resale transaction dataset, and URA property intelligence.
- Rich filtering (property type, price range, room configuration, distance zone, tenure), price trend charts, and OneMap walking/driving route analysis.

---

## Prompt 2: Data Accuracy, School Preference & Phase Recommendations

```text
make sure the data is accurate. 
Also, allow user to set their preferred primary school, track historical transactions for target property, and provide realistic recommendations based on family budget, commuting distance, and school registration phases (Phase 1, 2A, 2B, 2C).
```

### Context & Implementation:
- Primary school registry cross-verified against official Ministry of Education (MOE) school data.
- Preferred primary school pinning and bookmarking feature stored in localStorage.
- Realistic property & school recommendations algorithm accounting for MOE Primary 1 registration phases (Phase 1, Phase 2A, Phase 2B, Phase 2C) with priority distance rules (<1km, 1-2km, >2km).
- Financial feasibility & family budget calculator with monthly mortgage estimations and commuting distance calculations.

---

## Prompt 3: Official URA Data Service & OneMap Basemap Integration

```text
integrate URA data service to support real-time data check:
Daily token service: https://www.ura.gov.sg/uraDataService/insertNewToken.action
Private property transaction: https://www.ura.gov.sg/uraDataService/invokeUraDS?service=PMI_Resi_Transaction
Carpark: https://www.ura.gov.sg/uraDataService/invokeUraDS?service=Car_Park_Availability
Also OneMap API for SLA basemap:
var basemap = L.tileLayer('https://www.onemap.gov.sg/maps/tiles/Default/{z}/{x}/{y}.png', {
  detectRetina: true,
  maxZoom: 19,
  minZoom: 11,
  attribution: '<img src="https://www.onemap.gov.sg/web-assets/images/logo/om_logo.png" style="height:20px;width:20px;"/>&nbsp;<a href="https://www.onemap.gov.sg/" target="_blank" rel="noopener noreferrer">OneMap</a>&nbsp;&copy;&nbsp;contributors&nbsp;&#124;&nbsp;<a href="https://www.sla.gov.sg/" target="_blank" rel="noopener noreferrer">Singapore Land Authority</a>'
});
```

### Context & Implementation:
- Built `/api/ura/token.ts` to request and manage daily URA access tokens via `insertNewToken.action`.
- Built `/api/ura/transactions.ts` for querying real-time private condo and landed property transactions via URA Data Service `PMI_Resi_Transaction`.
- Built `/api/ura/carparks.ts` for live URA carpark lot availability.
- Integrated authentic SLA OneMap tile layer with required SLA attribution across all interactive map views and minimaps.

---

## Prompt 4: Directory Restructuring & Vercel TS2688 (vite/client) Fix

```text
clean up the project directory and group all the apis into /api folder.
vercel deployment has this error please take a look and fix
error TS2688: Cannot find type definition file for 'vite/client'.
The file is in the program because:
Entry point of type library 'vite/client' specified in compilerOptions
```

### Context & Implementation:
- Consolidated all serverless API endpoints into `/api` (`/api/onemap/*`, `/api/ura/*`, `/api/hdb/*`, `/api/health.ts`, `/api/basemap.ts`).
- Removed obsolete and duplicate endpoints (`api/health/index.ts`, `api/private-property/index.ts`).
- Created `src/constants/basemap.ts` to decouple frontend Leaflet components from backend serverless handlers.
- Removed `"types": ["vite/client"]` from `compilerOptions` in `tsconfig.json` and added `src/vite-env.d.ts` reference to resolve the Vite client type library error.

---

## Prompt 5: Continuation Instruction

```text
Continue
```

### Context & Implementation:
- Executed comprehensive project directory audit, removed redundant files, and verified compilation and TypeScript check.

---

## Prompt 6: GitHub Remote Push

```text
git push https://<GITHUB_PERSONAL_ACCESS_TOKEN>@github.com/wanghan211/Primary-school-property.git
```

### Context & Implementation:
- Verified git status and pushed branch `main` to `https://github.com/wanghan211/Primary-school-property.git`.

---

## Prompt 7: Vercel TS2688 (node) Error Resolution

```text
Vercel shows this error, please help me resolve
13:03:11.474 error TS2688: Cannot find type definition file for 'node'.
13:03:11.475   The file is in the program because:
13:03:11.475     Entry point of type library 'node' specified in compilerOptions
13:03:11.765 error TS2688: Cannot find type definition file for 'node'.
... (repeated for 14 API serverless function files)
```

### Context & Implementation:
- Moved `@types/node` and `@types/express` from `devDependencies` to `dependencies` in `package.json` so they are never omitted during Vercel's production dependency pruning.
- Removed `types` array from root `tsconfig.json` so compiler options do not require specific type library entry points.
- Added dedicated `api/tsconfig.json` with `typeRoots: ["../node_modules/@types"]` to allow `@vercel/node` to accurately resolve Node.js types for each serverless function.

---

## Prompt 8: GitHub Remote Push

```text
git push https://<GITHUB_PERSONAL_ACCESS_TOKEN>@github.com/wanghan211/Primary-school-property.git
```

### Context & Implementation:
- Staged updated `bun.lock` and pushed commit `36e70f5` to the GitHub remote repository.

---

## Prompt 9: Vercel Deployment Output Review & Chunk Size Warning

```text
During the deployment, this is the error in vercel, please help me check the issue.

computing gzip size...
dist/index.html                   1.56 kB │ gzip:   0.70 kB
dist/assets/index-BYvDBKfN.css   53.99 kB │ gzip:   9.72 kB
dist/assets/index-CH58-nDc.js   529.75 kB │ gzip: 147.62 kB
[plugin builtin:vite-reporter] 
(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking: https://rolldown.rs/reference/OutputOptions.codeSplitting
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 771ms
Using TypeScript 7.0.2 (local user-provided)
Using the TypeScript 7.0.2 compiler executable for transpilation.
Using TypeScript 7.0.2 (local user-provided)
...
```

### Context & Implementation:
- Clarified that the `Using TypeScript 7.0.2 compiler executable for transpilation` output indicates successful transpilation of all 14 serverless functions without any `TS2688` errors.
- Optimized `vite.config.ts` with `manualChunks` code splitting (`vendor-react`, `vendor-leaflet`, `vendor-ui`), reducing main application bundle to ~215 kB and eliminating the `>500 kB` chunk warning.

---

## Prompt 10: GitHub Remote Push

```text
git push https://<GITHUB_PERSONAL_ACCESS_TOKEN>@github.com/wanghan211/Primary-school-property.git
```

### Context & Implementation:
- Pushed commit `84c434c` (`perf(vite): add manualChunks code-splitting for vendor-react, vendor-leaflet, and vendor-ui, resolving >500kB chunk warning`) to GitHub remote repository.

---

## Prompt 11: Prompt Compilation (Current Prompt)

```text
compie all my prompts into prompt.md and place into the project root
```

### Context & Implementation:
- Created `prompt.md` in the project root documenting all 11 user prompts, contextual decisions, technical architectures, and associated deliverables.
