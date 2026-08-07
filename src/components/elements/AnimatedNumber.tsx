import { useEffect, useState } from 'react';

import { animate, useMotionValue, useTransform } from 'framer-motion';

interface AnimatedNumberProps {
  className?: string;
  value: number;
  duration?: number;
}

export default function Number({
  className,
  value,
  duration = 1,
}: AnimatedNumberProps) {
  const count = useMotionValue(0);

  const rounded = useTransform(count, (latest) => Math.round(latest));

  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(count, value, {
      duration: duration,
      ease: 'easeOut',
    });

    const unsubscribe = rounded.on('change', (latest) => {
      setDisplayValue(latest);
    });

    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [value, duration, count, rounded]);

  return <span className={className}>{displayValue}</span>;
}
