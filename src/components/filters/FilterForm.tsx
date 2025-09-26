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
import { Textarea } from '@/components/ui/textarea';
import { MessageFilter, FilterType } from '@shared/types';
import { useFilterStore } from '@/stores/filter-store';
import { useEffect } from 'react';
const formSchema = z.object({
  fid: z.string().min(1, { message: 'Filter ID is required.' }),
  type: z.nativeEnum(FilterType),
  description: z.string().optional(),
  routes: z.string().optional(),
});
type FilterFormValues = z.infer<typeof formSchema>;
interface FilterFormProps {
  filter?: Partial<MessageFilter> | null;
  onSuccess: () => void;
}
export function FilterForm({ filter, onSuccess }: FilterFormProps) {
  const { addFilter, updateFilter, isLoading } = useFilterStore();
  const form = useForm<FilterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fid: '',
      type: FilterType.TRANSPARENT_FILTER,
      description: '',
      routes: '',
    },
  });
  useEffect(() => {
    if (filter) {
      form.reset({
        fid: filter.fid || '',
        type: filter.type || FilterType.TRANSPARENT_FILTER,
        description: filter.description || '',
        routes: filter.routes?.join(', ') || '',
      });
    } else {
      form.reset({
        fid: '',
        type: FilterType.TRANSPARENT_FILTER,
        description: '',
        routes: '',
      });
    }
  }, [filter, form]);
  const onSubmit = async (values: FilterFormValues) => {
    try {
      const payload = {
        ...values,
        description: values.description || '', // Ensure description is always a string
        routes: values.routes ? values.routes.split(',').map(r => r.trim()).filter(Boolean) : [],
      };
      if (filter?.id) {
        await updateFilter({ ...filter, ...payload } as MessageFilter);
      } else {
        await addFilter(payload);
      }
      onSuccess();
    } catch (error) {
      console.error('Failed to save filter:', error);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="fid"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Filter ID (FID)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., block_spam_content" {...field} disabled={!!filter?.id} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a filter type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(FilterType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="A brief description of what this filter does." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="routes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Routes</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 10, 20 (comma-separated route orders)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Filter'}
          </Button>
        </div>
      </form>
    </Form>
  );
}