# Torvane Manufacturing — marketing site

A static, dependency-free multipage site for **Torvane**, a fictional precision contract manufacturer.

## Pages

| Page | File | What's on it |
| --- | --- | --- |
| Home | `index.html` | Hero, stats, certifications, capability cards, featured work, process, comparison table, testimonials |
| Capabilities | `capabilities.html` | CNC, sheet metal & welding, molding, additive, finishing, assembly, materials |
| Work | `work.html` | Filterable project portfolio with lightbox, case studies |
| Industries | `industries.html` | Aerospace, medical, EV, robotics, semiconductor, industrial |
| Quality | `quality.html` | KPIs, inspection lab, certifications |
| About | `about.html` | Timeline, facility, values, leadership, careers |
| Get a quote | `quote.html` | Multi-step quote form, contact options, FAQ |
| Photo credits | `credits.html` | Source and license for every photo |

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Files

- `styles.css` — design tokens and all styles (responsive down to 360px, respects reduced motion)
- `script.js` — scroll reveals, counters, mobile menu, portfolio filters and lightbox, parallax, multi-step quote form
- `assets/` — logo mark, wordmark, favicon (SVG) and `img/` photography

The header and footer are repeated in each HTML file, so edit them on every page when you change navigation or contact details.

## Before going live

- Connect the quote form to your CRM or form backend (see the `TODO` in `script.js`).
- Replace the stock photography in `assets/img/` with photos of your own shop floor and parts, and update `credits.html`.
- Replace the placeholder phone, email, address, stats, case studies, team and testimonials.
