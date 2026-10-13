#!/usr/bin/env node
/**
 * Google-Bewertungen für die Startseite.
 *
 *   node scripts/google-reviews.cjs --fetch   holt Bewertungen von der Google Places API (New)
 *                                             und schreibt sie nach data/google-reviews.json
 *   node scripts/google-reviews.cjs           rendert den Block in index.html zwischen den
 *                                             Markern <!-- google-reviews:start/end -->
 *
 * Für --fetch nötig: Umgebungsvariable GOOGLE_MAPS_API_KEY (der Key bleibt lokal,
 * er landet nie im ausgelieferten HTML). Die Place-ID steht in data/google-reviews.json.
 *
 * Hinweis Google-Nutzungsbedingungen: Bewertungsinhalte dürfen max. 30 Tage
 * zwischengespeichert werden – also vor jedem Deploy neu holen.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const dataFile = path.join(root, 'data', 'google-reviews.json');
const indexFile = path.join(root, 'index.html');
const START = '<!-- google-reviews:start -->';
const END = '<!-- google-reviews:end -->';
const MAX_CARDS = 3;

const readData = () => JSON.parse(fs.readFileSync(dataFile, 'utf8'));
const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const de = (n) => n.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

async function fetchReviews() {
  const data = readData();
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!data.placeId) throw new Error('placeId fehlt in data/google-reviews.json');
  if (!key) throw new Error('GOOGLE_MAPS_API_KEY ist nicht gesetzt');

  const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(data.placeId)}?languageCode=de`;
  const res = await fetch(url, {
    headers: {
      'X-Goog-Api-Key': key,
      'X-Goog-FieldMask': 'rating,userRatingCount,googleMapsUri,reviews',
    },
  });
  if (!res.ok) throw new Error(`Places API ${res.status}: ${await res.text()}`);
  const place = await res.json();

  data.rating = typeof place.rating === 'number' ? place.rating : null;
  data.userRatingCount = place.userRatingCount || 0;
  data.profileUrl = data.profileUrl || place.googleMapsUri || '';
  data.fetchedAt = new Date().toISOString();
  data.reviews = (place.reviews || []).map((r) => ({
    author: (r.authorAttribution && r.authorAttribution.displayName) || 'Google-Nutzer',
    rating: r.rating || null,
    text: ((r.originalText && r.originalText.text) || (r.text && r.text.text) || '').trim(),
    time: (r.relativePublishTimeDescription || '').trim(),
    publishTime: r.publishTime || null,
  })).filter((r) => r.text);

  fs.writeFileSync(dataFile, `${JSON.stringify(data, null, 2)}\n`);
  console.log(`google-reviews: ${data.reviews.length} Bewertungen geholt (Ø ${data.rating ?? '–'}).`);
}

function card(review) {
  const stars = '★'.repeat(Math.round(review.rating || 5));
  const initial = esc((review.author || '?').trim().charAt(0).toUpperCase());
  const meta = [review.time, 'Google'].filter(Boolean).join(' · ');
  return `          <article class="card testimonial google-review">
            <div class="stars" aria-label="${review.rating || 5} von 5 Sternen">${stars}</div>
            <p>„${esc(review.text)}“</p>
            <div class="who">
              <span class="avatar" aria-hidden="true">${initial}</span>
              <div>
                <strong>${esc(review.author)}</strong>
                <span class="muted">${esc(meta)}</span>
              </div>
            </div>
          </article>`;
}

function render() {
  const data = readData();
  const html = fs.readFileSync(indexFile, 'utf8');
  const from = html.indexOf(START);
  const to = html.indexOf(END);
  if (from === -1 || to === -1) throw new Error('Marker google-reviews:start/end fehlen in index.html');

  let block = '';
  const hasLinks = Boolean(data.profileUrl || data.reviewUrl);
  if (hasLinks) {
    const count = data.userRatingCount || data.reviews.length;
    const ratingValue = typeof data.rating === 'number' ? data.rating : null;
    const hasScore = ratingValue !== null && count > 0;
    const stars = '★'.repeat(Math.round(ratingValue || 0));
    const countDe = `${count} ${count === 1 ? 'Bewertung' : 'Bewertungen'} auf Google`;
    const countEn = `${count} ${count === 1 ? 'review' : 'reviews'} on Google`;
    const profile = esc(data.profileUrl || '');
    const review = esc(data.reviewUrl || data.profileUrl || '');
    const actions = [
      profile && hasScore && `<a class="btn btn-ghost" href="${profile}" target="_blank" rel="noopener noreferrer" data-portfolio-de="Alle Bewertungen ansehen" data-portfolio-en="See all reviews">Alle Bewertungen ansehen</a>`,
      review && `<a class="btn btn-primary" href="${review}" target="_blank" rel="noopener noreferrer" data-portfolio-de="Bei Google bewerten" data-portfolio-en="Review on Google">Bei Google bewerten</a>`,
    ].filter(Boolean).join('\n            ');

    block = `
        <div class="google-reviews reveal">
          <div class="google-reviews-head">
            <span class="google-reviews-badge" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="22" height="22" focusable="false"><path fill="#4285F4" d="M23.5 12.27c0-.86-.08-1.5-.24-2.17H12v3.94h6.6c-.13 1.1-.85 2.76-2.45 3.87l-.02.15 3.56 2.75.25.03c2.26-2.09 3.56-5.17 3.56-8.57Z"/><path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.9l-3.79-2.93c-1 .7-2.36 1.19-4.15 1.19a7.2 7.2 0 0 1-6.81-4.97l-.14.01-3.7 2.86-.05.13A11.99 11.99 0 0 0 12 24Z"/><path fill="#FBBC05" d="M5.19 14.39a7.4 7.4 0 0 1-.4-2.39c0-.83.15-1.64.39-2.39l-.01-.16-3.75-2.9-.12.06A12 12 0 0 0 0 12c0 1.94.47 3.77 1.3 5.39l3.89-3Z"/><path fill="#EA4335" d="M12 4.64c2.26 0 3.79.98 4.66 1.8l3.4-3.32C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.3 6.61l3.88 3.01A7.23 7.23 0 0 1 12 4.64Z"/></svg>
            </span>
            <div class="google-reviews-score">
              ${hasScore
                ? `<p class="google-reviews-value"><strong>${esc(de(ratingValue))}</strong><span class="stars" aria-label="${esc(de(ratingValue))} von 5 Sternen">${stars}</span></p>
              <p class="muted" data-portfolio-de="${esc(countDe)}" data-portfolio-en="${esc(countEn)}">${esc(countDe)}</p>`
                : `<p class="google-reviews-value"><strong data-portfolio-de="Bewertungen auf Google" data-portfolio-en="Reviews on Google">Bewertungen auf Google</strong></p>
              <p class="muted" data-portfolio-de="Du hast mit mir gearbeitet? Eine kurze Rezension hilft anderen bei der Entscheidung." data-portfolio-en="Worked with me? A short review helps others decide.">Du hast mit mir gearbeitet? Eine kurze Rezension hilft anderen bei der Entscheidung.</p>`}
            </div>
          </div>
          <div class="google-reviews-actions">
            ${actions}
          </div>
        </div>
${data.reviews.length ? `
        <div class="cards-grid google-reviews-grid reveal">
${data.reviews.slice(0, MAX_CARDS).map(card).join('\n')}
        </div>
` : '\n'}`;
  }

  const next = `${html.slice(0, from + START.length)}${block}${html.slice(to)}`;
  if (next !== html) fs.writeFileSync(indexFile, next);
  console.log(block
    ? `google-reviews: Block gerendert (${Math.min(data.reviews.length, MAX_CARDS)} Karten).`
    : 'google-reviews: profileUrl/reviewUrl fehlen in data/google-reviews.json – Block bleibt leer.');
}

const main = process.argv.includes('--fetch') ? fetchReviews : async () => render();
main().catch((err) => {
  console.error(`google-reviews: ${err.message}`);
  process.exit(1);
});
