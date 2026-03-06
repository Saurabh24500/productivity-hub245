import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const LiveClock = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const year = now.getFullYear();
  const monthName = now.toLocaleString("en-IN", { month: "long" });
  const dayName = now.toLocaleString("en-IN", { weekday: "long" });
  const day = now.getDate();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass rounded-2xl p-6 glow-amber"
    >
      <p className="text-xs uppercase tracking-[0.2em] text-primary mb-4 font-medium">
        Live Clock
      </p>
      <div className="flex items-baseline gap-1 font-mono">
        <span className="text-4xl md:text-5xl font-bold text-foreground glow-text">
          {hours}
        </span>
        <motion.span
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="text-4xl md:text-5xl font-bold text-primary"
        >
          :
        </motion.span>
        <span className="text-4xl md:text-5xl font-bold text-foreground glow-text">
          {minutes}
        </span>
        <span className="text-2xl text-muted-foreground ml-1">{seconds}</span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="bg-secondary rounded-lg p-2 text-center">
          <p className="text-muted-foreground text-xs">Day</p>
          <p className="text-foreground font-semibold">{dayName}</p>
        </div>
        <div className="bg-secondary rounded-lg p-2 text-center">
          <p className="text-muted-foreground text-xs">Date</p>
          <p className="text-foreground font-semibold">{day} {monthName}</p>
        </div>
        <div className="bg-secondary rounded-lg p-2 text-center">
          <p className="text-muted-foreground text-xs">Year</p>
          <p className="text-foreground font-semibold">{year}</p>
        </div>
        <div className="bg-secondary rounded-lg p-2 text-center">
          <p className="text-muted-foreground text-xs">Day of Year</p>
          <p className="text-foreground font-semibold">{dayOfYear}/365</p>
        </div>
      </div>
    </motion.div>
  );
};

export default LiveClock;
