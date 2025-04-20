import { usePlayers } from '@/contexts/PlayersContext';
import { PlusCircle } from 'iconoir-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem } from '../ui/form';

const formSchema = z.object({
  name: z.string().min(1).max(12),
});

type FormData = z.infer<typeof formSchema>;

export const NewPlayerForm = () => {
  const { addNewPlayer } = usePlayers();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = (data: FormData) => {
    addNewPlayer(data.name);
    form.reset();
  };

  const animations = {
    layout: true,
  };

  return (
    <Form {...form}>
      <motion.form
        {...animations}
        className="relative flex items-end w-full rounded-md mt-6 gap-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  className="border-app-blue border text-app-blue shadow-none placeholder:text-cyan-300"
                  placeholder="Add player"
                  maxLength={12}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button className="bg-app-blue h-12" type="submit">
          Add
          <PlusCircle />
        </Button>
      </motion.form>
    </Form>
  );
};
