# OC Recycling System

Static localhost app for managing an original character archive with localStorage persistence.

## Files

- `index.html` - main entry point
- `styles.css` - app styling
- `app.js` - state, routing, event wiring
- `data.js` - seed data, storage, import/export helpers
- `components.js` - view rendering helpers
- `filters.js` - search and filter logic
- `relationships.js` - relationship lookups and SVG visualizer
- `crud.js` - form serialization and validation

## Run Locally

Option 1:

```bash
npx live-server oc-recycling-system
```

Option 2:

```bash
cd oc-recycling-system
python -m http.server
```

Then open the local URL shown in your terminal.

## Notes

- Data seeds automatically on first visit.
- All changes are saved to `localStorage`.
- Use the Manage view to import or export JSON backups.
