import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePlayers } from '@/contexts/PlayersContext';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check } from 'iconoir-react';
import { motion, usePresence } from 'framer-motion';
import type { Player } from '../KillerDart';

type PlayerNumberFormProps = {
  player: Player;
};

export function PlayerNumberForm({ player }: PlayerNumberFormProps) {
  const [isPresent, safeToRemove] = usePresence();
  const { updatePlayer, setIsUpdatingPlayerNumber } = usePlayers();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      playerNumber: player.number ? String(player.number) : '',
    },
  });

  const {
    formState: { errors, isDirty, isValid, isSubmitting },
    trigger,
  } = form;

  const onSubmit = (values: FormValues) => {
    setIsUpdatingPlayerNumber(null);
    updatePlayer(player.id, {
      number: parseInt(values.playerNumber, 10),
    });
  };

  const handleBlur = async () => {
    const isValidForm = await trigger('playerNumber');
    if (isValidForm) {
      await form.handleSubmit(onSubmit)();
    }
  };

  const preventScrollChange = (e: React.WheelEvent<HTMLInputElement>) => {
    e.currentTarget.blur();
  };

  return (
    <motion.div
      key={player.id}
      {...animations}
      className="h-16 w-full min-w-80 px-20 py-3"
      onAnimationComplete={() => !isPresent && safeToRemove()}
    >
      <Form {...form}>
        <form
          className={`flex items-center justify-center w-full rounded-md ${
            errors.playerNumber && isDirty
              ? 'outline outline-2 outline-app-red'
              : ''
          }`}
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            name="playerNumber"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    {...field}
                    className="w-full h-10 text-lg text-app-blue bg-white rounded-l-md rounded-r-none placeholder:text-cyan-300 placeholder:text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    type="tel"
                    placeholder="Enter target (1-20)"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={2}
                    autoComplete="off"
                    onWheel={preventScrollChange}
                    onBlur={handleBlur}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            variant="outline"
            disabled={!isValid || isSubmitting}
            className="w-12 h-10 flex-shrink-0 rounded-r-md rounded-l-none border-none shadow-none disabled:opacity-50"
            aria-label="Submit player number"
          >
            <Check />
          </Button>
        </form>
      </Form>
    </motion.div>
  );
}

const animations = {
  layout: true,
  exit: {
    borderRadius: '50%',
    width: '1.5rem',
    height: '1.5rem',
    minWidth: '0',
    paddingBlock: '0',
    paddingInline: '0',
    backgroundColor: 'white',
    transition: {
      duration: 0.5,
      opacity: { delay: 0.3 },
    },
  },
};

const formSchema = z.object({
  playerNumber: z
    .string()
    .min(1, 'Please enter a number')
    .regex(/^\d{1,2}$/, 'Must be a 1 or 2 digit number')
    .refine(val => {
      const num = parseInt(val, 10);
      return num > 0 && num <= 20;
    }, 'Number must be between 1-20'),
});

type FormValues = z.infer<typeof formSchema>;
