import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Calendar as CalIcon } from "lucide-react";
import { indianFestivals2026, isWeekend } from "@/data/indianFestivals";
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

interface UserEvent {
  date: string;
  title: string;
  description: string;
}

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const FestivalCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [events, setEvents] = useState<UserEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDesc, setEventDesc] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  const getDateKey = (day: number) =>
    `${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  const getFestival = (day: number) =>
    indianFestivals2026.find(f => f.date === getDateKey(day));

  const getEvents = (day: number) =>
    events.filter(e => e.date === `${currentYear}-${getDateKey(day)}`);

  const addEvent = () => {
    if (!eventTitle.trim() || !selectedDate) return;
    setEvents(prev => [...prev, { date: selectedDate, title: eventTitle.trim(), description: eventDesc.trim() }]);
    setEventTitle("");
    setEventDesc("");
    setDialogOpen(false);
  };

  const handleDayClick = (day: number) => {
    setSelectedDate(`${currentYear}-${getDateKey(day)}`);
    setDialogOpen(true);
  };

  const today = new Date();
  const isToday = (day: number) =>
    today.getDate() === day && today.getMonth() === currentMonth && today.getFullYear() === currentYear;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs uppercase tracking-[0.2em] text-primary font-medium">
          Festival Calendar
        </p>
        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost" onClick={prevMonth} className="h-7 w-7">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-semibold text-foreground min-w-[130px] text-center">
            {MONTHS[currentMonth]} {currentYear}
          </span>
          <Button size="icon" variant="ghost" onClick={nextMonth} className="h-7 w-7">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => (
          <div key={d} className="text-center text-xs text-muted-foreground py-1 font-medium">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const date = new Date(currentYear, currentMonth, day);
          const weekend = isWeekend(date);
          const festival = getFestival(day);
          const dayEvents = getEvents(day);

          return (
            <button
              key={day}
              onClick={() => handleDayClick(day)}
              className={`relative aspect-square rounded-lg text-xs flex flex-col items-center justify-center gap-0.5 transition-all hover:ring-1 hover:ring-primary/50 ${
                isToday(day) ? "bg-primary text-primary-foreground font-bold" :
                festival ? "bg-festival/20 text-festival-foreground" :
                weekend ? "bg-weekend/10 text-weekend" :
                "text-foreground hover:bg-secondary"
              }`}
            >
              <span>{day}</span>
              {festival && <Star className="w-2.5 h-2.5 text-festival" />}
              {dayEvents.length > 0 && (
                <div className="w-1.5 h-1.5 rounded-full bg-primary absolute bottom-1" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary" /> Today</span>
        <span className="flex items-center gap-1"><Star className="w-3 h-3 text-festival" /> Festival</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-weekend" /> Weekend</span>
      </div>

      {/* Festivals this month */}
      {indianFestivals2026.filter(f => f.date.startsWith(String(currentMonth + 1).padStart(2, '0'))).length > 0 && (
        <div className="mt-4 space-y-1">
          <p className="text-xs text-muted-foreground font-medium mb-2">Festivals this month:</p>
          {indianFestivals2026
            .filter(f => f.date.startsWith(String(currentMonth + 1).padStart(2, '0')))
            .map((f, i) => (
              <div key={i} className="flex flex-col gap-0.5 text-xs bg-secondary rounded px-2 py-1.5">
                <div className="flex items-center gap-2">
                  <Star className="w-3 h-3 text-festival shrink-0" />
                  <span className="text-foreground">{f.nameGu}</span>
                  <span className="text-muted-foreground ml-auto">{f.date.split('-')[1]}</span>
                </div>
                <span className="text-muted-foreground pl-5 text-[10px]">{f.name}</span>
                {f.description && (
                  <span className="text-muted-foreground/70 pl-5 text-[10px] italic">{f.description}</span>
                )}
              </div>
            ))}
        </div>
      )}

      {/* Events for selected date */}
      {selectedDate && getEvents(parseInt(selectedDate.split('-')[2])).length > 0 && (
        <div className="mt-3 space-y-1">
          <p className="text-xs text-muted-foreground font-medium">Events:</p>
          {events.filter(e => e.date === selectedDate).map((e, i) => (
            <div key={i} className="text-xs bg-secondary rounded px-2 py-1.5">
              <p className="text-foreground font-medium">{e.title}</p>
              {e.description && <p className="text-muted-foreground">{e.description}</p>}
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <CalIcon className="w-4 h-4 text-primary" />
              Add Event — {selectedDate}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <Input
              value={eventTitle}
              onChange={e => setEventTitle(e.target.value)}
              placeholder="Event title"
              className="bg-secondary border-border text-foreground"
            />
            <Textarea
              value={eventDesc}
              onChange={e => setEventDesc(e.target.value)}
              placeholder="Description (optional)"
              className="bg-secondary border-border text-foreground resize-none"
              rows={2}
            />
            <Button onClick={addEvent} className="w-full">Add Event</Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default FestivalCalendar;
