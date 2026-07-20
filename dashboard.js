import { supabase, sampleCV, emptyCV, refreshIcons } from "./app.js";

export async function renderDashboard(user, onOpen, onSignOut) {
  const app = document.getElementById("app");
  let cvs = [];
  let loading = true;
  let creating = false;

  const load = async () => {
    loading = true;
    paint();
    const { data, error } = await supabase.from("cvs").select("*").order("updated_at", { ascending: false });
    if (!error && data) cvs = data;
    loading = false;
    paint();
  };

  const createCV = async (withSample) => {
    creating = true;
    paint();
    const baseData = withSample ? sampleCV : {
      ...emptyCV,
      personal: { ...emptyCV.personal, email: user?.email || "" },
    };
    const payload = {
      name: withSample ? "Nümunə CV" : "Yeni CV",
      template: "modern",
      accent: "blue",
      data: baseData,
    };
    const { data, error } = await supabase.from("cvs").insert(payload).select().single();
    creating = false;
    if (!error && data) onOpen(data);
    else paint();
  };

  const duplicate = async (cv) => {
    const { data, error } = await supabase
      .from("cvs")
      .insert({ name: `${cv.name} (kopya)`, template: cv.template, accent: cv.accent, data: cv.data })
      .select().single();
    if (!error && data) load();
  };

  const remove = async (cv) => {
    if (!confirm(`"${cv.name}" silinsin?`)) return;
    await supabase.from("cvs").delete().eq("id", cv.id);
    load();
  };

  const initials = (cv) => {
    const name = cv.data?.personal?.fullName || cv.name;
    return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "CV";
  };

  const accentBg = (accent) => {
    const map = {
      blue: "from-blue-500 to-indigo-500",
      emerald: "from-emerald-500 to-teal-500",
      amber: "from-amber-500 to-orange-500",
      rose: "from-rose-500 to-pink-500",
      slate: "from-slate-600 to-slate-800",
    };
    return map[accent] || map.blue;
  };

  const paint = () => {
    app.innerHTML = `
      <div class="min-h-screen bg-slate-50">
        <header class="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-30">
          <div class="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <i data-lucide="file-text" class="w-5 h-5"></i>
              </div>
              <div>
                <h1 class="font-bold text-slate-800 leading-tight">CV Hazırlayıcı</h1>
                <p class="text-xs text-slate-400 leading-tight">CV-lərim</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100">
                <div class="w-7 h-7 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white text-xs font-bold">
                  ${(user?.email || "U")[0].toUpperCase()}
                </div>
                <span class="text-xs text-slate-600 font-medium max-w-[140px] truncate">${user?.email || ""}</span>
              </div>
              <button id="signout" class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 text-xs font-medium hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition">
                <i data-lucide="log-out" class="w-4 h-4"></i>Çıxış
              </button>
            </div>
          </div>
        </header>
        <main class="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h2 class="text-2xl font-bold text-slate-800">CV-lərim</h2>
              <p class="text-sm text-slate-500 mt-1">${cvs.length} CV yaradılmışdır</p>
            </div>
            <div class="flex gap-2">
              <button id="create-empty" ${creating ? "disabled" : ""} class="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white border border-slate-200 text-sm font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition disabled:opacity-60">
                ${creating ? '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i>' : '<i data-lucide="plus" class="w-4 h-4"></i>'}Boş CV
              </button>
              <button id="create-sample" ${creating ? "disabled" : ""} class="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-medium hover:shadow-md hover:shadow-blue-500/30 transition disabled:opacity-60">
                <i data-lucide="file-plus-2" class="w-4 h-4"></i>Nümunə ilə
              </button>
            </div>
          </div>
          ${
            loading
              ? '<div class="flex justify-center py-24"><i data-lucide="loader-2" class="w-7 h-7 text-slate-300 animate-spin"></i></div>'
              : cvs.length === 0
              ? `<div class="text-center py-24">
                  <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center text-blue-400 mx-auto mb-5 border border-blue-100">
                    <i data-lucide="file-text" class="w-10 h-10"></i>
                  </div>
                  <h3 class="font-semibold text-slate-700 text-lg">Hələ CV yoxdur</h3>
                  <p class="text-sm text-slate-400 mt-1.5">İlk CV-nizi yaradaraq başlayın</p>
                  <div class="flex justify-center gap-2 mt-6">
                    <button id="empty-cta" class="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white border border-slate-200 text-sm font-medium text-slate-700 hover:border-slate-300 transition">
                      <i data-lucide="plus" class="w-4 h-4"></i>Boş CV
                    </button>
                    <button id="sample-cta" class="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition shadow-sm">
                      <i data-lucide="file-plus-2" class="w-4 h-4"></i>Nümunə ilə
                    </button>
                  </div>
                </div>`
              : `<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  ${cvs
                    .map(
                      (cv) => `
                    <div class="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:shadow-slate-200/60 hover:-translate-y-0.5 transition overflow-hidden">
                      <div class="h-32 bg-gradient-to-br ${accentBg(cv.accent)} relative flex items-center justify-center">
                        <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                        <div class="w-16 h-16 rounded-xl bg-white shadow-lg flex items-center justify-center text-slate-700 font-bold text-lg border border-white/50 relative z-10">
                          ${initials(cv)}
                        </div>
                        <div class="absolute top-2.5 right-2.5 flex gap-1.5 opacity-0 group-hover:opacity-100 transition">
                          <button data-dup="${cv.id}" class="w-8 h-8 rounded-lg bg-white/90 backdrop-blur shadow-sm flex items-center justify-center text-slate-500 hover:text-blue-600 transition" title="Kopyala">
                            <i data-lucide="copy" class="w-3.5 h-3.5"></i>
                          </button>
                          <button data-del="${cv.id}" class="w-8 h-8 rounded-lg bg-white/90 backdrop-blur shadow-sm flex items-center justify-center text-slate-500 hover:text-rose-600 transition" title="Sil">
                            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                          </button>
                        </div>
                      </div>
                      <div class="p-5">
                        <h3 class="font-semibold text-slate-800 truncate">${cv.name}</h3>
                        <p class="text-xs text-slate-400 truncate mt-0.5">${cv.data?.personal?.fullName || "Məlumat daxil edilməyib"}</p>
                        <div class="flex items-center gap-1.5 text-xs text-slate-400 mt-3">
                          <i data-lucide="clock" class="w-3 h-3"></i>
                          ${new Date(cv.updated_at).toLocaleDateString("az-AZ", { day: "numeric", month: "short", year: "numeric" })} tarixində yenilənib
                        </div>
                        <button data-open="${cv.id}" class="mt-4 w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium hover:bg-blue-50 hover:text-blue-700 transition">
                          <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>Redaktə et
                        </button>
                      </div>
                    </div>`
                    )
                    .join("")}
                </div>`
          }
        </main>
      </div>`;

    refreshIcons();

    document.getElementById("signout").onclick = onSignOut;

    document.getElementById("create-empty").onclick = () => createCV(false);
    document.getElementById("create-sample").onclick = () => createCV(true);
    const emptyCta = document.getElementById("empty-cta");
    const sampleCta = document.getElementById("sample-cta");
    if (emptyCta) emptyCta.onclick = () => createCV(false);
    if (sampleCta) sampleCta.onclick = () => createCV(true);

    cvs.forEach((cv) => {
      const el = (s) => document.querySelector(`[${s}="${cv.id}"]`);
      el("data-open").onclick = () => onOpen(cv);
      el("data-dup").onclick = () => duplicate(cv);
      el("data-del").onclick = () => remove(cv);
    });
  };

  await load();
}
