import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://zqzrghyryblrbrruvkud.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxenJnaHlyeWJscmJycnV2a3VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ1Mjg2NjYsImV4cCI6MjEwMDEwNDY2Nn0.GDxqERRk4fvXR55rI63D2-LEfCHH4_AC2lq7oQC8Lvw";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export const uid = () => Math.random().toString(36).slice(2, 9);

export const emptyCV = {
  personal: {
    fullName: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    summary: "",
    photoUrl: "",
  },
  experiences: [],
  education: [],
  skills: [],
  languages: [],
};

export const sampleCV = {
  personal: {
    fullName: "Leyla Əhmədova",
    title: "Senior Frontend Developer",
    email: "leyla.ahmedova@example.com",
    phone: "+994 50 123 45 67",
    location: "Bakı, Azərbaycan",
    website: "leyla.dev",
    summary:
      "İstifadə təcrübəsinə fokuslanmış frontend həlli yaradan 7 illik təcrübəli developer. React, TypeScript və performans optimallaşdırması üzrə ixtisaslaşıram. Komandaları mentorluq etməyi və məhsul inkişafına töhfə verməyi sevirem.",
    photoUrl: "",
  },
  experiences: [
    {
      id: "e1",
      role: "Senior Frontend Developer",
      company: "AzTech Solutions",
      location: "Bakı",
      startDate: "2022-03",
      endDate: "",
      current: true,
      description:
        "React 18 və TypeScript əsaslı dizayn sistemini rəhbərlik etdim. Komanda 6 nəfərə çatdı, veb tətbiqetmənin yüklənmə sürəti 40% yaxşılaşdı.",
    },
    {
      id: "e2",
      role: "Frontend Developer",
      company: "Digital Wave",
      location: "Bakı",
      startDate: "2019-06",
      endDate: "2022-02",
      current: false,
      description:
        "Müştəri portallarının inkişafı, komponent kitabxanasının yaradılması və CI/CD proseslərinin optimallaşdırılması.",
    },
  ],
  education: [
    {
      id: "ed1",
      degree: "Bakalavr, Kompüter Elmləri",
      school: "Bakı Dövlət Universiteti",
      location: "Bakı",
      startDate: "2015-09",
      endDate: "2019-06",
      description: "Fərqlənmə diplomu, GPa 3.8/4.0",
    },
  ],
  skills: [
    { id: "s1", name: "React / TypeScript", level: 95 },
    { id: "s2", name: "Next.js", level: 88 },
    { id: "s3", name: "Tailwind CSS", level: 92 },
    { id: "s4", name: "Node.js", level: 80 },
    { id: "s5", name: "UI/UX Dizayn", level: 75 },
  ],
  languages: [
    { id: "l1", name: "Azərbaycan", proficiency: "Ana dili" },
    { id: "l2", name: "İngilis", proficiency: "Yaxşı (C1)" },
    { id: "l3", name: "Rus", proficiency: "Orta (B2)" },
  ],
};

export const accentMap = {
  blue: { from: "from-blue-600", to: "to-indigo-600", solid: "bg-blue-600", soft: "bg-blue-50", text: "text-blue-700", ring: "ring-blue-200" },
  emerald: { from: "from-emerald-600", to: "to-teal-600", solid: "bg-emerald-600", soft: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-200" },
  amber: { from: "from-amber-500", to: "to-orange-600", solid: "bg-amber-500", soft: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-200" },
  rose: { from: "from-rose-600", to: "to-pink-600", solid: "bg-rose-600", soft: "bg-rose-50", text: "text-rose-700", ring: "ring-rose-200" },
  slate: { from: "from-slate-700", to: "to-slate-900", solid: "bg-slate-800", soft: "bg-slate-100", text: "text-slate-700", ring: "ring-slate-200" },
};

export const accentSwatch = {
  blue: "bg-blue-500",
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
  slate: "bg-slate-700",
};

export const templates = [
  { id: "modern", name: "Müasir", description: "Yan başlıqlı, rəngli vurğu" },
  { id: "classic", name: "Klassik", description: "Mərkəzləşmiş, ənənəvi" },
  { id: "minimal", name: "Minimal", description: "Təmiz, geniş boşluqlu" },
  { id: "elegant", name: "Zərif", description: "Serif fontlu, premium hiss" },
  { id: "creative", name: "Kreativ", description: "Rəngli başlıq, canlı dizayn" },
];

export function formatDate(iso, current = false) {
  if (current) return "Hal-hazırda";
  if (!iso) return "";
  const [y, m] = iso.split("-");
  const months = ["Yan", "Fev", "Mar", "Apr", "May", "İyn", "İyl", "Avq", "Sen", "Okt", "Noy", "Dek"];
  const mi = parseInt(m, 10) - 1;
  return `${months[mi] || ""} ${y}`;
}

export function refreshIcons() {
  if (window.lucide) window.lucide.createIcons();
}
