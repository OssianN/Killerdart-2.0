'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <motion.div
    animate={value && value > 0 ? 'animate' : 'initial'}
    variants={{ initial: { scale: 1 }, animate: { scale: 1.2 } }}
    transition={{
      stiffness: 100,
      damping: 1,
      delay: value && value > 0 ? 1.4 : 0,
    }}
    className="w-full"
  >
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        'relative h-4 w-full overflow-hidden rounded-full bg-neutral-200',
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={`h-full w-full bg-app-blue flex-1 ${
          value && value > 0
            ? 'transition-translateX ease-linear delay-200'
            : 'transition-none delay-0'
        }`}
        style={{
          transform: `translateX(-${100 - (value || 0)}%)`,
          transitionDuration: '1300ms',
        }}
      />
    </ProgressPrimitive.Root>
  </motion.div>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
