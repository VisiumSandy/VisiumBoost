"use client";

import { useRef, useState, useEffect, useCallback, useMemo } from "react";

export default function SpinWheel({ rewards, primaryColor, secondaryColor, onResult }) {
  const canvasRef = useRef(null);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const angleRef = useRef(0);

  const segColors = useMemo(() => {
    const base = [
      primaryColor || "#6C5CE7",
      secondaryColor || "#00B894",
      "#FDCB6E", "#E17055", "#0984E3", "#E84393", "#74B9FF", "#55EFC4",
    ];
    return rewards.map((_, i) => base[i % base.length]);
  }, [rewards, primaryColor, secondaryColor]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;
    const R = Math.min(cx, cy) - 16;

    ctx.clearRect(0, 0, W, H);

    // Shadow
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.15)";
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 8;
    ctx.beginPath();
    ctx.arc(cx, cy, R + 4, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.restore();

    const n = rewards.length || 1;
    const arc = (Math.PI * 2) / n;

    rewards.forEach((rw, i) => {
      const a0 = angleRef.current + i * arc;

      // Segment
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, R, a0, a0 + arc);
      ctx.closePath();
      ctx.fillStyle = segColors[i];
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.4)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Text
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(a0 + arc / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#fff";
      ctx.font = "bold 13px 'DM Sans', sans-serif";
      const label = rw.name.length > 14 ? rw.name.slice(0, 14) + "…" : rw.name;
      ctx.fillText(label, R - 16, 5);
      ctx.restore();
    });

    // Center circle
    ctx.beginPath();
    ctx.arc(cx, cy, 22, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.strokeStyle = primaryColor || "#6C5CE7";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Pointer (right side)
    ctx.save();
    ctx.translate(cx + R - 6, cy);
    ctx.beginPath();
    ctx.moveTo(16, 0);
    ctx.lineTo(-6, -12);
    ctx.lineTo(-6, 12);
    ctx.closePath();
    ctx.fillStyle = "#E17055";
    ctx.fill();
    ctx.restore();
  }, [rewards, segColors, primaryColor]);

  useEffect(() => {
    draw();
  }, [draw]);

  const spin = () => {
    if (spinning || rewards.length === 0) return;
    setSpinning(true);
    setResult(null);

    // Weighted random selection
    const rand = Math.random() * 100;
    let acc = 0;
    let winIdx = 0;
    for (let i = 0; i < rewards.length; i++) {
      acc += rewards[i].prob;
      if (rand <= acc) {
        winIdx = i;
        break;
      }
    }

    const n = rewards.length;
    const arc = (Math.PI * 2) / n;
    const targetAngle = -(winIdx * arc + arc / 2);
    const fullSpins = Math.PI * 2 * (6 + Math.random() * 3);
    const totalRot = fullSpins + (targetAngle - (angleRef.current % (Math.PI * 2)));

    const duration = 4500;
    const startTime = Date.now();
    const startAngle = angleRef.current;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const t = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - t, 4); // easeOutQuart

      angleRef.current = startAngle + totalRot * ease;
      draw();

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        setSpinning(false);
        setResult(rewards[winIdx]);
        onResult?.(rewards[winIdx]);
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <canvas
        ref={canvasRef}
        width={360}
        height={360}
        className="max-w-full"
      />

      {!result ? (
        <button
          onClick={spin}
          disabled={spinning}
          className="px-10 py-3.5 rounded-xl border-none font-bold text-base text-white transition-all duration-200"
          style={{
            background: spinning ? "#b2bec3" : (primaryColor || "#6C5CE7"),
            cursor: spinning ? "wait" : "pointer",
            boxShadow: spinning ? "none" : `0 4px 20px ${primaryColor || "#6C5CE7"}44`,
          }}
        >
          {spinning ? "La roue tourne…" : "🎰 Tourner la roue !"}
        </button>
      ) : (
        <div className="text-center p-5 rounded-2xl bg-gradient-to-br from-brand-500/[0.15] to-success/[0.15]">
          <div className="text-[40px] mb-2">🎉</div>
          <div className="text-[22px] font-extrabold" style={{ color: primaryColor || "#6C5CE7" }}>
            Félicitations !
          </div>
          <div className="text-base text-gray-500 mt-1">
            Vous avez gagné : <strong>{result.name}</strong>
          </div>
        </div>
      )}
    </div>
  );
}
