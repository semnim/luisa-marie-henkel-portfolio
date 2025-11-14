'use client';

import { useEffect, useState } from 'react';

export default function Loading() {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const normalDuration = 3000; // 3 seconds normal speed
    let animationFrameId: number;

    const animate = () => {
      const now = Date.now();

      const elapsed = now - startTime;
      const progress = Math.min(elapsed / normalDuration, 1);
      const newPercentage = progress * 100;
      setPercentage(Math.round(newPercentage));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        // Reached 100% naturally
        setPercentage(100);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      <p className="text-4xl font-semibold text-foreground">{percentage}%</p>
    </div>
  );
}
