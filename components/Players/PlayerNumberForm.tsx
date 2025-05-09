import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePlayers } from '@/contexts/PlayersContext';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check } from 'iconoir-react';
import type { Player } from '../KillerDart';

type PlayerNumberFormProps = {
  player: Player;
};

export function PlayerNumberForm({ player }: PlayerNumberFormProps) {
  const { updatePlayer } = usePlayers();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      playerNumber: player.number ? String(player.number) : '',
    },
  });

  function onSubmit(values: FormValues) {
    updatePlayer(player.id, {
      number: parseInt(values.playerNumber, 10),
    });
  }

  const preventScrollChange = (e: React.WheelEvent<HTMLInputElement>) => {
    e.currentTarget.blur();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-center justify-center h-16 w-full min-w-80 px-20 py-3"
      >
        <FormField
          control={form.control}
          name="playerNumber"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  {...field}
                  className="w-full h-10 text-lg text-app-blue bg-white border-none rounded-l-md rounded-r-none placeholder:text-cyan-300 placeholder:text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  type="tel"
                  placeholder="Enter target"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={2}
                  autoComplete="off"
                  onWheel={preventScrollChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          variant="outline"
          className="w-12 h-10 flex-shrink-0 rounded-r-md rounded-l-none border-none shadow-none"
        >
          <Check />
        </Button>
      </form>
    </Form>
  );
}

const formSchema = z.object({
  playerNumber: z
    .string()
    .regex(/^\d{1,2}$/, 'Must be a 1 or 2 digit number')
    .refine(val => {
      const num = parseInt(val, 10);
      return num > 0 && num <= 20;
    }, 'Number must be between 1-20'),
});

type FormValues = z.infer<typeof formSchema>;
