# Routine

A bilingual Arabic and English weekly routine tracker built with Angular standalone components.

## Run locally

```powershell
npm install
npm start
```

Open the local address printed by Angular CLI. The app stores checked habits by week in browser `localStorage`.

## Backups

Use **Export backup** to download saved weeks as JSON, then **Import data** to restore them in another browser origin or device. To transfer progress from the previous page, open `legacy-routine.html` from the same browser address you used before, export its backup, then import it in the Angular app. A served copy is also available at `/legacy-routine.html`.
