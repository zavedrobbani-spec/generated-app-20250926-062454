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
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast, Toaster } from '@/components/ui/sonner';
import { useState } from 'react';
import { Icons } from '@/components/icons';
const sendMessageSchema = z.object({
  from: z.string().min(1, 'Sender ID is required.'),
  to: z.string().min(1, 'Recipient number is required.'),
  content: z.string().min(1, 'Message content cannot be empty.').max(160, 'Message content cannot exceed 160 characters.'),
});
type SendMessageFormValues = z.infer<typeof sendMessageSchema>;
export function SendMessagePage() {
  const [isSending, setIsSending] = useState(false);
  const form = useForm<SendMessageFormValues>({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: {
      from: '',
      to: '',
      content: '',
    },
  });
  const onSubmit = async (values: SendMessageFormValues) => {
    setIsSending(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSending(false);
    toast.success(`Message sent successfully to ${values.to}!`);
    form.reset();
  };
  return (
    <>
      <Toaster richColors />
      <div className="flex justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">Send Test Message</CardTitle>
            <CardDescription>
              Use this form to send a test SMS message through the gateway.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="from"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>From (Sender ID)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Jasmin" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="to"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>To (Recipient)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., +1234567890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Type your message here..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={isSending} className="w-full sm:w-auto">
                    {isSending ? (
                      <>
                        <Icons.activity className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Icons.sendMessage className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}