import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, CheckSquare, Square, CalendarDays, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
  date: string;
}

interface DailyChecklistProps {
  items: ChecklistItem[];
  setItems: React.Dispatch<React.SetStateAction<ChecklistItem[]>>;
}

const DailyChecklist = ({ items, setItems }: DailyChecklistProps) => {
  const [input, setInput] = useState("");
  const [justCompleted, setJustCompleted] = useState<string | null>(null);

  const addItem = () => {
    if (!input.trim()) return;
    setItems(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        text: input.trim(),
        done: false,
        date: format(new Date(), "yyyy-MM-dd"),
      },
    ]);
    setInput("");
  };

  const toggleItem = (id: string) => {
    setItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          if (!item.done) {
            setJustCompleted(id);
            setTimeout(() => setJustCompleted(null), 2000);
          }
          return { ...item, done: !item.done };
        }
        return item;
      })
    );
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const doneCount = items.filter(i => i.done).length;
  const percent = items.length > 0 ? Math.round((doneCount / items.length) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="glass rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs uppercase tracking-[0.2em] text-primary font-medium flex items-center gap-2">
          <CheckSquare className="w-4 h-4" /> Daily Checklist
        </p>
        <span className="text-xs font-mono text-muted-foreground">
          {doneCount}/{items.length}
        </span>
      </div>

      {/* Progress bar */}
      {items.length > 0 && (
        <div className="h-2 bg-secondary rounded-full overflow-hidden mb-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`h-full rounded-full ${
              percent === 100
                ? "bg-gradient-to-r from-celebrate-1 via-celebrate-2 to-celebrate-5"
                : percent >= 50
                ? "bg-gradient-to-r from-celebrate-3 to-celebrate-5"
                : "bg-gradient-to-r from-celebrate-4 to-primary"
            }`}
          />
        </div>
      )}

      {/* Add item */}
      <div className="flex gap-2 mb-4">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addItem()}
          placeholder="Add a checklist item..."
          className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
        />
        <Button onClick={addItem} size="icon" className="shrink-0">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Items */}
      <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
        <AnimatePresence>
          {items.map(item => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`flex items-center gap-3 rounded-lg p-3 group border transition-all duration-300 ${
                justCompleted === item.id
                  ? "glow-celebrate border-celebrate-3/50 bg-celebrate-3/10"
                  : item.done
                  ? "bg-success/5 border-success/20"
                  : "bg-secondary/50 border-border"
              }`}
            >
              <button onClick={() => toggleItem(item.id)} className="shrink-0 relative">
                {item.done ? (
                  <CheckSquare className="w-5 h-5 text-success" />
                ) : (
                  <Square className="w-5 h-5 text-muted-foreground" />
                )}
                {justCompleted === item.id && (
                  <motion.div
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <PartyPopper className="w-5 h-5 text-celebrate-4" />
                  </motion.div>
                )}
              </button>

              <div className="flex-1 min-w-0">
                <span
                  className={`text-sm block ${
                    item.done ? "line-through text-muted-foreground" : "text-foreground"
                  }`}
                >
                  {item.text}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <CalendarDays className="w-3 h-3" />
                  {format(new Date(item.date), "dd MMM yyyy")}
                </span>
              </div>

              <button
                onClick={() => removeItem(item.id)}
                className="p-1 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No checklist items yet. Add one above!
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default DailyChecklist;
