import { motion } from "framer-motion";
import { getDailyQuote } from "@/data/quotes";
import { Sparkles } from "lucide-react";

const MotivationalQuote = () => {
  const quote = getDailyQuote();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="glass rounded-2xl p-6 glow-amber relative overflow-hidden"
    >
      <div className="absolute top-3 right-3">
        <Sparkles className="w-5 h-5 text-primary opacity-60" />
      </div>
      <p className="text-xs uppercase tracking-[0.2em] text-primary mb-3 font-medium">
        Today's Thought
      </p>
      <blockquote className="text-lg md:text-xl font-light leading-relaxed text-foreground glow-text">
        "{quote.text}"
      </blockquote>
      <p className="mt-3 text-sm text-muted-foreground">— {quote.author}</p>
    </motion.div>
  );
};

export default MotivationalQuote;
