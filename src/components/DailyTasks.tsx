import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ChevronUp, ChevronDown, Trash2, CheckCircle2, Circle, PartyPopper, Tag, Bell, BellOff, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export interface DailyTask {
  id: string;
  text: string;
  done: boolean;
  category: "personal" | "work" | "health" | "learning";
  reminderTime?: string; // HH:mm format
  reminderFired?: boolean;
}

interface DailyTasksProps {
  tasks: DailyTask[];
  setTasks: React.Dispatch<React.SetStateAction<DailyTask[]>>;
}

const CATEGORIES = [
  { value: "personal", label: "Personal", color: "text-celebrate-2" },
  { value: "work", label: "Work", color: "text-celebrate-5" },
  { value: "health", label: "Health", color: "text-celebrate-3" },
  { value: "learning", label: "Learning", color: "text-celebrate-4" },
] as const;

const getCategoryColor = (cat: string) => {
  return CATEGORIES.find(c => c.value === cat)?.color || "text-muted-foreground";
};

const getCategoryBg = (cat: string) => {
  switch (cat) {
    case "personal": return "bg-celebrate-2/10 border-celebrate-2/20";
    case "work": return "bg-celebrate-5/10 border-celebrate-5/20";
    case "health": return "bg-celebrate-3/10 border-celebrate-3/20";
    case "learning": return "bg-celebrate-4/10 border-celebrate-4/20";
    default: return "bg-secondary";
  }
};

// Simple beep using Web Audio API
const playAlarmSound = () => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const playBeep = (freq: number, startTime: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };
    // 3 beeps
    playBeep(880, ctx.currentTime, 0.15);
    playBeep(880, ctx.currentTime + 0.2, 0.15);
    playBeep(1100, ctx.currentTime + 0.4, 0.3);
  } catch (e) {
    console.warn("Audio not supported");
  }
};

const sendNotification = (taskText: string) => {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("⏰ Task Reminder", {
      body: taskText,
      icon: "/favicon.ico",
    });
  }
};

const DailyTasks = ({ tasks, setTasks }: DailyTasksProps) => {
  const [input, setInput] = useState("");
  const [category, setCategory] = useState<DailyTask["category"]>("personal");
  const [reminderTime, setReminderTime] = useState("");
  const [justCompleted, setJustCompleted] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Request notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Check reminders every 30 seconds
  const checkReminders = useCallback(() => {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    setTasks(prev =>
      prev.map(t => {
        if (t.reminderTime && !t.reminderFired && !t.done && t.reminderTime === currentTime) {
          playAlarmSound();
          sendNotification(t.text);
          toast(`⏰ Reminder: ${t.text}`, { duration: 10000 });
          return { ...t, reminderFired: true };
        }
        return t;
      })
    );
  }, [setTasks]);

  useEffect(() => {
    intervalRef.current = setInterval(checkReminders, 30000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [checkReminders]);

  const addTask = () => {
    if (!input.trim()) return;
    setTasks(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        text: input.trim(),
        done: false,
        category,
        reminderTime: reminderTime || undefined,
        reminderFired: false,
      },
    ]);
    setInput("");
    setReminderTime("");
    if (reminderTime) {
      toast.success(`Alarm set for ${reminderTime}`);
    }
  };

  const toggleTask = (id: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === id) {
          if (!t.done) {
            setJustCompleted(id);
            setTimeout(() => setJustCompleted(null), 2000);
          }
          return { ...t, done: !t.done };
        }
        return t;
      })
    );
  };

  const removeTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const toggleReminder = (id: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === id) {
          if (t.reminderTime) {
            return { ...t, reminderTime: undefined, reminderFired: false };
          }
          // If no reminder, prompt won't work nicely — skip for now
          return t;
        }
        return t;
      })
    );
  };

  const moveTask = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= tasks.length) return;
    const updated = [...tasks];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setTasks(updated);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass rounded-2xl p-6"
    >
      <p className="text-xs uppercase tracking-[0.2em] text-primary mb-4 font-medium">
        Daily Tasks
      </p>

      <div className="flex gap-2 mb-2">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addTask()}
          placeholder="Add a task..."
          className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
        />
        <Button onClick={addTask} size="icon" className="shrink-0">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex gap-2 mb-4">
        <Select value={category} onValueChange={(v) => setCategory(v as DailyTask["category"])}>
          <SelectTrigger className="bg-secondary border-border text-foreground h-8 text-xs">
            <Tag className="w-3 h-3 mr-1" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            {CATEGORIES.map(c => (
              <SelectItem key={c.value} value={c.value}>
                <span className={c.color}>{c.label}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="relative flex items-center">
          <Clock className="w-3 h-3 text-muted-foreground absolute left-2 pointer-events-none" />
          <input
            type="time"
            value={reminderTime}
            onChange={e => setReminderTime(e.target.value)}
            className="bg-secondary border border-border rounded-md h-8 text-xs text-foreground pl-7 pr-2 focus:outline-none focus:ring-1 focus:ring-primary"
            title="Set alarm time"
          />
        </div>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
        <AnimatePresence>
          {tasks.map((task, i) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`flex items-center gap-2 rounded-lg p-3 group border transition-all duration-300 ${
                justCompleted === task.id
                  ? "glow-celebrate border-celebrate-3/50 bg-celebrate-3/10"
                  : task.done
                  ? "bg-success/5 border-success/20"
                  : getCategoryBg(task.category)
              }`}
            >
              <button onClick={() => toggleTask(task.id)} className="shrink-0 relative">
                {task.done ? (
                  <CheckCircle2 className="w-5 h-5 text-success" />
                ) : (
                  <Circle className={`w-5 h-5 ${getCategoryColor(task.category)}`} />
                )}
                {justCompleted === task.id && (
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
                <span className={`text-sm ${task.done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                  {task.text}
                </span>
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${getCategoryColor(task.category)} opacity-60`}>
                    {CATEGORIES.find(c => c.value === task.category)?.label}
                  </span>
                  {task.reminderTime && (
                    <span className={`text-[10px] flex items-center gap-0.5 ${task.reminderFired ? "text-celebrate-1" : "text-muted-foreground"}`}>
                      <Bell className="w-3 h-3" /> {task.reminderTime}
                      {task.reminderFired && " ✓"}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {task.reminderTime && (
                  <button onClick={() => toggleReminder(task.id)}
                    className="p-1 text-muted-foreground hover:text-destructive" title="Remove alarm">
                    <BellOff className="w-4 h-4" />
                  </button>
                )}
                <button onClick={() => moveTask(i, "up")} disabled={i === 0}
                  className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30">
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button onClick={() => moveTask(i, "down")} disabled={i === tasks.length - 1}
                  className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30">
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button onClick={() => removeTask(task.id)}
                  className="p-1 text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {tasks.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">No tasks yet. Add one above!</p>
        )}
      </div>
    </motion.div>
  );
};

export default DailyTasks;
