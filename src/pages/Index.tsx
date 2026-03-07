import { useState } from "react";
import MotivationalQuote from "@/components/MotivationalQuote";
import LiveClock from "@/components/LiveClock";
import DailyTasks, { type DailyTask } from "@/components/DailyTasks";
import LongTermTasks, { type LongTask } from "@/components/LongTermTasks";
import DailyChecklist, { type ChecklistItem } from "@/components/DailyChecklist";
import FestivalCalendar from "@/components/FestivalCalendar";
import GoalStats from "@/components/GoalStats";
import CountdownTimer from "@/components/CountdownTimer";
import { motion } from "framer-motion";

const Index = () => {
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([]);
  const [longTasks, setLongTasks] = useState<LongTask[]>([]);
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-foreground glow-text">
          Productivity <span className="text-primary">Hub</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Stay focused. Stay inspired.</p>
      </motion.header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="space-y-6">
          <MotivationalQuote />
          <GoalStats
            dailyTotal={dailyTasks.length}
            dailyDone={dailyTasks.filter(t => t.done).length}
            longTotal={longTasks.length}
            longDone={longTasks.filter(t => t.done).length}
          />
          <LiveClock />
          <CountdownTimer />
        </div>

        {/* Center column */}
        <div className="space-y-6">
          <DailyTasks tasks={dailyTasks} setTasks={setDailyTasks} />
          <LongTermTasks tasks={longTasks} setTasks={setLongTasks} />
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <FestivalCalendar />
        </div>
      </div>
    </div>
  );
};

export default Index;
