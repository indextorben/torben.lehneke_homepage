// Shared escaped bilingual markup. Visual components live in web-components.cjs.
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const local = (de, en, tag = 'span', cls = '') => `<${tag} class="${cls}" data-portfolio-de="${esc(de)}" data-portfolio-en="${esc(en)}">${esc(de)}</${tag}>`;
module.exports={local};
