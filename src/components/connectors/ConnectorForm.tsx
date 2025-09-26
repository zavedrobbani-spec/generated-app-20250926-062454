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
import { Connector } from '@shared/types';
import { useConnectorStore } from '@/stores/connector-store';
import { useEffect } from 'react';
const formSchema = z.object({
  cid: z.string().min(1, { message: 'Connector ID is required.' }),
  type: z.enum(['smppc', 'httpc']),
  host: z.string().min(1, { message: 'Host is required.' }),
  port: z.coerce.number().int().positive({ message: 'Port must be a positive number.' }),
  username: z.string().optional(),
});
type ConnectorFormValues = z.infer<typeof formSchema>;
interface ConnectorFormProps {
  connector?: Partial<Connector> | null;
  onSuccess: () => void;
}
export function ConnectorForm({ connector, onSuccess }: ConnectorFormProps) {
  const { addConnector, updateConnector, isLoading } = useConnectorStore();
  const form = useForm<ConnectorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cid: '',
      type: 'smppc',
      host: '',
      port: 2775,
      username: '',
    },
  });
  useEffect(() => {
    if (connector) {
      form.reset({
        cid: connector.cid || '',
        type: connector.type || 'smppc',
        host: connector.host || '',
        port: connector.port || 2775,
        username: connector.username || '',
      });
    } else {
      form.reset({
        cid: '',
        type: 'smppc',
        host: '',
        port: 2775,
        username: '',
      });
    }
  }, [connector, form]);
  const onSubmit = async (values: ConnectorFormValues) => {
    try {
      if (connector?.id) {
        await updateConnector({ ...connector, ...values } as Connector);
      } else {
        await addConnector(values);
      }
      onSuccess();
    } catch (error) {
      console.error('Failed to save connector:', error);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="cid"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Connector ID (CID)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., smpp-connector-01" {...field} disabled={!!connector?.id} />
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
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!connector?.id}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a connector type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="smppc">SMPP Client (smppc)</SelectItem>
                  <SelectItem value="httpc">HTTP Client (httpc)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="host"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Host</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., smsc.provider.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="port"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Port</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g., 2775"
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
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="e.g., system_id" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Connector'}
          </Button>
        </div>
      </form>
    </Form>
  );
}