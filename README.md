# Maquette gratuite — Landing page chatbot

Landing page single-page (Next.js 14 + Tailwind CSS) avec un chatbot conversationnel qui qualifie un lead en 5 questions, puis envoie le résultat vers un webhook Make/n8n.

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
| `NEXT_PUBLIC_WEBHOOK_URL` | URL du webhook (Make / n8n) qui reçoit le lead en POST JSON. Si vide, le payload est seulement loggé dans la console. |

### Payload envoyé

```json
{
  "metier": "",
  "ville": "",
  "objectif": "",
  "style": "",
  "nom_entreprise": "",
  "email": "",
  "date": "",
  "source": "lp-maquette"
}
```

## Déploiement Vercel

1. Poussez le repo sur GitHub.
2. Importez-le dans Vercel.
3. Ajoutez la variable `NEXT_PUBLIC_WEBHOOK_URL` dans **Settings → Environment Variables**.
4. Deploy.

## Structure

- `app/page.tsx` — page principale (headline + chatbot + social proof)
- `app/layout.tsx` — layout racine + police Inter
- `app/globals.css` — styles globaux + scrollbar dark
- `components/Chatbot.tsx` — logique complète du chatbot
- `components/ChatBubble.tsx` — bulle agent / utilisateur
- `components/ChipSelector.tsx` — chips cliquables
