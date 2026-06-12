"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ChatBubble from "./ChatBubble";
import ChipSelector, { Chip } from "./ChipSelector";

/* -------------------------------------------------------------------------- */
/*  Types & static content                                                    */
/* -------------------------------------------------------------------------- */

type Message = {
  id: number;
  role: "agent" | "user";
  content: string;
};

type InputMode =
  | "none"
  | "start"
  | "chips-metier"
  | "text-ville"
  | "chips-objectif"
  | "chips-style"
  | "text-nom"
  | "email"
  | "done";

const TYPING_DELAY = 600;

const METIER_CHIPS: Chip[] = [
  { label: "Électricien" },
  { label: "Peintre" },
  { label: "Plombier" },
  { label: "Maçon" },
  { label: "Carreleur" },
  { label: "Plaquiste" },
  { label: "Menuisier" },
  { label: "Couvreur" },
  { label: "Rénovation complète" },
  { label: "Autre" },
];

const OBJECTIF_CHIPS: Chip[] = [
  { label: "Recevoir des appels" },
  { label: "Obtenir des devis" },
  { label: "Rassurer les clients" },
  { label: "Les 3 à la fois" },
];

const STYLE_CHIPS: Chip[] = [
  { label: "Moderne & sombre", swatch: "#2D6BE0" },
  { label: "Épuré & clair", swatch: "#FFFFFF" },
  { label: "Dynamique & coloré", swatch: "#E8611A" },
  { label: "Sobre & professionnel", swatch: "#22A06B" },
];

const AGENT = {
  welcome:
    "Bonjour 👋 Je vais créer une première maquette de site personnalisée pour votre activité — gratuitement.\nOn commence ?",
  metier: "Quel est votre métier ?",
  ville: "Dans quelle ville exercez-vous ?",
  objectif:
    "Qu'est-ce que vous voulez que votre site fasse en priorité ?",
  style: "Quel style vous correspond le mieux ?",
  nom: "Quel est le nom de votre entreprise ?",
  email:
    "Entrez votre email pour recevoir votre maquette en moins de 3h ⚡",
};

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputMode, setInputMode] = useState<InputMode>("none");
  const [draft, setDraft] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Persistent answers (used for personalized messages + webhook payload)
  const answers = useRef({
    metier: "",
    ville: "",
    objectif: "",
    style: "",
    nom_entreprise: "",
    email: "",
  });

  const idCounter = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* ---- helpers ---------------------------------------------------------- */

  const addUser = (content: string) => {
    setMessages((prev) => [
      ...prev,
      { id: idCounter.current++, role: "user", content },
    ]);
  };

  // Push an agent message after a short "typing" delay.
  const say = (content: string) =>
    new Promise<void>((resolve) => {
      setIsTyping(true);
      setInputMode("none");
      window.setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { id: idCounter.current++, role: "agent", content },
        ]);
        setIsTyping(false);
        resolve();
      }, TYPING_DELAY);
    });

  /* ---- mount: welcome message ------------------------------------------ */

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await say(AGENT.welcome);
      if (!cancelled) setInputMode("start");
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---- auto-scroll to bottom ------------------------------------------- */

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isTyping, inputMode]);

  /* ---- auto-focus text/email inputs ------------------------------------ */

  useEffect(() => {
    if (
      (inputMode === "text-ville" ||
        inputMode === "text-nom" ||
        inputMode === "email") &&
      inputRef.current
    ) {
      inputRef.current.focus();
    }
  }, [inputMode]);

  /* ---- flow handlers ---------------------------------------------------- */

  const handleStart = async () => {
    addUser("C'est parti ✦");
    await say(AGENT.metier);
    setInputMode("chips-metier");
  };

  const handleMetier = async (label: string) => {
    answers.current.metier = label;
    addUser(label);
    await say(AGENT.ville);
    setInputMode("text-ville");
  };

  const handleVille = async (value: string) => {
    answers.current.ville = value;
    addUser(value);
    setDraft("");
    await say(AGENT.objectif);
    setInputMode("chips-objectif");
  };

  const handleObjectif = async (label: string) => {
    answers.current.objectif = label;
    addUser(label);
    await say(AGENT.style);
    setInputMode("chips-style");
  };

  const handleStyle = async (label: string) => {
    answers.current.style = label;
    addUser(label);
    await say(AGENT.nom);
    setInputMode("text-nom");
  };

  const handleNom = async (value: string) => {
    answers.current.nom_entreprise = value;
    addUser(value);
    setDraft("");

    const { metier, ville, nom_entreprise } = answers.current;
    await say(
      `Parfait. On prépare la maquette de votre site de ${metier.toLowerCase()} à ${ville} pour ${nom_entreprise}. Il ne reste plus qu'une étape.`
    );
    await say(AGENT.email);
    setInputMode("email");
  };

  const handleEmail = async (value: string) => {
    answers.current.email = value;
    addUser(value);
    setDraft("");
    setSubmitting(true);

    const a = answers.current;
    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

    // Soumission via Web3Forms : un simple POST (formulaire déguisé),
    // les infos collectées par le chatbot arrivent par email. Pas de webhook.
    if (accessKey) {
      try {
        await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            access_key: accessKey,
            subject: `Nouveau lead maquette — ${a.nom_entreprise} (${a.metier})`,
            from_name: "LP Maquette gratuite",
            email: a.email, // utilisé comme reply-to par Web3Forms
            metier: a.metier,
            ville: a.ville,
            objectif: a.objectif,
            style: a.style,
            nom_entreprise: a.nom_entreprise,
            source: "lp-maquette",
            date: new Date().toISOString(),
            botcheck: "", // honeypot anti-spam
          }),
        });
      } catch (err) {
        // Échec silencieux — l'utilisateur reçoit quand même la confirmation.
        console.error("Form submit error:", err);
      }
    } else {
      console.warn("NEXT_PUBLIC_WEB3FORMS_KEY is not set. Data:", a);
    }

    setSubmitting(false);

    await say(
      `✅ C'est bon ${answers.current.nom_entreprise} !\nVotre maquette est en cours de préparation.\nVous la recevrez à ${answers.current.email} dans moins de 3h.\nÀ tout de suite 👋`
    );
    setInputMode("done");
  };

  /* ---- text/email submit ----------------------------------------------- */

  const isValidEmail = (val: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = draft.trim();
    if (!value) return;
    if (inputMode === "text-ville") handleVille(value);
    else if (inputMode === "text-nom") handleNom(value);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(draft) || submitting) return;
    handleEmail(draft.trim());
  };

  /* ---- render ----------------------------------------------------------- */

  return (
    <div className="w-full rounded-[12px] border border-[#1E2A3D] bg-[#121C2E] shadow-xl">
      {/* Messages */}
      <div
        ref={scrollRef}
        className="chat-scroll flex flex-col gap-3 overflow-y-auto px-4 py-5 sm:px-5"
        style={{ height: "min(520px, 65vh)" }}
      >
        {messages.map((msg) => (
          <ChatBubble key={msg.id} role={msg.role}>
            {msg.content}
          </ChatBubble>
        ))}

        {isTyping && <TypingIndicator />}
      </div>

      {/* Input area */}
      <div className="border-t border-[#1E2A3D] px-4 py-4 sm:px-5">
        <AnimatePresence mode="wait">
          {inputMode === "start" && (
            <motion.div
              key="start"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button
                type="button"
                onClick={handleStart}
                className="w-full rounded-[12px] bg-accent px-5 py-3 font-semibold text-white transition-colors hover:bg-[#d4561690] active:scale-[0.99]"
              >
                C&apos;est parti ✦
              </button>
            </motion.div>
          )}

          {inputMode === "chips-metier" && (
            <ChipSelector
              key="metier"
              chips={METIER_CHIPS}
              onSelect={handleMetier}
            />
          )}

          {inputMode === "chips-objectif" && (
            <ChipSelector
              key="objectif"
              chips={OBJECTIF_CHIPS}
              onSelect={handleObjectif}
            />
          )}

          {inputMode === "chips-style" && (
            <ChipSelector
              key="style"
              chips={STYLE_CHIPS}
              onSelect={handleStyle}
            />
          )}

          {(inputMode === "text-ville" || inputMode === "text-nom") && (
            <motion.form
              key={inputMode}
              onSubmit={handleTextSubmit}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={
                  inputMode === "text-ville"
                    ? "Votre ville..."
                    : "Nom de votre entreprise..."
                }
                className="flex-1 rounded-[12px] border border-[#2A3850] bg-background px-4 py-3 text-[15px] text-white placeholder:text-secondary outline-none focus:border-accent"
              />
              <button
                type="submit"
                disabled={!draft.trim()}
                className="rounded-[12px] bg-accent px-5 py-3 font-semibold text-white transition-colors hover:bg-[#d4561690] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Valider
              </button>
            </motion.form>
          )}

          {inputMode === "email" && (
            <motion.form
              key="email"
              onSubmit={handleEmailSubmit}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-2 sm:flex-row"
            >
              <input
                ref={inputRef}
                type="email"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="vous@exemple.com"
                className="flex-1 rounded-[12px] border border-[#2A3850] bg-background px-4 py-3 text-[15px] text-white placeholder:text-secondary outline-none focus:border-accent"
              />
              <button
                type="submit"
                disabled={!isValidEmail(draft) || submitting}
                className="rounded-[12px] bg-accent px-5 py-3 font-semibold text-white transition-colors hover:bg-[#d4561690] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {submitting
                  ? "Envoi..."
                  : "Recevoir ma maquette gratuitement →"}
              </button>
            </motion.form>
          )}

          {(inputMode === "none" || inputMode === "done") && (
            <motion.p
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-sm text-secondary"
            >
              {inputMode === "done"
                ? "Merci ! 🎉"
                : "..."}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Typing indicator                                                          */
/* -------------------------------------------------------------------------- */

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex justify-start"
    >
      <div className="flex items-center gap-1.5 rounded-[12px] rounded-bl-sm bg-bubble-agent px-4 py-3.5">
        <span className="typing-dot h-2 w-2 rounded-full bg-secondary" />
        <span className="typing-dot h-2 w-2 rounded-full bg-secondary" />
        <span className="typing-dot h-2 w-2 rounded-full bg-secondary" />
      </div>
    </motion.div>
  );
}
