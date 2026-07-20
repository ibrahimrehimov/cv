import { supabase, templates, accentSwatch, refreshIcons } from "./app.js";
import { renderAuth } from "./auth.js";
import { renderDashboard } from "./dashboard.js";
import { renderEditor } from "./editor.js";
import { renderPreview } from "./preview.js";

let session = null;
let user = null;
let loading = true;
let openCV = null;

async function bootstrap() {
  const { data } = await supabase.auth.getSession();
  session = data.session;
  user = session?.user ?? null;
  loading = false;

  supabase.auth.onAuthStateChange((event, sess) => {
    const wasSignedIn = !!session;
    session = sess;
    user = sess?.user ?? null;
    if (event === "SIGNED_OUT") openCV = null;
    if (event !== "TOKEN_REFRESHED" || !wasSignedIn) render();
  });

  render();
}

function render() {
  if (loading) {
    document.getElementById("app").innerHTML = `
      <div class="min-h-screen flex items-center justify-center bg-slate-50">
        <div class="flex flex-col items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg">
            <i data-lucide="file-text" class="w-6 h-6"></i>
          </div>
          <i data-lucide="loader-2" class="w-5 h-5 text-slate-400 animate-spin"></i>
        </div>
      </div>`;
    refreshIcons();
    return;
  }

  if (!session) {
    renderAuth(async () => {
      const { data } = await supabase.auth.getSession();
      session = data.session;
      user = session?.user ?? null;
      render();
    });
    return;
  }

  if (openCV) {
    renderEditorView(openCV, user, async () => { await supabase.auth.signOut(); });
    return;
  }

  renderDashboard(user, (cv) => { openCV = cv; render(); }, async () => { await supabase.auth.signOut(); });
}

let editorState = { data: null, template: null, accent: null, name: null, view: "preview", saving: false, saved: false, dirty: false };
let saveTimer = null;

function renderEditorView(cv, user, onSignOut) {
  const app = document.getElementById("app");

  if (!editorState.data || editorState._cvId !== cv.id) {
    editorState = {
      _cvId: cv.id,
      data: cv.data,
      template: cv.template,
      accent: cv.accent,
      name: cv.name,
      view: "preview",
      saving: false,
      saved: false,
      dirty: false,
    };
  }

  const save = async () => {
    editorState.saving = true;
    paint();
    const { error } = await supabase
      .from("cvs")
      .update({ data: editorState.data, template: editorState.template, accent: editorState.accent, name: editorState.name, updated_at: new Date().toISOString() })
      .eq("id", cv.id);
    editorState.saving = false;
    if (!error) {
      editorState.saved = true;
      editorState.dirty = false;
      paint();
      setTimeout(() => { editorState.saved = false; paint(); }, 1500);
    } else {
      paint();
    }
  };

  const onChange = (newData) => {
    editorState.data = newData;
    editorState.dirty = true;
    paint();
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => { if (editorState.dirty) save(); }, 1500);
  };

  const paint = () => {
    const { data, template, accent, name, view, saving, saved, dirty } = editorState;
    app.innerHTML = `
      <div class="min-h-screen bg-slate-100">
        <header class="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200 print:hidden">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
            <div class="flex items-center gap-3 min-w-0">
              <button id="back" class="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition shrink-0">
                <i data-lucide="arrow-left" class="w-4 h-4"></i>CV-lər
              </button>
              <span class="text-slate-300">/</span>
              <input id="cv-name" value="${name}" class="font-semibold text-slate-800 bg-transparent border-none focus:outline-none focus:ring-0 text-sm min-w-0 truncate" />
              ${saving ? '<i data-lucide="loader-2" class="w-3.5 h-3.5 text-slate-400 animate-spin shrink-0"></i>' : saved ? '<i data-lucide="check" class="w-3.5 h-3.5 text-emerald-500 shrink-0"></i>' : dirty ? '<span class="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span>' : ""}
            </div>
            <div class="flex items-center gap-2">
              <div class="hidden md:flex items-center bg-slate-100 rounded-lg p-0.5">
                <button id="view-edit" class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition ${view === "edit" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}">
                  <i data-lucide="pencil" class="w-3.5 h-3.5"></i>Redaktə
                </button>
                <button id="view-preview" class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition ${view === "preview" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}">
                  <i data-lucide="eye" class="w-3.5 h-3.5"></i>Nümayiş
                </button>
              </div>
              <button id="save-btn" class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-medium hover:border-slate-300 transition">
                <i data-lucide="save" class="w-3.5 h-3.5"></i>Saxla
              </button>
              <button id="print-btn" class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition shadow-sm">
                <i data-lucide="download" class="w-3.5 h-3.5"></i><span class="hidden sm:inline">PDF</span>
              </button>
              <div class="hidden sm:flex items-center gap-2 px-2 py-1.5">
                <div class="w-7 h-7 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white text-xs font-bold">
                  ${(user?.email || "U")[0].toUpperCase()}
                </div>
                <span class="text-xs text-slate-600 font-medium max-w-[120px] truncate">${user?.email || ""}</span>
              </div>
              <button id="editor-signout" class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 text-xs font-medium hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition">
                <i data-lucide="log-out" class="w-4 h-4"></i><span class="hidden sm:inline">Çıxış</span>
              </button>
            </div>
          </div>
        </header>
        <main class="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div class="grid lg:grid-cols-5 gap-6">
            <div class="lg:col-span-2 space-y-4 print:hidden ${view === "preview" ? "hidden lg:block" : ""}">
              <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-4">
                <div>
                  <p class="text-xs font-medium text-slate-500 mb-2">Şablon</p>
                  <div class="grid grid-cols-3 gap-2">
                    ${templates.map((t) => `<button data-tpl="${t.id}" class="rounded-lg border p-2 text-center transition ${template === t.id ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-slate-300"}"><span class="block text-xs font-semibold text-slate-700">${t.name}</span><span class="block text-[10px] text-slate-400 leading-tight mt-0.5">${t.description}</span></button>`).join("")}
                  </div>
                </div>
                <div>
                  <p class="text-xs font-medium text-slate-500 mb-2">Rəng vurğusu</p>
                  <div class="flex items-center gap-2">
                    ${Object.keys(accentSwatch).map((col) => `<button data-accent="${col}" class="w-7 h-7 rounded-full ${accentSwatch[col]} transition ring-offset-2 ${accent === col ? "ring-2 ring-slate-400 scale-110" : "hover:scale-105"}" aria-label="${col}"></button>`).join("")}
                  </div>
                </div>
              </div>
              <div id="editor-mount"></div>
            </div>
            <div class="lg:col-span-3 ${view === "edit" ? "hidden lg:block" : ""}">
              <div class="md:hidden mb-3 flex justify-center print:hidden">
                <div class="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-sm">
                  <button id="m-view-edit" class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium ${view === "edit" ? "bg-slate-100 text-slate-800" : "text-slate-500"}">
                    <i data-lucide="pencil" class="w-3.5 h-3.5"></i>Redaktə
                  </button>
                  <button id="m-view-preview" class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium ${view === "preview" ? "bg-slate-100 text-slate-800" : "text-slate-500"}">
                    <i data-lucide="eye" class="w-3.5 h-3.5"></i>Nümayiş
                  </button>
                </div>
              </div>
              <div class="print-area" id="preview-mount"></div>
            </div>
          </div>
        </main>
      </div>`;

    refreshIcons();

    // mount editor and preview
    const editorMount = document.getElementById("editor-mount");
    if (editorMount) editorMount.innerHTML = renderEditor(data, onChange);
    const previewMount = document.getElementById("preview-mount");
    if (previewMount) previewMount.innerHTML = renderPreview(data, template, accent);
    refreshIcons();

    document.getElementById("editor-signout").onclick = onSignOut;

    document.getElementById("back").onclick = () => { openCV = null; editorState.data = null; render(); };
    document.getElementById("cv-name").oninput = (e) => { editorState.name = e.target.value; editorState.dirty = true; };
    document.getElementById("save-btn").onclick = save;
    document.getElementById("print-btn").onclick = () => window.print();
    document.getElementById("view-edit").onclick = () => { editorState.view = "edit"; paint(); };
    document.getElementById("view-preview").onclick = () => { editorState.view = "preview"; paint(); };
    const me = document.getElementById("m-view-edit");
    const mp = document.getElementById("m-view-preview");
    if (me) me.onclick = () => { editorState.view = "edit"; paint(); };
    if (mp) mp.onclick = () => { editorState.view = "preview"; paint(); };

    // template & accent
    templates.forEach((t) => {
      const el = document.querySelector(`[data-tpl="${t.id}"]`);
      if (el) el.onclick = () => { editorState.template = t.id; editorState.dirty = true; paint(); };
    });
    Object.keys(accentSwatch).forEach((col) => {
      const el = document.querySelector(`[data-accent="${col}"]`);
      if (el) el.onclick = () => { editorState.accent = col; editorState.dirty = true; paint(); };
    });
  };

  paint();
}

bootstrap();
