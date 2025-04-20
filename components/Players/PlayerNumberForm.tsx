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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-center justify-center h-16 w-full py-3 gap-2"
      >
        <FormField
          control={form.control}
          name="playerNumber"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  {...field}
                  className="w-full h-10 text-lg text-white bg-transparent border border-white rounded-md placeholder:text-white/80"
                  type="text"
                  placeholder={`Enter ${player.name}'s target`}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={2}
                  autoComplete="off"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          variant="outline"
          className="w-20 h-10 flex-shrink-0"
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
