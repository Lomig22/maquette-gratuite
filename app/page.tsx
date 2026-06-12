import Chatbot from "@/components/Chatbot";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-background flex flex-col items-center px-4 py-10 sm:py-16">
      <div className="w-full max-w-[680px] flex flex-col items-center">
        {/* Headline */}
        <header className="text-center mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-4xl font-bold leading-tight text-white">
            Voyez votre futur site avant de payer quoi que ce soit.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-secondary max-w-[560px] mx-auto">
            Répondez à 5 questions. Recevez votre maquette personnalisée en
            moins de 3h — gratuitement.
          </p>
        </header>

        {/* Chatbot */}
        <Chatbot />

        {/* Micro social proof */}
        <p className="mt-6 text-center text-sm text-secondary max-w-[560px] leading-relaxed">
          <span className="text-accent tracking-wide">★★★★★</span>{" "}
          <span className="text-white">·</span> “J’ai reçu ma maquette en 2h. Je
          l’ai montrée à mon client, il a signé direct.” — Jérôme M., Peintre
        </p>
      </div>
    </main>
  );
}
