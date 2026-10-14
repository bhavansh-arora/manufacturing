# Torvane Manufacturing — marketing site

A static, dependency-free multipage site for **Torvane**, a fictional precision contract manufacturer.

## Pages

| Page | File | What's on it |
| --- | --- | --- |
| Home | `index.html` | Hero, pain points, capability cards, lead-time estimator, featured work, process, order-tracking preview, comparison, testimonials, guides |
| Capabilities | `capabilities.html` | Six processes with specs, materials, pricing factors, equipment list |
| Work | `work.html` | Stats, filterable portfolio with lightbox, three detailed case studies |
| Industries | `industries.html` | Six industries, per-industry requirements, customer quote |
| Quality | `quality.html` | KPIs, five-step quality process, inspection lab, certifications, documentation, guarantee |
| Design guides | `guides.html` | DFM rules for CNC, sheet metal, molding, additive; tolerances, finishes, glossary |
| About | `about.html` | Timeline, facility, values, leadership, sustainability, open roles and benefits |
| Get a quote | `quote.html` | Quote form, contact options, next steps, RFQ checklist, FAQ |
| Photo credits | `credits.html` | Source and license for every photo |

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Files

- `styles.css` — design tokens and all styles (responsive down to 360px, respects reduced motion)
- `script.js` — scroll reveals, counters, mobile menu, portfolio filters and lightbox, parallax, multi-step quote form, lead-time estimator
- `assets/` — logo mark, wordmark, favicon (SVG) and `img/` photography

The header and footer are repeated in each HTML file, so edit them on every page when you change navigation or contact details.

## Before going live

- Connect the quote form to your CRM or form backend (see the `TODO` in `script.js`).
- Replace the stock photography in `assets/img/` with photos of your own shop floor and parts, and update `credits.html`.
- Replace the placeholder phone, email, address, stats, case studies, team and testimonials.
