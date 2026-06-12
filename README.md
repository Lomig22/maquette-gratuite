# Maquette gratuite — Landing page chatbot

Landing page single-page (Next.js 14 + Tailwind CSS) avec un chatbot conversationnel qui qualifie un lead en 5 questions. C'est en réalité un formulaire de contact déguisé : à la fin, les infos sont soumises via [Web3Forms](https://web3forms.com) et arrivent directement par email. Aucun backend, aucun webhook, aucune base de données.

## Lancer en local

```bash
npm install
cp .env.local.example .env.local   # puis renseignez NEXT_PUBLIC_WEBHOOK_URL
npm run dev
```

Ouvrez http://localhost:3000

## Variable d'environnement

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_WEB3FORMS_KEY` | Clé d'accès Web3Forms. Crée un formulaire gratuit sur [web3forms.com](https://web3forms.com) avec ton email, copie la clé. C'est elle qui reçoit les leads par email. Si vide, les données sont seulement loggées dans la console. |

### Données envoyées à Web3Forms

```json
{
  "access_key": "...",
  "subject": "Nouveau lead maquette — <entreprise> (<métier>)",
  "email": "<email du prospect, utilisé comme reply-to>",
  "metier": "",
  "ville": "",
  "objectif": "",
  "style": "",
  "nom_entreprise": "",
  "source": "lp-maquette",
  "date": "<ISO>"
}
```

## Déploiement Vercel

1. Poussez le repo sur GitHub.
2. Importez-le dans Vercel.
3. Ajoutez la variable `NEXT_PUBLIC_WEB3FORMS_KEY` dans **Settings → Environment Variables**.
4. Deploy.

## Structure

- `app/page.tsx` — page principale (headline + chatbot + social proof)
- `app/layout.tsx` — layout racine + police Inter
- `app/globals.css` — styles globaux + scrollbar dark
- `components/Chatbot.tsx` — logique complète du chatbot
- `components/ChatBubble.tsx` — bulle agent / utilisateur
- `components/ChipSelector.tsx` — chips cliquables
