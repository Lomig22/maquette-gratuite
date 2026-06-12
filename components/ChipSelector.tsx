"use client";

import { motion } from "framer-motion";

export type Chip = {
  label: string;
  /** Optional color swatch displayed to the left of the label */
  swatch?: string;
};

type ChipSelectorProps = {
  chips: Chip[];
  onSelect: (label: string) => void;
};

export default function ChipSelector({ chips, onSelect }: ChipSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-wrap gap-2 justify-start w-full"
    >
      {chips.map((chip) => (
        <button
          key={chip.label}
          type="button"
          onClick={() => onSelect(chip.label)}
          className="group flex items-center gap-2 rounded-[12px] border border-[#2A3850] bg-bubble-agent px-4 py-2.5 text-sm text-white transition-colors hover:border-accent hover:bg-accent/10 active:scale-[0.98]"
        >
          {chip.swatch && (
            <span
              className="inline-block h-3.5 w-3.5 rounded-[4px] border border-white/10"
              style={{ backgroundColor: chip.swatch }}
            />
          )}
          {chip.label}
        </button>
      ))}
    </motion.div>
  );
}
