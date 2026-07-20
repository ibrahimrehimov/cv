import { templates, accentSwatch, accentMap, formatDate, refreshIcons } from "./app.js";

function icon(name, cls = "w-4 h-4") {
  return `<i data-lucide="${name}" class="${cls}"></i>`;
}

function photo(data, c) {
  if (data.personal.photoUrl) {
    return `<img src="${data.personal.photoUrl}" alt="${data.personal.fullName}" class="w-24 h-24 rounded-full object-cover ring-4 ring-white shadow-md" />`;
  }
  return `<div class="w-24 h-24 rounded-full ${c.solid} flex items-center justify-center text-white shadow-md">${icon("user", "w-10 h-10")}</div>`;
}

function sectionTitle(c, iconName, title) {
  return `<div class="flex items-center gap-2 mb-3">
    <div class="w-7 h-7 rounded-lg ${c.solid} flex items-center justify-center text-white">${icon(iconName, "w-4 h-4")}</div>
    <h3 class="text-sm font-bold tracking-wide uppercase text-slate-800">${title}</h3>
  </div>`;
}

function contactRow(personal) {
  const items = [];
  if (personal.email) items.push(`<span class="flex items-center gap-1">${icon("mail", "w-4 h-4")}${personal.email}</span>`);
  if (personal.phone) items.push(`<span class="flex items-center gap-1">${icon("phone", "w-4 h-4")}${personal.phone}</span>`);
  if (personal.location) items.push(`<span class="flex items-center gap-1">${icon("map-pin", "w-4 h-4")}${personal.location}</span>`);
  if (personal.website) items.push(`<span class="flex items-center gap-1">${icon("globe", "w-4 h-4")}${personal.website}</span>`);
  return items;
}

function expList(experiences, c) {
  return experiences
    .map(
      (e) => `<div class="border-l-2 border-slate-200 pl-4">
        <div class="flex justify-between items-start">
          <h4 class="font-semibold text-slate-800">${e.role}</h4>
          <span class="text-xs text-slate-500 flex items-center gap-1">${icon("calendar", "w-3 h-3")}${formatDate(e.startDate)} — ${formatDate(e.endDate, e.current)}</span>
        </div>
        <p class="text-sm ${c.text} font-medium">${e.company}${e.location ? ` · ${e.location}` : ""}</p>
        <p class="text-sm text-slate-600 mt-1 leading-relaxed">${e.description}</p>
      </div>`
    )
    .join("");
}

function eduList(education, c) {
  return education
    .map(
      (ed) => `<div class="border-l-2 border-slate-200 pl-4">
        <div class="flex justify-between items-start">
          <h4 class="font-semibold text-slate-800">${ed.degree}</h4>
          <span class="text-xs text-slate-500 flex items-center gap-1">${icon("calendar", "w-3 h-3")}${formatDate(ed.startDate)} — ${formatDate(ed.endDate)}</span>
        </div>
        <p class="text-sm ${c.text} font-medium">${ed.school}${ed.location ? ` · ${ed.location}` : ""}</p>
        ${ed.description ? `<p class="text-sm text-slate-600 mt-1">${ed.description}</p>` : ""}
      </div>`
    )
    .join("");
}

function skillsBars(skills, c) {
  return skills
    .map(
      (s) => `<div>
        <div class="flex justify-between text-xs mb-1"><span class="text-slate-700">${s.name}</span><span class="text-slate-400">${s.level}%</span></div>
        <div class="h-1.5 bg-slate-100 rounded-full overflow-hidden"><div class="h-full ${c.solid}" style="width:${s.level}%"></div></div>
      </div>`
    )
    .join("");
}

function langsList(languages) {
  return languages.map((l) => `<li class="text-sm text-slate-700 flex justify-between"><span>${l.name}</span><span class="text-slate-400">${l.proficiency}</span></li>`).join("");
}

export function renderPreview(data, template, accent) {
  const c = accentMap[accent];
  const { personal, experiences, education, skills, languages } = data;
  const contact = contactRow(personal);

  if (template === "classic") {
    return `<div class="bg-white shadow-xl rounded-lg overflow-hidden">
      <div class="bg-gradient-to-r ${c.from} ${c.to} text-white px-8 py-10 text-center">
        <div class="flex justify-center mb-4">${photo(data, c)}</div>
        <h1 class="text-3xl font-bold">${personal.fullName || "Ad Soyad"}</h1>
        <p class="text-lg opacity-90 mt-1">${personal.title}</p>
        <div class="flex flex-wrap justify-center gap-4 mt-4 text-sm">${contact.join("")}</div>
      </div>
      <div class="px-8 py-6 space-y-6">
        ${personal.summary ? `<section>${sectionTitle(c, "user", "Profil")}<p class="text-sm text-slate-600 leading-relaxed">${personal.summary}</p></section>` : ""}
        ${experiences.length ? `<section>${sectionTitle(c, "briefcase", "İş Təcrübəsi")}<div class="space-y-4">${expList(experiences, c)}</div></section>` : ""}
        ${education.length ? `<section>${sectionTitle(c, "graduation-cap", "Təhsil")}<div class="space-y-3">${eduList(education, c)}</div></section>` : ""}
        <div class="grid grid-cols-2 gap-6">
          ${skills.length ? `<section>${sectionTitle(c, "wrench", "Bacarıqlar")}<div class="space-y-2">${skillsBars(skills, c)}</div></section>` : ""}
          ${languages.length ? `<section>${sectionTitle(c, "languages", "Dillər")}<ul class="space-y-1">${langsList(languages)}</ul></section>` : ""}
        </div>
      </div>
    </div>`;
  }

  if (template === "minimal") {
    return `<div class="bg-white shadow-xl rounded-lg p-10">
      <div class="flex items-center gap-6 pb-6 border-b border-slate-100">
        ${photo(data, c)}
        <div>
          <h1 class="text-3xl font-bold text-slate-900">${personal.fullName || "Ad Soyad"}</h1>
          <p class="text-lg text-slate-500">${personal.title}</p>
        </div>
      </div>
      <div class="flex flex-wrap gap-4 mt-4 text-sm text-slate-500">${contact.join("")}</div>
      <div class="mt-8 space-y-8">
        ${personal.summary ? `<section><h3 class="text-xs font-bold uppercase tracking-widest ${c.text} mb-2">Profil</h3><p class="text-sm text-slate-700 leading-relaxed">${personal.summary}</p></section>` : ""}
        ${experiences.length ? `<section><h3 class="text-xs font-bold uppercase tracking-widest ${c.text} mb-3">İş Təcrübəsi</h3><div class="space-y-4">${experiences.map((e) => `<div><div class="flex justify-between items-baseline"><h4 class="font-semibold text-slate-800">${e.role} <span class="text-slate-400 font-normal">· ${e.company}</span></h4><span class="text-xs text-slate-400">${formatDate(e.startDate)} — ${formatDate(e.endDate, e.current)}</span></div><p class="text-sm text-slate-600 mt-1 leading-relaxed">${e.description}</p></div>`).join("")}</div></section>` : ""}
        ${education.length ? `<section><h3 class="text-xs font-bold uppercase tracking-widest ${c.text} mb-3">Təhsil</h3><div class="space-y-3">${education.map((ed) => `<div><div class="flex justify-between items-baseline"><h4 class="font-semibold text-slate-800">${ed.degree} <span class="text-slate-400 font-normal">· ${ed.school}</span></h4><span class="text-xs text-slate-400">${formatDate(ed.startDate)} — ${formatDate(ed.endDate)}</span></div>${ed.description ? `<p class="text-sm text-slate-600 mt-1">${ed.description}</p>` : ""}</div>`).join("")}</div></section>` : ""}
        <div class="grid grid-cols-2 gap-8">
          ${skills.length ? `<section><h3 class="text-xs font-bold uppercase tracking-widest ${c.text} mb-3">Bacarıqlar</h3><div class="flex flex-wrap gap-2">${skills.map((s) => `<span class="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-700">${s.name}</span>`).join("")}</div></section>` : ""}
          ${languages.length ? `<section><h3 class="text-xs font-bold uppercase tracking-widest ${c.text} mb-3">Dillər</h3><ul class="space-y-1 text-sm text-slate-700">${langsList(languages)}</ul></section>` : ""}
        </div>
      </div>
    </div>`;
  }

  if (template === "elegant") {
    return `<div class="bg-white shadow-xl rounded-lg overflow-hidden">
      <div class="px-10 pt-10 pb-6 text-center border-b border-slate-200">
        <div class="flex justify-center mb-4">${photo(data, c)}</div>
        <h1 class="text-4xl font-bold text-slate-900 tracking-tight" style="font-family:Georgia,serif">${personal.fullName || "Ad Soyad"}</h1>
        <div class="flex items-center justify-center gap-3 my-3">
          <span class="h-px w-12 bg-slate-300"></span>
          <p class="text-sm uppercase tracking-[0.3em] text-slate-500" style="font-family:Georgia,serif">${personal.title}</p>
          <span class="h-px w-12 bg-slate-300"></span>
        </div>
        <div class="flex flex-wrap justify-center gap-4 text-xs text-slate-500">${contact.join("")}</div>
      </div>
      <div class="px-10 py-8 grid grid-cols-3 gap-8" style="font-family:Georgia,serif">
        <div class="col-span-2 space-y-7">
          ${personal.summary ? `<section><h3 class="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">Profil</h3><p class="text-sm text-slate-700 leading-relaxed">${personal.summary}</p></section>` : ""}
          ${experiences.length ? `<section><h3 class="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">İş Təcrübəsi</h3><div class="space-y-4">${experiences.map((e) => `<div><div class="flex justify-between items-baseline"><h4 class="font-bold text-slate-800">${e.role}</h4><span class="text-xs text-slate-400 italic">${formatDate(e.startDate)} — ${formatDate(e.endDate, e.current)}</span></div><p class="text-sm ${c.text} italic mb-1">${e.company}${e.location ? ` · ${e.location}` : ""}</p><p class="text-sm text-slate-600 leading-relaxed">${e.description}</p></div>`).join("")}</div></section>` : ""}
          ${education.length ? `<section><h3 class="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">Təhsil</h3><div class="space-y-3">${education.map((ed) => `<div><div class="flex justify-between items-baseline"><h4 class="font-bold text-slate-800">${ed.degree}</h4><span class="text-xs text-slate-400 italic">${formatDate(ed.startDate)} — ${formatDate(ed.endDate)}</span></div><p class="text-sm ${c.text} italic">${ed.school}${ed.location ? ` · ${ed.location}` : ""}</p>${ed.description ? `<p class="text-sm text-slate-600 mt-0.5">${ed.description}</p>` : ""}</div>`).join("")}</div></section>` : ""}
        </div>
        <div class="space-y-7">
          ${skills.length ? `<section><h3 class="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">Bacarıqlar</h3><div class="space-y-2.5">${skills.map((s) => `<div><div class="flex justify-between text-xs mb-1"><span class="text-slate-700">${s.name}</span></div><div class="h-1 bg-slate-100 rounded-full overflow-hidden"><div class="h-full ${c.solid}" style="width:${s.level}%"></div></div></div>`).join("")}</div></section>` : ""}
          ${languages.length ? `<section><h3 class="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">Dillər</h3><ul class="space-y-1.5">${languages.map((l) => `<li class="text-sm text-slate-700 flex justify-between"><span>${l.name}</span><span class="text-slate-400 italic text-xs">${l.proficiency}</span></li>`).join("")}</ul></section>` : ""}
        </div>
      </div>
    </div>`;
  }

  if (template === "creative") {
    return `<div class="bg-white shadow-xl rounded-lg overflow-hidden">
      <div class="bg-gradient-to-br ${c.from} ${c.to} px-8 py-8 text-white relative overflow-hidden">
        <div class="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10"></div>
        <div class="absolute -right-16 bottom-0 w-32 h-32 rounded-full bg-white/10"></div>
        <div class="relative flex items-center gap-5">
          ${photo(data, c)}
          <div>
            <h1 class="text-3xl font-extrabold tracking-tight">${personal.fullName || "Ad Soyad"}</h1>
            <p class="text-lg opacity-90 mt-0.5">${personal.title}</p>
            <div class="flex flex-wrap gap-3 mt-3 text-xs">${contact.map((c2) => `<span class="flex items-center gap-1 bg-white/15 px-2 py-1 rounded-full">${c2}</span>`).join("")}</div>
          </div>
        </div>
      </div>
      <div class="px-8 py-6 space-y-6">
        ${personal.summary ? `<section>${sectionTitle(c, "user", "Profil")}<p class="text-sm text-slate-600 leading-relaxed">${personal.summary}</p></section>` : ""}
        <div class="grid grid-cols-3 gap-6">
          <div class="col-span-2 space-y-6">
            ${experiences.length ? `<section>${sectionTitle(c, "briefcase", "İş Təcrübəsi")}<div class="space-y-3">${experiences.map((e) => `<div class="rounded-lg ${c.soft} p-3"><div class="flex justify-between items-start gap-2"><h4 class="font-semibold text-slate-800">${e.role}</h4><span class="text-xs text-slate-500 flex items-center gap-1 whitespace-nowrap">${icon("calendar", "w-3 h-3")}${formatDate(e.startDate)} — ${formatDate(e.endDate, e.current)}</span></div><p class="text-sm ${c.text} font-medium">${e.company}${e.location ? ` · ${e.location}` : ""}</p><p class="text-sm text-slate-600 mt-1 leading-relaxed">${e.description}</p></div>`).join("")}</div></section>` : ""}
            ${education.length ? `<section>${sectionTitle(c, "graduation-cap", "Təhsil")}<div class="space-y-2">${education.map((ed) => `<div><div class="flex justify-between items-start gap-2"><h4 class="font-semibold text-slate-800">${ed.degree}</h4><span class="text-xs text-slate-500 flex items-center gap-1 whitespace-nowrap">${icon("calendar", "w-3 h-3")}${formatDate(ed.startDate)} — ${formatDate(ed.endDate)}</span></div><p class="text-sm ${c.text} font-medium">${ed.school}${ed.location ? ` · ${ed.location}` : ""}</p>${ed.description ? `<p class="text-sm text-slate-600 mt-0.5">${ed.description}</p>` : ""}</div>`).join("")}</div></section>` : ""}
          </div>
          <div class="space-y-6">
            ${skills.length ? `<section>${sectionTitle(c, "wrench", "Bacarıqlar")}<div class="space-y-2.5">${skills.map((s) => `<div><div class="flex justify-between text-xs mb-1"><span class="text-slate-700">${s.name}</span><span class="text-slate-400">${s.level}%</span></div><div class="h-1.5 bg-slate-100 rounded-full overflow-hidden"><div class="h-full ${c.solid}" style="width:${s.level}%"></div></div></div>`).join("")}</div></section>` : ""}
            ${languages.length ? `<section>${sectionTitle(c, "languages", "Dillər")}<ul class="space-y-1.5">${languages.map((l) => `<li class="text-sm text-slate-700 flex justify-between"><span>${l.name}</span><span class="text-slate-400 text-xs">${l.proficiency}</span></li>`).join("")}</ul></section>` : ""}
          </div>
        </div>
      </div>
    </div>`;
  }

  // modern
  return `<div class="bg-white shadow-xl rounded-lg overflow-hidden grid grid-cols-3">
    <aside class="${c.solid} text-white p-6 space-y-6">
      <div class="flex justify-center pt-2">${photo(data, c)}</div>
      <div class="text-center">
        <h2 class="text-xl font-bold">${personal.fullName || "Ad Soyad"}</h2>
        <p class="text-sm opacity-90">${personal.title}</p>
      </div>
      <div class="space-y-2 text-sm">
        <h3 class="text-xs font-bold uppercase tracking-wider opacity-80 mb-2">Əlaqə</h3>
        ${personal.email ? `<p class="flex items-start gap-2 break-all">${icon("mail", "w-4 h-4 mt-0.5 shrink-0")}${personal.email}</p>` : ""}
        ${personal.phone ? `<p class="flex items-start gap-2">${icon("phone", "w-4 h-4 mt-0.5 shrink-0")}${personal.phone}</p>` : ""}
        ${personal.location ? `<p class="flex items-start gap-2">${icon("map-pin", "w-4 h-4 mt-0.5 shrink-0")}${personal.location}</p>` : ""}
        ${personal.website ? `<p class="flex items-start gap-2 break-all">${icon("globe", "w-4 h-4 mt-0.5 shrink-0")}${personal.website}</p>` : ""}
      </div>
      ${skills.length ? `<div class="space-y-3"><h3 class="text-xs font-bold uppercase tracking-wider opacity-80">Bacarıqlar</h3>${skills.map((s) => `<div><div class="flex justify-between text-xs mb-1"><span>${s.name}</span><span class="opacity-80">${s.level}%</span></div><div class="h-1.5 bg-white/20 rounded-full overflow-hidden"><div class="h-full bg-white" style="width:${s.level}%"></div></div></div>`).join("")}</div>` : ""}
      ${languages.length ? `<div class="space-y-2"><h3 class="text-xs font-bold uppercase tracking-wider opacity-80">Dillər</h3>${languages.map((l) => `<div class="flex items-center gap-2 text-sm">${icon("star", "w-3 h-3 opacity-80")}<span class="flex-1">${l.name}</span><span class="text-xs opacity-80">${l.proficiency}</span></div>`).join("")}</div>` : ""}
    </aside>
    <main class="col-span-2 p-8 space-y-7">
      ${personal.summary ? `<section>${sectionTitle(c, "user", "Profil")}<p class="text-sm text-slate-600 leading-relaxed">${personal.summary}</p></section>` : ""}
      ${experiences.length ? `<section>${sectionTitle(c, "briefcase", "İş Təcrübəsi")}<div class="space-y-4 relative"><div class="absolute left-[7px] top-2 bottom-2 w-px bg-slate-200"></div>${experiences.map((e) => `<div class="relative pl-7"><div class="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full ${c.solid} ring-4 ring-white"></div><div class="flex justify-between items-start gap-3"><h4 class="font-semibold text-slate-800">${e.role}</h4><span class="text-xs text-slate-500 flex items-center gap-1 whitespace-nowrap">${icon("calendar", "w-3 h-3")}${formatDate(e.startDate)} — ${formatDate(e.endDate, e.current)}</span></div><p class="text-sm ${c.text} font-medium">${e.company}${e.location ? ` · ${e.location}` : ""}</p><p class="text-sm text-slate-600 mt-1 leading-relaxed">${e.description}</p></div>`).join("")}</div></section>` : ""}
      ${education.length ? `<section>${sectionTitle(c, "graduation-cap", "Təhsil")}<div class="space-y-3">${education.map((ed) => `<div class="pl-1"><div class="flex justify-between items-start gap-3"><h4 class="font-semibold text-slate-800">${ed.degree}</h4><span class="text-xs text-slate-500 flex items-center gap-1 whitespace-nowrap">${icon("calendar", "w-3 h-3")}${formatDate(ed.startDate)} — ${formatDate(ed.endDate)}</span></div><p class="text-sm ${c.text} font-medium">${ed.school}${ed.location ? ` · ${ed.location}` : ""}</p>${ed.description ? `<p class="text-sm text-slate-600 mt-1">${ed.description}</p>` : ""}</div>`).join("")}</div></section>` : ""}
    </main>
  </div>`;
}

export function refreshPreviewIcons() {
  refreshIcons();
}
