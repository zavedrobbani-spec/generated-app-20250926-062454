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
import { Switch } from '@/components/ui/switch';
import { Group } from '@shared/types';
import { useUserStore } from '@/stores/user-store';
import { useEffect } from 'react';
const formSchema = z.object({
  gid: z.string().min(1, { message: 'Group ID is required.' }),
  enabled: z.boolean(),
});
type GroupFormValues = z.infer<typeof formSchema>;
interface GroupFormProps {
  group?: Partial<Group> | null;
  onSuccess: () => void;
}
export function GroupForm({ group, onSuccess }: GroupFormProps) {
  const { addGroup, updateGroup, isLoading } = useUserStore();
  const form = useForm<GroupFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gid: '',
      enabled: true,
    },
  });
  useEffect(() => {
    if (group) {
      form.reset({
        gid: group.gid || '',
        enabled: group.enabled === undefined ? true : group.enabled,
      });
    } else {
      form.reset({
        gid: '',
        enabled: true,
      });
    }
  }, [group, form]);
  const onSubmit = async (values: GroupFormValues) => {
    try {
      if (group?.gid) {
        await updateGroup({ ...group, ...values, id: group.gid } as Group);
      } else {
        await addGroup(values);
      }
      onSuccess();
    } catch (error) {
      console.error('Failed to save group:', error);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="gid"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group ID (GID)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., wholesale-customers" {...field} disabled={!!group?.gid} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
            {isLoading ? 'Saving...' : 'Save Group'}
          </Button>
        </div>
      </form>
    </Form>
  );
}