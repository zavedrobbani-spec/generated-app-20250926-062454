import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { JasminUser } from '@shared/types';
import { useUserStore } from '@/stores/user-store';
import { useEffect } from 'react';
const formSchema = z.object({
  username: z.string().min(1, { message: 'Username is required.' }),
  gid: z.string().min(1, { message: 'Group is required.' }),
  balance: z.coerce.number(),
  throughput: z.coerce.number().int().nonnegative(),
  enabled: z.boolean(),
});
type UserFormValues = z.infer<typeof formSchema>;
interface UserFormProps {
  user?: Partial<JasminUser> | null;
  onSuccess: () => void;
}
export function UserForm({ user, onSuccess }: UserFormProps) {
  const { addUser, updateUser, isLoading, groups } = useUserStore();
  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      gid: '',
      balance: 0,
      throughput: 0,
      enabled: true,
    },
  });
  useEffect(() => {
    if (user) {
      form.reset({
        username: user.username || '',
        gid: user.gid || '',
        balance: user.balance || 0,
        throughput: user.throughput || 0,
        enabled: user.enabled === undefined ? true : user.enabled,
      });
    } else {
      form.reset({
        username: '',
        gid: '',
        balance: 0,
        throughput: 0,
        enabled: true,
      });
    }
  }, [user, form]);
  const onSubmit = async (values: UserFormValues) => {
    try {
      if (user?.uid) {
        await updateUser({ ...user, ...values, uid: user.uid } as JasminUser);
      } else {
        await addUser(values);
      }
      onSuccess();
    } catch (error) {
      console.error('Failed to save user:', error);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="e.g., customer_a" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gid"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a group" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {groups.map((g) => (
                    <SelectItem key={g.gid} value={g.gid}>{g.gid}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="balance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Balance</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 100.0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="throughput"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Throughput</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 10" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="enabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Enabled</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save User'}
          </Button>
        </div>
      </form>
    </Form>
  );
}