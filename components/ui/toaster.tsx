'use client';

import { useToast } from '@/hooks/use-toast';
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast';

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        title,
        description,
        action,
        secondaryAction,
        ...props
      }) {
        return (
          <Toast key={id} {...props} className="pr-4">
            <div className="flex flex-col items-center gap-2 flex-grow">
              <div className="grid gap-1 w-full">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription className="text-neutral-500">
                    {description}
                  </ToastDescription>
                )}
              </div>
              <div className="flex items-center justify-center gap-2 w-full pt-4">
                {secondaryAction}
                {action}
              </div>
            </div>
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
