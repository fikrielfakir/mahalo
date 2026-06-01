import{u as m,r as a,G as x,j as e,N as v,o as f,F as g}from"./index-CgOxuIzU.js";import{S as h}from"./SEOHead-CGt4q0jP.js";import{S as j}from"./shield-CWLEMt5x.js";const l=`
## 1. Collecte des données
Nous collectons les informations que vous nous fournissez directement lors de la création de votre compte, de la soumission d'une annonce ou de l'utilisation de nos services.

## 2. Utilisation des données
Vos données sont utilisées pour :
- Fournir et améliorer nos services
- Vous contacter concernant votre compte ou vos annonces
- Personnaliser votre expérience sur la plateforme

## 3. Partage des données
Nous ne vendons pas vos données personnelles à des tiers. Nous pouvons partager certaines informations avec nos agents partenaires dans le cadre de votre demande.

## 4. Sécurité
Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos informations contre tout accès non autorisé.

## 5. Vos droits
Vous avez le droit d'accéder, de corriger ou de supprimer vos données personnelles à tout moment en nous contactant.

## 6. Contact
Pour toute question concernant cette politique, contactez-nous à l'adresse indiquée dans nos informations de contact.
`;function N(t){return t.split(`
`).map((s,n)=>s.startsWith("## ")?e.jsx("h2",{className:"text-lg font-bold text-navy mt-7 mb-2",children:s.slice(3)},n):s.startsWith("# ")?e.jsx("h1",{className:"text-2xl font-bold text-navy mt-8 mb-3",children:s.slice(2)},n):s.startsWith("- ")?e.jsx("li",{className:"ml-5 list-disc text-navy/70 text-sm leading-relaxed",children:s.slice(2)},n):s.trim()===""?e.jsx("div",{className:"h-2"},n):e.jsx("p",{className:"text-navy/70 text-sm leading-relaxed",children:s},n))}function S(){const{t,i18n:s}=m(),[n,o]=a.useState(""),[d,r]=a.useState(!0);return a.useEffect(()=>{var i;const u=(i=s.language)==null?void 0:i.slice(0,2);r(!0),x.get(u).then(p=>{var c;return o(((c=p.data)==null?void 0:c.page_privacy)||l)}).catch(()=>o(l)).finally(()=>r(!1))},[s.language]),e.jsxs("div",{className:"min-h-screen bg-surface flex flex-col",children:[e.jsx(h,{title:t("pages.privacy.seoTitle"),description:t("pages.privacy.seoDesc"),robots:"noindex,follow"}),e.jsx(v,{}),e.jsxs("section",{className:"pt-28 pb-14 px-6 bg-navy text-center",children:[e.jsxs("div",{className:"inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/70 text-xs font-semibold uppercase tracking-widest mb-5",children:[e.jsx(j,{size:12})," ",t("pages.privacy.badge")]}),e.jsx("h1",{className:"text-3xl sm:text-4xl font-bold text-white mb-3",children:t("pages.privacy.title")}),e.jsx("p",{className:"text-white/50 text-sm",children:t("pages.lastUpdated")})]}),e.jsx("main",{className:"flex-1 py-14 px-6",children:e.jsx("div",{className:"max-w-2xl mx-auto bg-white rounded-3xl shadow-card p-8 sm:p-10",children:d?e.jsxs("div",{className:"flex items-center justify-center gap-3 py-16 text-navy/40",children:[e.jsx(f,{size:20,className:"animate-spin"})," ",t("pages.loading")]}):e.jsx("div",{className:"space-y-0.5",children:N(n)})})}),e.jsx(g,{})]})}export{S as default};
