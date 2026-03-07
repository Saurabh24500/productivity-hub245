import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, CheckSquare, Square, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
  date: string;
  completedDates: string[]; // dates when checked
}

interface DailyChecklistProps {
  items: ChecklistItem[];
  setItems: React.Dispatch<React.SetStateAction<ChecklistItem[]>>;
}

const DailyChecklist = ({ items, setItems }: DailyChecklistProps) => {
  const [input, setInput] = useState("");
  const [justCompleted, setJustCompleted] = useState<string | null>(null);

  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const addItem = () => {
    if (!input.trim()) return;
    setItems(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        text: input.trim(),
        done: false,
        date: format(new Date(), "yyyy-MM-dd"),
        completedDates: [],
      },
    ]);
    setInput("");
  };

  const toggleDay = (itemId: string, day: Date) => {
    const dateStr = format(day, "yyyy-MM-dd");
    setItems(prev =>
      prev.map(item => {
        if (item.id !== itemId) return item;
        const has = item.completedDates.includes(dateStr);
        const completedDates = has
          ? item.completedDates.filter(d => d !== dateStr)
          : [...item.completedDates, dateStr];

        if (!has) {
          setJustCompleted(`${itemId}-${dateStr}`);
          setTimeout(() => setJustCompleted(null), 1500);
        }

        return {
          ...item,
          completedDates,
          done: completedDates.length === 7,
        };
      })
    );
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const totalChecks = items.length * 7;
  const doneChecks = items.reduce((sum, i) => sum + i.completedDates.length, 0);
  const percent = totalChecks > 0 ? Math.round((doneChecks / totalChecks) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="glass rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs uppercase tracking-[0.2em] text-primary font-medium flex items-center gap-2">
          <CheckSquare className="w-4 h-4" /> Weekly Checklist
        </p>
        <span className="text-xs font-mono text-muted-foreground">
          {doneChecks}/{totalChecks}
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
          placeholder="Add a daily habit..."
          className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
        />
        <Button onClick={addItem} size="icon" className="shrink-0">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Week header */}
      {items.length > 0 && (
        <div className="grid grid-cols-[1fr_repeat(7,minmax(0,1fr))_auto] gap-1 mb-2 items-center">
          <span className="text-xs text-muted-foreground font-medium">Habit</span>
          {weekDays.map(day => (
            <div key={day.toISOString()} className="text-center">
              <span className="text-[10px] text-muted-foreground block">{format(day, "EEE")}</span>
              <span
                className={`text-xs font-mono block ${
                  isSameDay(day, today) ? "text-primary font-bold" : "text-muted-foreground"
                }`}
              >
                {format(day, "dd")}
              </span>
            </div>
          ))}
          <span className="w-6" />
        </div>
      )}

      {/* Items */}
      <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
        <AnimatePresence>
          {items.map(item => {
            const itemDone = item.completedDates.length;
            const itemPercent = Math.round((itemDone / 7) * 100);
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`grid grid-cols-[1fr_repeat(7,minmax(0,1fr))_auto] gap-1 items-center rounded-lg p-2 group border transition-all duration-300 ${
                  itemPercent === 100
                    ? "bg-success/5 border-success/20 glow-success"
                    : "bg-secondary/50 border-border"
                }`}
              >
                <div className="min-w-0 pr-1">
                  <span className="text-xs text-foreground block truncate">{item.text}</span>
                  <span className="text-[10px] text-muted-foreground">{itemDone}/7</span>
                </div>

                {weekDays.map(day => {
                  const dateStr = format(day, "yyyy-MM-dd");
                  const checked = item.completedDates.includes(dateStr);
                  const key = `${item.id}-${dateStr}`;
                  return (
                    <button
                      key={dateStr}
                      onClick={() => toggleDay(item.id, day)}
                      className="flex items-center justify-center relative"
                    >
                      {checked ? (
                        <CheckSquare className="w-5 h-5 text-success" />
                      ) : (
                        <Square
                          className={`w-5 h-5 ${
                            isSameDay(day, today)
                              ? "text-primary/60"
                              : "text-muted-foreground/40"
                          }`}
                        />
                      )}
                      {justCompleted === key && (
                        <motion.div
                          initial={{ scale: 0, opacity: 1 }}
                          animate={{ scale: 2, opacity: 0 }}
                          transition={{ duration: 0.6 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <PartyPopper className="w-4 h-4 text-celebrate-4" />
                        </motion.div>
                      )}
                    </button>
                  );
                })}

                <button
                  onClick={() => removeItem(item.id)}
                  className="p-1 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No habits yet. Add one above!
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default DailyChecklist;
