import{r as o,E as l,j as e,N as d,o as u,F as m}from"./index-DtYTvuhZ.js";import{S as x}from"./SEOHead-zAb2PDyK.js";import{S as p}from"./shield-DXiG-Zo1.js";const r=`
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
`;function f(n){return n.split(`
`).map((s,t)=>s.startsWith("## ")?e.jsx("h2",{className:"text-lg font-bold text-navy mt-7 mb-2",children:s.slice(3)},t):s.startsWith("# ")?e.jsx("h1",{className:"text-2xl font-bold text-navy mt-8 mb-3",children:s.slice(2)},t):s.startsWith("- ")?e.jsx("li",{className:"ml-5 list-disc text-navy/70 text-sm leading-relaxed",children:s.slice(2)},t):s.trim()===""?e.jsx("div",{className:"h-2"},t):e.jsx("p",{className:"text-navy/70 text-sm leading-relaxed",children:s},t))}function g(){const[n,s]=o.useState(""),[t,i]=o.useState(!0);return o.useEffect(()=>{l.get().then(c=>{var a;return s(((a=c.data)==null?void 0:a.page_privacy)||r)}).catch(()=>s(r)).finally(()=>i(!1))},[]),e.jsxs("div",{className:"min-h-screen bg-surface flex flex-col",children:[e.jsx(x,{title:"Privacy Policy",description:"Learn how Mahalo Real Estate collects, uses, and protects your personal data on our Morocco real estate platform.",robots:"noindex,follow"}),e.jsx(d,{}),e.jsxs("section",{className:"pt-28 pb-14 px-6 bg-navy text-center",children:[e.jsxs("div",{className:"inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/70 text-xs font-semibold uppercase tracking-widest mb-5",children:[e.jsx(p,{size:12})," Politique de confidentialité"]}),e.jsx("h1",{className:"text-3xl sm:text-4xl font-bold text-white mb-3",children:"Politique de confidentialité"}),e.jsx("p",{className:"text-white/50 text-sm",children:"Dernière mise à jour par l'administrateur"})]}),e.jsx("main",{className:"flex-1 py-14 px-6",children:e.jsx("div",{className:"max-w-2xl mx-auto bg-white rounded-3xl shadow-card p-8 sm:p-10",children:t?e.jsxs("div",{className:"flex items-center justify-center gap-3 py-16 text-navy/40",children:[e.jsx(u,{size:20,className:"animate-spin"})," Chargement…"]}):e.jsx("div",{className:"space-y-0.5",children:f(n)})})}),e.jsx(m,{})]})}export{g as default};
