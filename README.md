# 🎰 zReview — SaaS de Gamification d'Avis Google

Plateforme SaaS complète pour booster les avis Google grâce à une **roue de la fortune gamifiée** avec système anti-fraude.

---

## 🚀 Déploiement rapide sur Vercel

### Prérequis
- Node.js 18+
- Compte [Vercel](https://vercel.com) (gratuit)
- mongo db
### 1. Installer les dépendances

```bash
npm install
```
faire commande avec prefix rtk *


```bash
cp .env.example .env.local
```

### 3. Lancer en local

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

### 4. Déployer sur Vercel

```bash
# Option A : CLI Vercel
npm i -g vercel
vercel

# Option B : Git Push
# Connecter le repo GitHub à Vercel, il déploie automatiquement
```

Ajouter les variables d'environnement dans **Vercel > Settings > Environment Variables**.

---

## 📁 Structure du projet

```
riwil-saas/
├── src/
│   ├── app/
│   │   ├── layout.js          # Layout racine (metadata, fonts)
│   │   ├── page.js            # Page principale (dashboard SaaS)
│   │   ├── play/
│   │   │   └── page.js        # Page publique (QR → avis → code → roue)
│   │   └── api/
│   │       ├── codes/
│   │       │   ├── validate/route.js   # POST: valider un code (anti-fraude)
│   │       │   └── generate/route.js   # POST: générer des codes
│   │       └── wheel/
│   │           └── spin/route.js       # POST: spin (sélection pondérée serveur)
│   ├── components/
│   │   ├── AppShell.js         # Layout principal (sidebar + content)
│   │   ├── Sidebar.js          # Navigation latérale desktop
│   │   ├── MobileNav.js        # Navigation mobile (bottom tab)
│   │   ├── Icon.js             # Composant SVG icons
│   │   ├── StatCard.js         # Carte de statistique
│   │   ├── SpinWheel.js        # Roue de la fortune (canvas)
│   │   ├── Confetti.js         # Animation confettis
│   │   └── pages/
│   │       ├── PageDashboard.js
│   │       ├── PageClients.js
│   │       ├── PageCodes.js
│   │       ├── PageWheel.js        # Config 3 étapes
│   │       ├── PageAffiliation.js
│   │       ├── PageSubscription.js
│   │       └── PageAccount.js
│   ├── lib/
│   │   ├── context.js          # React Context (state global)
│   │   └── utils.js            # Utilitaires (génération codes, etc.)
│   └── styles/
│       └── globals.css         # Tailwind + custom styles
├── supabase/
│   └── schema.sql              # Schéma complet de la base de données
├── public/                     # Fichiers statiques
├── package.json
├── tailwind.config.js
├── next.config.js
├── vercel.json
├── jsconfig.json
├── .env.example
└── .gitignore
```

---

## 🎯 Fonctionnalités

### Dashboard SaaS
- **Tableau de bord** : KPIs (scans QR, clics avis, codes utilisés, taux conversion) + graphique recharts
- **Clients** : CRUD entreprises avec stats
- **Ma Roue** : Configuration en 3 étapes (lien avis → personnalisation → récompenses)
- **Codes anti-fraude** : Génération en lot, statut temps réel, export CSV
- **Affiliation** : Lien de parrainage, suivi commissions
- **Abonnement** : Plans Starter / Pro / Enterprise
- **Mon compte** : Profil éditable

### Flow utilisateur final
```
QR Code → Landing page (/play) → Clic "Laisser un avis" → Google
→ Retour → Entrer code unique → Validation serveur → Roue → Gain + Confettis 🎉
```

### Anti-fraude
- Codes uniques XXXX-XXXX (format non devinable)
- 1 code = 1 utilisation (validation côté serveur)
- Sélection pondérée des récompenses côté serveur
- Tracking des utilisations avec dates

---

## 🛠 Stack technique

| Techno | Usage |
|--------|-------|
| **Next.js 14** | Framework React (App Router) |
| **Tailwind CSS** | Styling utilitaire |
| **Recharts** | Graphiques dashboard |
| **Canvas API** | Roue de la fortune animée |
| **Supabase** | Auth + Base de données (production) |
| **Vercel** | Hébergement + Serverless API |

---

## 📝 Notes de production

Pour passer en production complète :

1. **Activer Supabase Auth** dans les API routes
2. **Remplacer le store in-memory** par des requêtes Supabase (les commentaires dans le code montrent comment)
3. **Ajouter un middleware d'auth** pour protéger les routes `/api/codes/generate`
4. **Configurer les webhooks Stripe** pour la gestion des abonnements
5. **Ajouter le QR code dynamique** (bibliothèque `qrcode` ou API externe)

---

Fait avec ❤️ par zReview
