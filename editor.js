import { uid, refreshIcons } from "./app.js";

const inputCls = "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition";
const labelCls = "block text-xs font-medium text-slate-500 mb-1";

function card(iconName, title, body, action = "") {
  return `<div class="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
    <div class="flex items-center justify-between mb-4">
      <h3 class="flex items-center gap-2 font-semibold text-slate-800"><span class="text-blue-600"><i data-lucide="${iconName}" class="w-5 h-5"></i></span>${title}</h3>
      ${action}
    </div>
    ${body}
  </div>`;
}

export function renderEditor(data, onChange) {
  const set = (patch) => onChange({ ...data, ...patch });
  const setPersonal = (patch) => set({ personal: { ...data.personal, ...patch } });

  const personalCard = card(
    "user",
    "Şəxsi məlumat",
    `<div class="grid grid-cols-2 gap-3">
      <div><label class="${labelCls}">Tam ad</label><input data-p="fullName" class="${inputCls}" value="${data.personal.fullName}" placeholder="Leyla Əhmədova" /></div>
      <div><label class="${labelCls}">Vəzifə</label><input data-p="title" class="${inputCls}" value="${data.personal.title}" placeholder="Senior Frontend Developer" /></div>
      <div><label class="${labelCls}">E-poçt</label><input data-p="email" class="${inputCls}" value="${data.personal.email}" placeholder="ad@example.com" /></div>
      <div><label class="${labelCls}">Telefon</label><input data-p="phone" class="${inputCls}" value="${data.personal.phone}" placeholder="+994 50 123 45 67" /></div>
      <div><label class="${labelCls}">Ünvan</label><input data-p="location" class="${inputCls}" value="${data.personal.location}" placeholder="Bakı, Azərbaycan" /></div>
      <div><label class="${labelCls}">Veb sayt</label><input data-p="website" class="${inputCls}" value="${data.personal.website}" placeholder="leyla.dev" /></div>
      <div class="col-span-2"><label class="${labelCls}">Şəkil URL (isteğe bağlı)</label><input data-p="photoUrl" class="${inputCls}" value="${data.personal.photoUrl}" placeholder="https://..." /></div>
      <div class="col-span-2"><label class="${labelCls}">Qısa təsvir</label><textarea data-p="summary" rows="3" class="${inputCls}" placeholder="Özünüz haqqında qısa məlumat...">${data.personal.summary}</textarea></div>
    </div>`
  );

  const expCard = card(
    "briefcase",
    "İş təcrübəsi",
    `<div class="space-y-3" id="exp-list">
      ${data.experiences
        .map(
          (e) => `<div class="rounded-lg border border-slate-200 p-3 bg-slate-50/50" data-exp="${e.id}">
          <div class="flex items-start gap-2">
            <i data-lucide="grip-vertical" class="w-4 h-4 text-slate-300 mt-2"></i>
            <div class="flex-1 grid grid-cols-2 gap-2">
              <input data-exp-f="role" class="${inputCls}" value="${e.role}" placeholder="Vəzifə" />
              <input data-exp-f="company" class="${inputCls}" value="${e.company}" placeholder="Şirkət" />
              <input data-exp-f="location" class="${inputCls}" value="${e.location}" placeholder="Ünvan" />
              <div class="flex gap-2">
                <input type="month" data-exp-f="startDate" class="${inputCls}" value="${e.startDate}" />
                <input type="month" data-exp-f="endDate" class="${inputCls}" value="${e.endDate}" ${e.current ? "disabled" : ""} />
              </div>
              <label class="col-span-2 flex items-center gap-2 text-xs text-slate-600">
                <input type="checkbox" data-exp-f="current" ${e.current ? "checked" : ""} class="rounded" /> Hal-hazırda burada işləyirəm
              </label>
              <textarea data-exp-f="description" rows="2" class="col-span-2 ${inputCls}" placeholder="Vəzifə təsviri və nailiyyətlər...">${e.description}</textarea>
            </div>
            <button data-exp-del="${e.id}" class="text-slate-300 hover:text-rose-500 mt-2"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
          </div>
        </div>`
        )
        .join("")}
      ${data.experiences.length === 0 ? '<p class="text-xs text-slate-400 text-center py-4">Hələ iş təcrübəsi əlavə edilməyib</p>' : ""}
    </div>`,
    `<button id="add-exp" class="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"><i data-lucide="plus" class="w-4 h-4"></i>Əlavə et</button>`
  );

  const eduCard = card(
    "graduation-cap",
    "Təhsil",
    `<div class="space-y-3" id="edu-list">
      ${data.education
        .map(
          (ed) => `<div class="rounded-lg border border-slate-200 p-3 bg-slate-50/50" data-edu="${ed.id}">
          <div class="flex items-start gap-2">
            <i data-lucide="grip-vertical" class="w-4 h-4 text-slate-300 mt-2"></i>
            <div class="flex-1 grid grid-cols-2 gap-2">
              <input data-edu-f="degree" class="${inputCls}" value="${ed.degree}" placeholder="Dərəcə" />
              <input data-edu-f="school" class="${inputCls}" value="${ed.school}" placeholder="Təhsil ocağı" />
              <input data-edu-f="location" class="${inputCls}" value="${ed.location}" placeholder="Ünvan" />
              <div class="flex gap-2">
                <input type="month" data-edu-f="startDate" class="${inputCls}" value="${ed.startDate}" />
                <input type="month" data-edu-f="endDate" class="${inputCls}" value="${ed.endDate}" />
              </div>
              <textarea data-edu-f="description" rows="2" class="col-span-2 ${inputCls}" placeholder="Əlavə məlumat...">${ed.description}</textarea>
            </div>
            <button data-edu-del="${ed.id}" class="text-slate-300 hover:text-rose-500 mt-2"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
          </div>
        </div>`
        )
        .join("")}
      ${data.education.length === 0 ? '<p class="text-xs text-slate-400 text-center py-4">Hələ təhsil məlumatı əlavə edilməyib</p>' : ""}
    </div>`,
    `<button id="add-edu" class="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"><i data-lucide="plus" class="w-4 h-4"></i>Əlavə et</button>`
  );

  const skillsCard = card(
    "wrench",
    "Bacarıqlar",
    `<div class="space-y-2" id="skills-list">
      ${data.skills
        .map(
          (s) => `<div class="flex items-center gap-2" data-skill="${s.id}">
            <input data-skill-f="name" class="${inputCls} flex-1" value="${s.name}" placeholder="Bacarıq" />
            <input type="range" min="0" max="100" data-skill-f="level" value="${s.level}" class="w-20 accent-blue-600" />
            <span class="text-xs text-slate-400 w-8 text-right">${s.level}%</span>
            <button data-skill-del="${s.id}" class="text-slate-300 hover:text-rose-500"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
          </div>`
        )
        .join("")}
      ${data.skills.length === 0 ? '<p class="text-xs text-slate-400 text-center py-4">Bacarıq yoxdur</p>' : ""}
    </div>`,
    `<button id="add-skill" class="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"><i data-lucide="plus" class="w-4 h-4"></i></button>`
  );

  const langsCard = card(
    "languages",
    "Dillər",
    `<div class="space-y-2" id="langs-list">
      ${data.languages
        .map(
          (l) => `<div class="flex items-center gap-2" data-lang="${l.id}">
            <input data-lang-f="name" class="${inputCls} flex-1" value="${l.name}" placeholder="Dil" />
            <input data-lang-f="proficiency" class="${inputCls}" value="${l.proficiency}" placeholder="Səviyyə" />
            <button data-lang-del="${l.id}" class="text-slate-300 hover:text-rose-500"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
          </div>`
        )
        .join("")}
      ${data.languages.length === 0 ? '<p class="text-xs text-slate-400 text-center py-4">Dil yoxdur</p>' : ""}
    </div>`,
    `<button id="add-lang" class="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"><i data-lucide="plus" class="w-4 h-4"></i></button>`
  );

  const html = `
    <div class="space-y-5">
      ${personalCard}
      ${expCard}
      ${eduCard}
      <div class="grid grid-cols-2 gap-5">${skillsCard}${langsCard}</div>
    </div>`;

  // Attach handlers after render
  setTimeout(() => {
    // personal
    document.querySelectorAll("[data-p]").forEach((el) => {
      el.oninput = (e) => setPersonal({ [el.dataset.p]: e.target.value });
    });

    // experiences
    document.getElementById("add-exp").onclick = () =>
      set({
        experiences: [...data.experiences, { id: uid(), role: "", company: "", location: "", startDate: "", endDate: "", current: false, description: "" }],
      });
    data.experiences.forEach((e) => {
      document.querySelectorAll(`[data-exp="${e.id}"] [data-exp-f]`).forEach((el) => {
        const field = el.dataset.expF;
        if (el.type === "checkbox") {
          el.onchange = (ev) => {
            const next = data.experiences.map((x) => (x.id === e.id ? { ...x, [field]: ev.target.checked } : x));
            set({ experiences: next });
          };
        } else {
          el.oninput = (ev) => {
            const next = data.experiences.map((x) => (x.id === e.id ? { ...x, [field]: ev.target.value } : x));
            set({ experiences: next });
          };
        }
      });
      document.querySelector(`[data-exp-del="${e.id}"]`).onclick = () => set({ experiences: data.experiences.filter((x) => x.id !== e.id) });
    });

    // education
    document.getElementById("add-edu").onclick = () =>
      set({ education: [...data.education, { id: uid(), degree: "", school: "", location: "", startDate: "", endDate: "", description: "" }] });
    data.education.forEach((ed) => {
      document.querySelectorAll(`[data-edu="${ed.id}"] [data-edu-f]`).forEach((el) => {
        const field = el.dataset.eduF;
        el.oninput = (ev) => {
          const next = data.education.map((x) => (x.id === ed.id ? { ...x, [field]: ev.target.value } : x));
          set({ education: next });
        };
      });
      document.querySelector(`[data-edu-del="${ed.id}"]`).onclick = () => set({ education: data.education.filter((x) => x.id !== ed.id) });
    });

    // skills
    document.getElementById("add-skill").onclick = () => set({ skills: [...data.skills, { id: uid(), name: "", level: 70 }] });
    data.skills.forEach((s) => {
      document.querySelectorAll(`[data-skill="${s.id}"] [data-skill-f]`).forEach((el) => {
        const field = el.dataset.skillF;
        el.oninput = (ev) => {
          const val = field === "level" ? parseInt(ev.target.value, 10) : ev.target.value;
          const next = data.skills.map((x) => (x.id === s.id ? { ...x, [field]: val } : x));
          set({ skills: next });
        };
      });
      document.querySelector(`[data-skill-del="${s.id}"]`).onclick = () => set({ skills: data.skills.filter((x) => x.id !== s.id) });
    });

    // languages
    document.getElementById("add-lang").onclick = () => set({ languages: [...data.languages, { id: uid(), name: "", proficiency: "" }] });
    data.languages.forEach((l) => {
      document.querySelectorAll(`[data-lang="${l.id}"] [data-lang-f]`).forEach((el) => {
        const field = el.dataset.langF;
        el.oninput = (ev) => {
          const next = data.languages.map((x) => (x.id === l.id ? { ...x, [field]: ev.target.value } : x));
          set({ languages: next });
        };
      });
      document.querySelector(`[data-lang-del="${l.id}"]`).onclick = () => set({ languages: data.languages.filter((x) => x.id !== l.id) });
    });

    refreshIcons();
  }, 0);

  return html;
}
