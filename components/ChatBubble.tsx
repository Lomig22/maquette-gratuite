"use client";

import { motion } from "framer-motion";

type ChatBubbleProps = {
  role: "agent" | "user";
  children: React.ReactNode;
};

export default function ChatBubble({ role, children }: ChatBubbleProps) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[85%] rounded-[12px] px-4 py-3 text-[15px] leading-relaxed whitespace-pre-line ${
          isUser
            ? "bg-accent text-white rounded-br-sm"
            : "bg-bubble-agent text-white rounded-bl-sm"
        }`}
      >
        {children}
      </div>
    </motion.div>
  );
}
