// Illustrative, code-native website mockups. No fictional client work or stock assets.
const {local} = require('./components.cjs');
const accents = ['#69b7ff','#b19aff','#67e8f9','#6ee7b7','#f3bb78','#90b9ff'];
const chrome = label => `<div class="studio-chrome"><i></i><i></i><i></i><span>${label}</span><b>↗</b></div>`;
function website(variant = 0) {
  const names = ['STUDIO / RAUM','EIN GUTER ANFANG','STUDIO / RAUM','DEIN AUFTRITT','NEU GEDACHT','IMMER AKTUELL'];
  const titles = [['Raum für\ndeine Ideen.','Space for\nyour ideas.'],['Ein Angebot.\nEin klarer Fokus.','One offer.\nOne clear focus.'],['Raum für\ndeine Ideen.','Space for\nyour ideas.'],['So individuell\nwie dein Projekt.','As individual\nas your project.'],['Bereit für\nden nächsten Schritt.','Ready for\nyour next chapter.'],['Eine Website,\ndie mitwächst.','A website\nthat grows with you.']];
  return `<div class="web-design web-design-${variant}"><div class="web-design-nav"><b>${names[variant]}</b><span>INFO &nbsp; / &nbsp; KONTAKT</span><i>☰</i></div><div class="web-design-main"><div class="web-design-copy"><small>DESIGNKONZEPT / WEB</small>${local(...titles[variant],'strong')}<div class="web-design-lines"><i></i><i></i></div>${local('Mehr entdecken ↗','Explore more ↗','span','web-design-button')}</div><div class="web-design-art" aria-hidden="true"><div class="design-arch arch-back"></div><div class="design-arch arch-front"></div><div class="design-pedestal"></div><span>FORM / LICHT / RAUM</span></div></div><div class="web-design-bottom"><span>01 / IDEE</span><span>02 / GESTALTUNG</span><span>03 / KONTAKT</span></div></div>`;
}
function device(kind, variant = 0) {
  return `<div class="website-device device-${kind}">${kind==='desktop'?chrome('deine-website.de'): '<div class="device-speaker"></div>'}${website(variant)}${kind==='desktop'?'<div class="device-foot"></div>':''}</div>`;
}
function heroScene() {
  return `<div class="studio-scene website-scene" aria-label="Illustratives Webdesign auf Desktop, Tablet und Smartphone"><div class="studio-scene-glow"></div><div class="studio-plane"></div><div class="studio-camera">${device('desktop')}${device('tablet')}${device('phone')}<span class="responsive-label">DESKTOP / TABLET / MOBILE</span></div><div class="studio-scene-caption">${local('Ein Auftritt. Auf jedem Bildschirm.','One presence. On every screen.')}${local('Designkonzept · keine Kundenreferenz','Design concept · not client work')}</div></div>`;
}
function serviceStage() {
  return `<div class="service-stage" aria-hidden="true"><div class="service-stage-halo"></div><div class="service-deck">${accents.map((accent,i)=>`<div class="service-panel studio-window" data-service-panel="${i}" style="--scene-accent:${accent}">${chrome(['Unternehmenswebsite','Landingpage','Responsive Design','Individuelle Entwicklung','Website-Relaunch','Wartung & Weiterentwicklung'][i])}${website(i)}</div>`).join('')}</div><div class="service-stage-baseline"><span class="service-current">01</span><div class="service-progress"><i></i></div><span>06 / WEB DEVELOPMENT</span></div></div>`;
}
function serviceInline(index) { return `<div class="service-inline studio-window" aria-hidden="true">${chrome('WEBDESIGN / KONZEPT')}${website(index)}</div>`; }
function aboutVisual() {
  return `<div class="about-system"><div class="about-system-head"><span>TORBEN LEHNEKE</span><span>NEUBRANDENBURG / DE</span></div><p class="about-signature">${local('Dein Projekt.\nMein persönlicher Einsatz.','Your project.\nMy personal commitment.')}</p><div class="about-layers">${[
    ['Direkter Draht','Direct contact','Du sprichst mit dem Menschen, der deine Website entwickelt.','You talk to the person who builds your website.'],
    ['Klare Absprachen','Clear agreements','Verständliche Angebote, nachvollziehbare Schritte und regelmäßige Einblicke.','Clear proposals, transparent steps and regular updates.'],
    ['Bis ins Detail','Down to the details','Design, Bedienbarkeit und technische Qualität gehören für mich zusammen.','Design, usability and technical quality belong together.']
  ].map(([de,en,text,translation],i)=>`<div class="about-principle"><span>0${i+1}</span>${local(de,en,'h3')}${local(text,translation,'p')}</div>`).join('')}</div></div>`;
}
module.exports = {local, heroScene, serviceStage, serviceInline, aboutVisual, accents, device};
