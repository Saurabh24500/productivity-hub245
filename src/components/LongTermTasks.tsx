import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, CheckCircle2, Circle, Calendar, Link2, FileText, ChevronUp, ChevronDown, PartyPopper, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Attachment {
  type: "link" | "file";
  name: string;
  url: string;
}

export interface LongTask {
  id: string;
  title: string;
  description: string;
  done: boolean;
  deadline?: Date;
  attachments: Attachment[];
  category: "personal" | "career" | "financial" | "creative";
}

const CATEGORIES = [
  { value: "personal", label: "Personal", color: "text-celebrate-2", bg: "bg-celebrate-2/10 border-celebrate-2/20" },
  { value: "career", label: "Career", color: "text-celebrate-5", bg: "bg-celebrate-5/10 border-celebrate-5/20" },
  { value: "financial", label: "Financial", color: "text-celebrate-3", bg: "bg-celebrate-3/10 border-celebrate-3/20" },
  { value: "creative", label: "Creative", color: "text-celebrate-4", bg: "bg-celebrate-4/10 border-celebrate-4/20" },
] as const;

interface LongTermTasksProps {
  tasks: LongTask[];
  setTasks: React.Dispatch<React.SetStateAction<LongTask[]>>;
}

const LongTermTasks = ({ tasks, setTasks }: LongTermTasksProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState<Date>();
  const [linkInput, setLinkInput] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [category, setCategory] = useState<LongTask["category"]>("personal");
  const [justCompleted, setJustCompleted] = useState<string | null>(null);

  const addLink = () => {
    if (!linkInput.trim()) return;
    setAttachments(prev => [...prev, { type: "link", name: linkInput, url: linkInput }]);
    setLinkInput("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      const url = URL.createObjectURL(file);
      setAttachments(prev => [...prev, { type: "file", name: file.name, url }]);
    });
  };

  const addTask = () => {
    if (!title.trim()) return;
    setTasks(prev => [...prev, {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      done: false,
      deadline,
      attachments: [...attachments],
      category,
    }]);
    setTitle("");
    setDescription("");
    setDeadline(undefined);
    setAttachments([]);
    setCategory("personal");
    setOpen(false);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        if (!t.done) {
          setJustCompleted(id);
          setTimeout(() => setJustCompleted(null), 2000);
        }
        return { ...t, done: !t.done };
      }
      return t;
    }));
  };

  const removeTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const moveTask = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= tasks.length) return;
    const updated = [...tasks];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setTasks(updated);
  };

  const getCatData = (cat: string) => CATEGORIES.find(c => c.value === cat);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs uppercase tracking-[0.2em] text-primary font-medium">
          Long-Term Goals
        </p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="gap-1 text-xs">
              <Plus className="w-3 h-3" /> Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-foreground">New Long-Term Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 mt-2">
              <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Goal title"
                className="bg-secondary border-border text-foreground" />
              <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description..."
                className="bg-secondary border-border text-foreground resize-none" rows={3} />

              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Category</label>
                <Select value={category} onValueChange={(v) => setCategory(v as LongTask["category"])}>
                  <SelectTrigger className="bg-secondary border-border text-foreground">
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
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Deadline</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left", !deadline && "text-muted-foreground")}>
                      <Calendar className="w-4 h-4 mr-2" />
                      {deadline ? format(deadline, "PPP") : "Select deadline"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarPicker mode="single" selected={deadline} onSelect={setDeadline} initialFocus
                      className={cn("p-3 pointer-events-auto")} />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Add Link</label>
                <div className="flex gap-2">
                  <Input value={linkInput} onChange={e => setLinkInput(e.target.value)} placeholder="https://..."
                    className="bg-secondary border-border text-foreground" />
                  <Button onClick={addLink} size="icon" variant="outline"><Link2 className="w-4 h-4" /></Button>
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Attach Files</label>
                <Input type="file" multiple accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                  onChange={handleFileUpload} className="bg-secondary border-border text-foreground" />
              </div>

              {attachments.length > 0 && (
                <div className="space-y-1">
                  {attachments.map((a, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary rounded p-2">
                      {a.type === "link" ? <Link2 className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                      <span className="truncate flex-1">{a.name}</span>
                      <button onClick={() => setAttachments(prev => prev.filter((_, j) => j !== i))} className="text-destructive">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <Button onClick={addTask} className="w-full">Create Goal</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2 max-h-80 overflow-y-auto scrollbar-thin">
        <AnimatePresence>
          {tasks.map((task, i) => {
            const catData = getCatData(task.category);
            return (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`rounded-lg p-3 group border transition-all duration-300 ${
                  justCompleted === task.id
                    ? "glow-celebrate border-celebrate-3/50 bg-celebrate-3/10"
                    : task.done
                    ? "bg-success/5 border-success/20"
                    : catData?.bg || "bg-secondary border-border"
                }`}
              >
                <div className="flex items-start gap-2">
                  <button onClick={() => toggleTask(task.id)} className="shrink-0 mt-0.5 relative">
                    {task.done ? (
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    ) : (
                      <Circle className={`w-5 h-5 ${catData?.color || "text-muted-foreground"}`} />
                    )}
                    {justCompleted === task.id && (
                      <motion.div
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{ scale: 2.5, opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <PartyPopper className="w-6 h-6 text-celebrate-4" />
                      </motion.div>
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${task.done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                      {task.title}
                    </p>
                    <span className={`text-xs ${catData?.color} opacity-60`}>{catData?.label}</span>
                    {task.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {task.deadline && (
                        <span className="text-xs bg-muted px-2 py-0.5 rounded text-warning flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {format(task.deadline, "dd MMM yyyy")}
                        </span>
                      )}
                      {task.attachments.map((a, j) => (
                        <a key={j} href={a.url} target="_blank" rel="noopener noreferrer"
                          className="text-xs bg-muted px-2 py-0.5 rounded text-primary hover:underline flex items-center gap-1">
                          {a.type === "link" ? <Link2 className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                          {a.name.length > 20 ? a.name.slice(0, 20) + "..." : a.name}
                        </a>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {tasks.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">No goals yet. Plan something big!</p>
        )}
      </div>
    </motion.div>
  );
};

export default LongTermTasks;
