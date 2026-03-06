import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CountdownTimer = () => {
  const [targetDays, setTargetDays] = useState(0);
  const [targetHours, setTargetHours] = useState(0);
  const [targetMinutes, setTargetMinutes] = useState(0);
  const [targetSeconds, setTargetSeconds] = useState(0);
  const [remainingMs, setRemainingMs] = useState(0);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);

  const totalSetMs =
    (targetDays * 86400 + targetHours * 3600 + targetMinutes * 60 + targetSeconds) * 1000;

  const startTimer = useCallback(() => {
    if (totalSetMs <= 0) return;
    setRemainingMs(totalSetMs);
    setRunning(true);
    setFinished(false);
  }, [totalSetMs]);

  const togglePause = () => setRunning(prev => !prev);

  const resetTimer = () => {
    setRunning(false);
    setRemainingMs(0);
    setFinished(false);
  };

  useEffect(() => {
    if (!running || remainingMs <= 0) return;
    const interval = setInterval(() => {
      setRemainingMs(prev => {
        if (prev <= 1000) {
          setRunning(false);
          setFinished(true);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [running, remainingMs]);

  const days = Math.floor(remainingMs / 86400000);
  const hours = Math.floor((remainingMs % 86400000) / 3600000);
  const minutes = Math.floor((remainingMs % 3600000) / 60000);
  const seconds = Math.floor((remainingMs % 60000) / 1000);

  const progress = totalSetMs > 0 ? ((totalSetMs - remainingMs) / totalSetMs) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className={`glass rounded-2xl p-6 transition-all duration-500 ${
        finished ? "glow-celebrate animate-[celebrate-pulse_1s_ease-in-out_3]" : ""
      }`}
      style={finished ? { animation: "rainbow-border 2s linear infinite", borderWidth: "2px" } : {}}
    >
      <div className="flex items-center gap-2 mb-4">
        <Timer className={`w-5 h-5 ${finished ? "text-celebrate-1" : "text-primary"}`} />
        <p className="text-xs uppercase tracking-[0.2em] text-primary font-medium">
          Countdown Timer
        </p>
        {finished && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="ml-auto text-xs font-bold text-celebrate-1 bg-celebrate-1/10 px-2 py-0.5 rounded-full"
          >
            ⏰ TIME'S UP!
          </motion.span>
        )}
      </div>

      {/* Timer Display */}
      {(remainingMs > 0 || finished) && (
        <div className="flex justify-center gap-2 mb-4">
          {[
            { value: days, label: "Days" },
            { value: hours, label: "Hrs" },
            { value: minutes, label: "Min" },
            { value: seconds, label: "Sec" },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center">
              <motion.div
                key={value}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                className={`font-mono text-2xl md:text-3xl font-bold w-14 h-14 flex items-center justify-center rounded-xl ${
                  finished
                    ? "bg-celebrate-1/20 text-celebrate-1"
                    : "bg-secondary text-foreground"
                }`}
              >
                {String(value).padStart(2, "0")}
              </motion.div>
              <span className="text-xs text-muted-foreground mt-1">{label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Progress bar */}
      {totalSetMs > 0 && remainingMs > 0 && (
        <div className="h-1.5 bg-secondary rounded-full overflow-hidden mb-4">
          <motion.div
            animate={{ width: `${progress}%` }}
            className="h-full rounded-full bg-gradient-to-r from-primary to-celebrate-1"
          />
        </div>
      )}

      {/* Input fields */}
      {!running && !finished && (
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Days</label>
            <Input
              type="number"
              min={0}
              value={targetDays}
              onChange={e => setTargetDays(Math.max(0, parseInt(e.target.value) || 0))}
              className="bg-secondary border-border text-foreground text-center font-mono"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Hours</label>
            <Input
              type="number"
              min={0}
              max={23}
              value={targetHours}
              onChange={e => setTargetHours(Math.max(0, Math.min(23, parseInt(e.target.value) || 0)))}
              className="bg-secondary border-border text-foreground text-center font-mono"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Min</label>
            <Input
              type="number"
              min={0}
              max={59}
              value={targetMinutes}
              onChange={e => setTargetMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
              className="bg-secondary border-border text-foreground text-center font-mono"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Sec</label>
            <Input
              type="number"
              min={0}
              max={59}
              value={targetSeconds}
              onChange={e => setTargetSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
              className="bg-secondary border-border text-foreground text-center font-mono"
            />
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-2 justify-center">
        {!running && !finished && remainingMs === 0 && (
          <Button onClick={startTimer} disabled={totalSetMs <= 0} className="gap-1.5">
            <Play className="w-4 h-4" /> Start
          </Button>
        )}
        {(running || (!running && remainingMs > 0 && !finished)) && (
          <>
            <Button onClick={togglePause} variant="outline" className="gap-1.5">
              {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {running ? "Pause" : "Resume"}
            </Button>
            <Button onClick={resetTimer} variant="outline" className="gap-1.5">
              <RotateCcw className="w-4 h-4" /> Reset
            </Button>
          </>
        )}
        {finished && (
          <Button onClick={resetTimer} variant="outline" className="gap-1.5">
            <RotateCcw className="w-4 h-4" /> New Timer
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default CountdownTimer;
