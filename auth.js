import { supabase, refreshIcons } from "./app.js";

export async function renderAuth(onAuthed) {
  const app = document.getElementById("app");
  let mode = "signin";
  let email = "";
  let password = "";
  let error = null;
  let loading = false;

  let info = null;

  const submit = async (e) => {
    e.preventDefault();
    error = null;
    info = null;
    loading = true;
    paint();
    if (mode === "signin") {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      loading = false;
      if (err) {
        error = err.message;
        paint();
      } else {
        onAuthed();
      }
    } else {
      const { data, error: err } = await supabase.auth.signUp({ email, password });
      loading = false;
      if (err) {
        error = err.message;
        paint();
      } else if (data?.user && !data?.session) {
        const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
        if (signInErr) {
          info = "Hesab yaradıldı! Daxil olmaq üçün e-poçtu təsdiqləyin, sonra giriş edin.";
          mode = "signin";
          paint();
        } else {
          onAuthed();
        }
      } else {
        onAuthed();
      }
    }
  };

  const paint = () => {
    app.innerHTML = `
      <div class="min-h-screen bg-slate-950 text-white overflow-hidden">
        <!-- Background -->
        <div class="fixed inset-0 -z-10">
          <div class="absolute top-0 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
          <div class="absolute top-40 right-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"></div>
          <div class="absolute bottom-0 left-1/3 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl"></div>
          <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        </div>

        <!-- Nav -->
        <nav class="sticky top-0 z-20 backdrop-blur-xl bg-slate-950/60 border-b border-white/5">
          <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <i data-lucide="file-text" class="w-5 h-5 text-white"></i>
              </div>
              <span class="font-bold text-lg tracking-tight">CV Hazırlayıcı</span>
            </div>
            <div class="hidden sm:flex items-center gap-6 text-sm text-slate-300">
              <a href="#features" class="hover:text-white transition">Xüsusiyyətlər</a>
              <a href="#templates" class="hover:text-white transition">Şablonlar</a>
              <button id="nav-cta" class="px-4 py-2 rounded-lg bg-white text-slate-900 font-medium hover:bg-slate-100 transition text-sm">Başla</button>
            </div>
          </div>
        </nav>

        <div class="max-w-7xl mx-auto px-6 py-12 lg:py-20 grid lg:grid-cols-2 gap-12 items-center">
          <!-- Left: Hero -->
          <div class="space-y-8">
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Pulsuz · Məhdudiyyətsiz CV
            </div>
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight">
              Profesional CV-ni<br/>
              <span class="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">dəqiqələr içində</span> yarat
            </h1>
            <p class="text-lg text-slate-400 leading-relaxed max-w-md">
              5 müasir şablon, canlı nümayiş, PDF ixracı və bulud saxlama. Hər şey bir yerdə — tamamilə pulsuz.
            </p>
            <div class="flex flex-wrap gap-3">
              <button id="hero-cta" class="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] transition flex items-center gap-2">
                İndi başla
                <i data-lucide="arrow-right" class="w-4 h-4"></i>
              </button>
              <a href="#features" class="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition flex items-center gap-2">
                <i data-lucide="play" class="w-4 h-4"></i>
                Daha çox
              </a>
            </div>
            <div class="flex items-center gap-6 pt-4">
              <div>
                <div class="text-2xl font-bold">5</div>
                <div class="text-xs text-slate-500">Şablon</div>
              </div>
              <div class="w-px h-10 bg-white/10"></div>
              <div>
                <div class="text-2xl font-bold">PDF</div>
                <div class="text-xs text-slate-500">İxrac</div>
              </div>
              <div class="w-px h-10 bg-white/10"></div>
              <div>
                <div class="text-2xl font-bold">∞</div>
                <div class="text-xs text-slate-500">CV sayı</div>
              </div>
            </div>
          </div>

          <!-- Right: Auth card -->
          <div class="lg:pl-8">
            <div class="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-8 max-w-md mx-auto" id="auth-card">
              <div class="flex bg-white/5 rounded-xl p-1 mb-6 border border-white/5">
                <button id="tab-signin" class="flex-1 py-2.5 rounded-lg text-sm font-medium transition ${mode === "signin" ? "bg-white text-slate-900 shadow" : "text-slate-300 hover:text-white"}">Daxil ol</button>
                <button id="tab-signup" class="flex-1 py-2.5 rounded-lg text-sm font-medium transition ${mode === "signup" ? "bg-white text-slate-900 shadow" : "text-slate-300 hover:text-white"}">Qeydiyyat</button>
              </div>
              <form id="auth-form" class="space-y-4">
                <div>
                  <label class="block text-xs font-medium text-slate-400 mb-1.5">E-poçt</label>
                  <div class="relative">
                    <i data-lucide="mail" class="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2"></i>
                    <input id="email" type="email" required value="${email}" placeholder="ad@example.com" class="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-3.5 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition" />
                  </div>
                </div>
                <div>
                  <label class="block text-xs font-medium text-slate-400 mb-1.5">Şifrə</label>
                  <div class="relative">
                    <i data-lucide="lock" class="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2"></i>
                    <input id="password" type="password" required minlength="6" value="${password}" placeholder="••••••••" class="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-3.5 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition" />
                  </div>
                </div>
                ${error ? `<div class="text-xs text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3.5 py-2.5">${error}</div>` : ""}
                ${info ? `<div class="text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3.5 py-2.5">${info}</div>` : ""}
                <button type="submit" ${loading ? "disabled" : ""} class="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl py-3 text-sm font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition disabled:opacity-60">
                  ${loading ? '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i>' : `${mode === "signin" ? "Daxil ol" : "Hesab yarat"} <i data-lucide="arrow-right" class="w-4 h-4"></i>`}
                </button>
              </form>
              <p class="text-center text-xs text-slate-500 mt-5">${mode === "signin" ? "Hesabın yoxdur? " : "Artıq hesabın var? "}<button id="switch-mode" class="text-blue-400 hover:text-blue-300 font-medium">${mode === "signin" ? "Qeydiyyatdan keç" : "Daxil ol"}</button></p>
            </div>
          </div>
        </div>

        <!-- Features -->
        <section id="features" class="max-w-7xl mx-auto px-6 py-16 border-t border-white/5">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold mb-3">Niyə biz?</h2>
            <p class="text-slate-400">Hər şey CV-ni dərhal yaratmaq üçün</p>
          </div>
          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="bg-white/5 rounded-2xl border border-white/10 p-6 hover:bg-white/[0.07] hover:border-white/20 transition group">
              <div class="w-11 h-11 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition"><i data-lucide="layout-template" class="w-5 h-5 text-blue-400"></i></div>
              <h3 class="font-semibold mb-1.5">5 Professional Şablon</h3>
              <p class="text-sm text-slate-400 leading-relaxed">Müasir, klassik, minimal, zərif və kreativ — hər bir peşə üçün.</p>
            </div>
            <div class="bg-white/5 rounded-2xl border border-white/10 p-6 hover:bg-white/[0.07] hover:border-white/20 transition group">
              <div class="w-11 h-11 rounded-xl bg-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition"><i data-lucide="eye" class="w-5 h-5 text-cyan-400"></i></div>
              <h3 class="font-semibold mb-1.5">Canlı Nümayiş</h3>
              <p class="text-sm text-slate-400 leading-relaxed">Dəyişikliklər dərhal CV-də görünür — nə yazdığınızı anında görürsünüz.</p>
            </div>
            <div class="bg-white/5 rounded-2xl border border-white/10 p-6 hover:bg-white/[0.07] hover:border-white/20 transition group">
              <div class="w-11 h-11 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition"><i data-lucide="download" class="w-5 h-5 text-emerald-400"></i></div>
              <h3 class="font-semibold mb-1.5">PDF İxracı</h3>
              <p class="text-sm text-slate-400 leading-relaxed">Bir kliklə CV-ni PDF formatında endirin və işəgötürənlərə göndərin.</p>
            </div>
            <div class="bg-white/5 rounded-2xl border border-white/10 p-6 hover:bg-white/[0.07] hover:border-white/20 transition group">
              <div class="w-11 h-11 rounded-xl bg-amber-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition"><i data-lucide="cloud" class="w-5 h-5 text-amber-400"></i></div>
              <h3 class="font-semibold mb-1.5">Bulud Saxlama</h3>
              <p class="text-sm text-slate-400 leading-relaxed">CV-ləriniz təhlükəsiz şəkildə saxlanılır — istənilən cihazdan davam edin.</p>
            </div>
            <div class="bg-white/5 rounded-2xl border border-white/10 p-6 hover:bg-white/[0.07] hover:border-white/20 transition group">
              <div class="w-11 h-11 rounded-xl bg-rose-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition"><i data-lucide="palette" class="w-5 h-5 text-rose-400"></i></div>
              <h3 class="font-semibold mb-1.5">Rəng Vurğuları</h3>
              <p class="text-sm text-slate-400 leading-relaxed">5 rəng sxemi ilə CV-nizin görünüşünü fərdiləşdirin.</p>
            </div>
            <div class="bg-white/5 rounded-2xl border border-white/10 p-6 hover:bg-white/[0.07] hover:border-white/20 transition group">
              <div class="w-11 h-11 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition"><i data-lucide="infinity" class="w-5 h-5 text-indigo-400"></i></div>
              <h3 class="font-semibold mb-1.5">Məhdudiyyətsiz</h3>
              <p class="text-sm text-slate-400 leading-relaxed">İstənilən sayda CV yaradın — tamamilə pulsuz, gizli ödəniş yoxdur.</p>
            </div>
          </div>
        </section>

        <!-- Templates preview -->
        <section id="templates" class="max-w-7xl mx-auto px-6 py-16 border-t border-white/5">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold mb-3">Şablonlar</h2>
            <p class="text-slate-400">Hər zövqə uyğun dizayn</p>
          </div>
          <div class="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-white/10 p-5 text-center hover:scale-105 hover:border-blue-500/30 transition cursor-default">
              <div class="w-full h-24 bg-gradient-to-br from-blue-500/30 to-blue-700/30 rounded-lg mb-3 flex items-center justify-center"><i data-lucide="layout" class="w-8 h-8 text-blue-300"></i></div>
              <h3 class="font-semibold text-sm">Müasir</h3>
              <p class="text-xs text-slate-500 mt-0.5">Yan başlıqlı</p>
            </div>
            <div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-white/10 p-5 text-center hover:scale-105 hover:border-cyan-500/30 transition cursor-default">
              <div class="w-full h-24 bg-gradient-to-br from-cyan-500/30 to-teal-700/30 rounded-lg mb-3 flex items-center justify-center"><i data-lucide="align-center" class="w-8 h-8 text-cyan-300"></i></div>
              <h3 class="font-semibold text-sm">Klassik</h3>
              <p class="text-xs text-slate-500 mt-0.5">Mərkəzləşmiş</p>
            </div>
            <div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-white/10 p-5 text-center hover:scale-105 hover:border-emerald-500/30 transition cursor-default">
              <div class="w-full h-24 bg-gradient-to-br from-slate-700/30 to-slate-900/30 rounded-lg mb-3 flex items-center justify-center"><i data-lucide="minus" class="w-8 h-8 text-slate-300"></i></div>
              <h3 class="font-semibold text-sm">Minimal</h3>
              <p class="text-xs text-slate-500 mt-0.5">Təmiz dizayn</p>
            </div>
            <div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-white/10 p-5 text-center hover:scale-105 hover:border-amber-500/30 transition cursor-default">
              <div class="w-full h-24 bg-gradient-to-br from-amber-500/30 to-orange-700/30 rounded-lg mb-3 flex items-center justify-center"><i data-lucide="sparkles" class="w-8 h-8 text-amber-300"></i></div>
              <h3 class="font-semibold text-sm">Zərif</h3>
              <p class="text-xs text-slate-500 mt-0.5">Serif fontlu</p>
            </div>
            <div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-white/10 p-5 text-center hover:scale-105 hover:border-rose-500/30 transition cursor-default">
              <div class="w-full h-24 bg-gradient-to-br from-rose-500/30 to-pink-700/30 rounded-lg mb-3 flex items-center justify-center"><i data-lucide="zap" class="w-8 h-8 text-rose-300"></i></div>
              <h3 class="font-semibold text-sm">Kreativ</h3>
              <p class="text-xs text-slate-500 mt-0.5">Canlı dizayn</p>
            </div>
          </div>
        </section>

        <!-- CTA -->
        <section class="max-w-7xl mx-auto px-6 py-20 text-center border-t border-white/5">
          <h2 class="text-3xl sm:text-4xl font-bold mb-4">Hazırsan?</h2>
          <p class="text-slate-400 mb-8">Bir neçə dəqiqəyə professional CV-ni yarat</p>
          <button id="final-cta" class="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold shadow-xl shadow-blue-500/30 hover:scale-[1.03] transition inline-flex items-center gap-2">
            Pulsuz başla
            <i data-lucide="arrow-right" class="w-5 h-5"></i>
          </button>
        </section>

        <!-- Footer -->
        <footer class="border-t border-white/5">
          <div class="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
            <div class="flex items-center gap-2">
              <div class="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center"><i data-lucide="file-text" class="w-3.5 h-3.5 text-white"></i></div>
              <span>CV Hazırlayıcı</span>
            </div>
            <p>© 2026 · Bütün hüquqlar qorunur</p>
          </div>
        </footer>
      </div>`;

    refreshIcons();
    const focusAuth = () => document.getElementById("email")?.focus();
    document.getElementById("tab-signin").onclick = () => { mode = "signin"; paint(); };
    document.getElementById("tab-signup").onclick = () => { mode = "signup"; paint(); };
    document.getElementById("switch-mode").onclick = () => { mode = mode === "signin" ? "signup" : "signin"; paint(); };
    document.getElementById("email").oninput = (e) => { email = e.target.value; };
    document.getElementById("password").oninput = (e) => { password = e.target.value; };
    document.getElementById("auth-form").onsubmit = submit;
    ["nav-cta", "hero-cta", "final-cta"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.onclick = focusAuth;
    });
  };

  paint();
}
