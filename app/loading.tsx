'use client';

import { useEffect, useState } from 'react';

export default function Loading() {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const normalDuration = 3000; // 3 seconds normal speed
    const fastDuration = 500; // 0.5 seconds when accelerating
    let isAccelerating = false;
    let accelerationStartTime = 0;
    let accelerationStartPercentage = 0;
    let animationFrameId: number;

    const handleLoad = () => {
      if (percentage < 100) {
        isAccelerating = true;
        accelerationStartTime = Date.now();
        accelerationStartPercentage = percentage;
      }
    };

    // Listen for window load event to trigger acceleration
    if (typeof window !== 'undefined') {
      if (document.readyState === 'complete') {
        handleLoad();
      } else {
        window.addEventListener('load', handleLoad);
      }
    }

    const animate = () => {
      const now = Date.now();

      if (isAccelerating) {
        // Fast acceleration to 100%
        const elapsed = now - accelerationStartTime;
        const progress = Math.min(elapsed / fastDuration, 1);
        const newPercentage =
          accelerationStartPercentage +
          (100 - accelerationStartPercentage) * progress;
        setPercentage(Math.min(Math.round(newPercentage), 100));

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animate);
        }
      } else {
        // Normal smooth counting
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / normalDuration, 1);
        const newPercentage = progress * 100;
        setPercentage(Math.round(newPercentage));

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animate);
        } else if (!isAccelerating) {
          // Reached 100% naturally
          setPercentage(100);
        }
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (typeof window !== 'undefined') {
        window.removeEventListener('load', handleLoad);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      <p className="text-4xl font-semibold text-foreground">{percentage}%</p>
    </div>
  );
}
