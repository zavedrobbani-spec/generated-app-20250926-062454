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
import { Route, RouteType } from '@shared/types';
import { useRoutingStore } from '@/stores/routing-store';
import { useEffect } from 'react';
import { useConnectorStore } from '@/stores/connector-store';
const formSchema = z.object({
  type: z.nativeEnum(RouteType),
  order: z.coerce.number().int().min(0, { message: 'Order must be a positive number.' }),
  connectorId: z.string().min(1, { message: 'Connector is required.' }),
  filters: z.string().optional(),
});
type RouteFormValues = z.infer<typeof formSchema>;
interface RouteFormProps {
  route?: Partial<Route> | null;
  onSuccess: () => void;
}
export function RouteForm({ route, onSuccess }: RouteFormProps) {
  const { addRoute, updateRoute, isLoading } = useRoutingStore();
  const { connectors, fetchConnectors } = useConnectorStore();
  useEffect(() => {
    if (connectors.length === 0) {
      fetchConnectors();
    }
  }, [connectors, fetchConnectors]);
  const form = useForm<RouteFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: RouteType.STATIC,
      order: 0,
      connectorId: '',
      filters: '',
    },
  });
  useEffect(() => {
    if (route) {
      form.reset({
        type: route.type || RouteType.STATIC,
        order: route.order || 0,
        connectorId: route.connectorId || '',
        filters: route.filters?.join(', ') || '',
      });
    } else {
      form.reset({
        type: RouteType.STATIC,
        order: 0,
        connectorId: '',
        filters: '',
      });
    }
  }, [route, form]);
  const onSubmit = async (values: RouteFormValues) => {
    try {
      const payload = {
        ...values,
        filters: values.filters ? values.filters.split(',').map(f => f.trim()).filter(Boolean) : [],
      };
      if (route?.id) {
        await updateRoute({ ...route, ...payload } as Route);
      } else {
        await addRoute(payload);
      }
      onSuccess();
    } catch (error) {
      console.error('Failed to save route:', error);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a route type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(RouteType).map((type) => (
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
            name="order"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Order</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g., 100"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="connectorId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Connector</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a connector" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {connectors.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.cid} ({c.type.toUpperCase()})
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
          name="filters"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Filters</FormLabel>
              <FormControl>
                <Input placeholder="e.g., filter1, filter2 (comma-separated)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Route'}
          </Button>
        </div>
      </form>
    </Form>
  );
}