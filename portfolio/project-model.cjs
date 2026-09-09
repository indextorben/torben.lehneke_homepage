// Website references can link to a customer URL or a separately authored case study.
// They never require an apps/{id} folder or product-specific story fields.
function normalizeProject(project) {
  if (!['website','app','tool'].includes(project.type)) throw new Error(`${project.id}: invalid project type`);
  const href=project.detailPath || project.url;
  if(!href || !/^(?:https:\/\/|[a-z0-9][a-z0-9/_-]*\.html(?:#[\w-]+)?)$/i.test(href)) {
    // External HTTPS URLs may include query strings and host punctuation.
    if(!href || !/^https:\/\/[^\s"<>]+$/.test(href))throw new Error(`${project.id}: valid detailPath or HTTPS url required`);
  }
  const website=project.type==='website';
  const name=project.name || project.title?.de || project.title;
  const category=website?{de:project.client?`Kundenwebsite · ${project.client}`:'Website-Projekt',en:project.client?`Client website · ${project.client}`:'Website project'}:{de:'Eigenes Projekt · '+(project.type==='app'?'App':'Tool'),en:'Own project · '+(project.type==='app'?'App':'Tool')};
  return {...project,name,href,
    category,tags:project.tags || project.technologies || [],
    title:typeof project.title==='string'?{de:project.title,en:project.title}:project.title,
    status:project.status || {de:'Website ansehen',en:'View website'},
    visualAlt:project.visualAlt || {de:`Website-Ansicht: ${name}`,en:`Website preview: ${name}`},
    visualCredit:project.visualCredit || (website?{de:'Website-Vorschau',en:'Website preview'}:{de:'Produktvisual · KI',en:'Product visual · AI'})};
}
module.exports={normalizeProject};
