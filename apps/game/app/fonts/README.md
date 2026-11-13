# FRONTIER self-hosted fonts

These files are local, Latin-subset WOFF2 web fonts loaded by
`apps/game/app/layout.tsx` through `next/font/local`. The browser makes no font
request to Google.

## Included files

| File | Family and weight | SHA-256 |
|---|---|---|
| `barlow-condensed-600-latin.woff2` | Barlow Condensed 600 normal | `215A93C696F442034A46FBB382958F753FDA60E30490683AEEA6B235FCBB2B66` |
| `barlow-condensed-700-latin.woff2` | Barlow Condensed 700 normal | `3787A5A419171630E6890CFA47C4DA067474D005CD0FF8DC11EC090FDC3EE2B8` |
| `dm-sans-variable-latin.woff2` | DM Sans variable 100-1000 normal | `CA72D2BCEA8F4DAA783DBDFA2D9B46068C3CE38168E05918FB867AA453B4F890` |

## Sources

Retrieved 2026-11-13 from the WOFF2 URLs returned by the official Google Fonts
CSS API:

- `https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&display=swap`
- `https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,100..1000&display=swap`
- Family source: `https://github.com/google/fonts/tree/main/ofl/barlowcondensed`
- Family source: `https://github.com/google/fonts/tree/main/ofl/dmsans`

The binaries are the Latin subsets. Barlow Condensed is intentionally limited
to the two display weights used by FRONTIER. DM Sans provides the body and UI
weight range. DM Sans is preloaded as the critical interface face; the display
family uses `preload: false` to avoid preloading two more files.

## Licences

Both families are distributed under the SIL Open Font License 1.1. The exact
licence texts supplied by Google Fonts are included as:

- `OFL-Barlow-Condensed.txt`
- `OFL-DM-Sans.txt`

Clash Display is not included because this project does not have a confirmed
public redistribution grant for its font files.
