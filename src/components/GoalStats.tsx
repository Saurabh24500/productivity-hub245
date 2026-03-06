import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Target, Flame, TrendingUp } from "lucide-react";

interface GoalStatsProps {
  dailyTotal: number;
  dailyDone: number;
  longTotal: number;
  longDone: number;
}

const GoalStats = ({ dailyTotal, dailyDone, longTotal, longDone }: GoalStatsProps) => {
  const overallTotal = dailyTotal + longTotal;
  const overallDone = dailyDone + longDone;
  const overallPercent = overallTotal > 0 ? Math.round((overallDone / overallTotal) * 100) : 0;
  const dailyPercent = dailyTotal > 0 ? Math.round((dailyDone / dailyTotal) * 100) : 0;
  const longPercent = longTotal > 0 ? Math.round((longDone / longTotal) * 100) : 0;

  const getVibeColor = (percent: number) => {
    if (percent === 100) return "from-celebrate-1 via-celebrate-2 to-celebrate-5";
    if (percent >= 75) return "from-celebrate-3 to-celebrate-5";
    if (percent >= 50) return "from-celebrate-4 to-celebrate-1";
    if (percent >= 25) return "from-celebrate-4 to-warning";
    return "from-muted-foreground to-muted";
  };

  const getGlow = (percent: number) => {
    if (percent === 100) return "glow-celebrate";
    if (percent >= 50) return "glow-success";
    return "";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className={`glass rounded-2xl p-6 transition-all duration-700 ${getGlow(overallPercent)} ${
        overallPercent === 100 ? "animate-[celebrate-pulse_2s_ease-in-out_infinite]" : ""
      }`}
      style={overallPercent === 100 ? { animation: "rainbow-border 3s linear infinite", borderWidth: "2px" } : {}}
    >
      <div className="flex items-center gap-2 mb-4">
        <Trophy className={`w-5 h-5 ${overallPercent === 100 ? "text-celebrate-4" : "text-primary"}`} />
        <p className="text-xs uppercase tracking-[0.2em] text-primary font-medium">
          Goal Progress
        </p>
        {overallPercent === 100 && overallTotal > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="ml-auto text-xs font-bold text-celebrate-4 bg-celebrate-4/10 px-2 py-0.5 rounded-full"
          >
            🎉 ALL DONE!
          </motion.span>
        )}
      </div>

      {/* Overall Progress */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-foreground flex items-center gap-1.5">
            <Target className="w-4 h-4 text-celebrate-2" /> Overall
          </span>
          <span className={`text-sm font-bold font-mono bg-gradient-to-r ${getVibeColor(overallPercent)} bg-clip-text text-transparent`}>
            {overallPercent}%
          </span>
        </div>
        <div className="h-3 bg-secondary rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${overallPercent}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full rounded-full bg-gradient-to-r ${getVibeColor(overallPercent)}`}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">{overallDone}/{overallTotal} goals completed</p>
      </div>

      {/* Daily & Long-term side by side */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={<Flame className="w-4 h-4 text-celebrate-1" />}
          label="Daily"
          done={dailyDone}
          total={dailyTotal}
          percent={dailyPercent}
          color={getVibeColor(dailyPercent)}
        />
        <StatCard
          icon={<TrendingUp className="w-4 h-4 text-celebrate-5" />}
          label="Long-Term"
          done={longDone}
          total={longTotal}
          percent={longPercent}
          color={getVibeColor(longPercent)}
        />
      </div>

      {/* Celebration confetti */}
      <AnimatePresence>
        {overallPercent === 100 && overallTotal > 0 && (
          <div className="relative h-0 overflow-visible">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: 0, x: 0, opacity: 1, scale: 1 }}
                animate={{
                  y: [0, -60 - Math.random() * 40],
                  x: [(i - 4) * 20, (i - 4) * 30 + (Math.random() - 0.5) * 40],
                  opacity: [1, 0],
                  scale: [1, 0.5],
                  rotate: [0, Math.random() * 360],
                }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2, delay: i * 0.1 }}
                className="absolute bottom-4 left-1/2 w-2 h-2 rounded-full"
                style={{
                  backgroundColor: `hsl(${[340, 262, 173, 38, 200][i % 5]} ${80}% ${55}%)`,
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const StatCard = ({
  icon,
  label,
  done,
  total,
  percent,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  done: number;
  total: number;
  percent: number;
  color: string;
}) => (
  <div className={`bg-secondary rounded-xl p-3 ${percent === 100 && total > 0 ? "ring-1 ring-celebrate-3/50" : ""}`}>
    <div className="flex items-center gap-1.5 mb-2">
      {icon}
      <span className="text-xs font-medium text-secondary-foreground">{label}</span>
    </div>
    <div className="h-2 bg-muted rounded-full overflow-hidden mb-1.5">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percent}%` }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        className={`h-full rounded-full bg-gradient-to-r ${color}`}
      />
    </div>
    <div className="flex justify-between items-center">
      <span className="text-xs text-muted-foreground">{done}/{total}</span>
      <span className={`text-xs font-bold font-mono bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
        {percent}%
      </span>
    </div>
  </div>
);

export default GoalStats;
