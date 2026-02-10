# Mobile Build (Capacitor)

This setup creates a fully offline mobile app (iOS/Android). It stores inventory in IndexedDB and works without a domain.

## 1) Install deps

```bash
npm install
```

## 2) Initialize native projects

```bash
npx cap add android
npx cap add ios
```

## 3) Copy web assets into native projects

```bash
npm run cap:copy
```

## 4) Open native IDEs

```bash
npm run cap:android
npm run cap:ios
```

## Notes

- Offline storage is handled in `index.html` using IndexedDB.
- The barcode scanner uses `lib/quagga.min.js` so it works offline.
- If you later add a backend for sync, update the API calls in `index.html`.
