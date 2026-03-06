import MotivationalQuote from "@/components/MotivationalQuote";
import LiveClock from "@/components/LiveClock";
import DailyTasks from "@/components/DailyTasks";
import LongTermTasks from "@/components/LongTermTasks";
import FestivalCalendar from "@/components/FestivalCalendar";
import { motion } from "framer-motion";

const Index = () => {
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
          <LiveClock />
        </div>

        {/* Center column */}
        <div className="space-y-6">
          <DailyTasks />
          <LongTermTasks />
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
