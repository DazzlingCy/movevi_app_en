# MOVEVI English Sync QA

- Source baseline: `DazzlingCy/movevi-app-2.0` at `5e915e7c124dc713cfbdd3321805e7585a77d707`
- Local preview: `http://localhost:3001/`
- Authentication: retained the English Apple, Google, and email verification flows, including email linking for social sign-in.
- Product structure: synchronized the latest Chinese journey, city, event, route, reward, and profile modules.
- Localization: converted visible product copy to natural US English and changed cash reward language to US dollars and wallet/PayPal terminology.

## Verification

- TypeScript: passed (`npm run lint`)
- Automated tests: 77 passed (`npm test`)
- Production bundle: passed (`npm run build`)
- Local server: HTTP 200 on port 3001
- GitHub Pages asset paths: covered by automated tests

## Visual Review

Browser automation could not safely attach to the active Windows Chrome tab because its current URL could not be verified. The local server and production bundle were verified without browser automation; an interactive screenshot pass remains the only unavailable check.
