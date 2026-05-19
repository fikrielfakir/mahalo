import{r as i,E as c,j as e,N as d,o as u,F as m}from"./index-9LVFY_Rr.js";import{S as x}from"./SEOHead-DvHm_5r2.js";import{F as p}from"./file-text-BwKUunQC.js";const r=`
## 1. Acceptation des conditions
En accédant à notre plateforme, vous acceptez ces conditions d'utilisation dans leur intégralité.

## 2. Description du service
Mahalo est une plateforme de mise en relation entre vendeurs, bailleurs et acheteurs de biens immobiliers au Maroc.

## 3. Utilisation autorisée
Vous vous engagez à utiliser la plateforme de manière légale et à ne pas publier de contenu frauduleux, inexact ou trompeur.

## 4. Annonces
Les annonceurs sont responsables de l'exactitude des informations publiées. Mahalo se réserve le droit de supprimer toute annonce ne respectant pas nos standards.

## 5. Propriété intellectuelle
Tout le contenu de la plateforme (logos, textes, design) est la propriété exclusive de Mahalo et ne peut être reproduit sans autorisation.

## 6. Limitation de responsabilité
Mahalo agit en tant qu'intermédiaire et n'est pas responsable des transactions conclues entre les parties.

## 7. Modifications
Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications entrent en vigueur dès leur publication.

## 8. Droit applicable
Ces conditions sont régies par le droit marocain. Tout litige sera soumis aux juridictions compétentes de Casablanca.
`;function f(a){return a.split(`
`).map((t,s)=>t.startsWith("## ")?e.jsx("h2",{className:"text-lg font-bold text-navy mt-7 mb-2",children:t.slice(3)},s):t.startsWith("# ")?e.jsx("h1",{className:"text-2xl font-bold text-navy mt-8 mb-3",children:t.slice(2)},s):t.startsWith("- ")?e.jsx("li",{className:"ml-5 list-disc text-navy/70 text-sm leading-relaxed",children:t.slice(2)},s):t.trim()===""?e.jsx("div",{className:"h-2"},s):e.jsx("p",{className:"text-navy/70 text-sm leading-relaxed",children:t},s))}function j(){const[a,t]=i.useState(""),[s,o]=i.useState(!0);return i.useEffect(()=>{c.get().then(l=>{var n;return t(((n=l.data)==null?void 0:n.page_terms)||r)}).catch(()=>t(r)).finally(()=>o(!1))},[]),e.jsxs("div",{className:"min-h-screen bg-surface flex flex-col",children:[e.jsx(x,{title:"Terms of Use",description:"Read the terms and conditions governing your use of the Mahalo Real Estate platform in Morocco.",robots:"noindex,follow"}),e.jsx(d,{}),e.jsxs("section",{className:"pt-28 pb-14 px-6 bg-navy text-center",children:[e.jsxs("div",{className:"inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/70 text-xs font-semibold uppercase tracking-widest mb-5",children:[e.jsx(p,{size:12})," Conditions d'utilisation"]}),e.jsx("h1",{className:"text-3xl sm:text-4xl font-bold text-white mb-3",children:"Conditions d'utilisation"}),e.jsx("p",{className:"text-white/50 text-sm",children:"Dernière mise à jour par l'administrateur"})]}),e.jsx("main",{className:"flex-1 py-14 px-6",children:e.jsx("div",{className:"max-w-2xl mx-auto bg-white rounded-3xl shadow-card p-8 sm:p-10",children:s?e.jsxs("div",{className:"flex items-center justify-center gap-3 py-16 text-navy/40",children:[e.jsx(u,{size:20,className:"animate-spin"})," Chargement…"]}):e.jsx("div",{className:"space-y-0.5",children:f(a)})})}),e.jsx(m,{})]})}export{j as default};
