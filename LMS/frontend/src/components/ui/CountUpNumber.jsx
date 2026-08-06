import React, { useState, useEffect } from 'react';

const CountUpNumber = ({ value = 0, duration = 1500, suffix = '', prefix = '' }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const numericTarget = typeof value === 'number' ? value : parseFloat(value) || 0;
    let startTimestamp = null;
    let animationFrameId;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Ease-out cubic animation formula
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentCount = Math.floor(easedProgress * numericTarget);

      setDisplayValue(currentCount);

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      } else {
        setDisplayValue(numericTarget);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);

    return () => {
      if (animationFrameId) window.cancelAnimationFrame(animationFrameId);
    };
  }, [value, duration]);

  return (
    <span>
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
};

export default CountUpNumber;
