import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium duration-200 transition-brightness transition-background betterhover:hover:brightness-110 focus-visible:outline-app-blue disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:h-full [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-app-blue text-white shadow-md',
        destructive:
          'bg-destructive text-destructive-foreground shadow-sm betterhover:hover:bg-destructive/90',
        outline:
          'bg-white border border-app-blue border-solid shadow-md text-app-blue',
        secondary:
          'bg-secondary text-secondary-foreground shadow-sm betterhover:hover:bg-secondary/80',
        ghost:
          'betterhover:hover:bg-accent betterhover:hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 betterhover:hover:underline',
      },
      size: {
        default: 'h-12 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
