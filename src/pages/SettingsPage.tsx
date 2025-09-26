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
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast, Toaster } from '@/components/ui/sonner';
import { useState } from 'react';
import { Icons } from '@/components/icons';
const settingsSchema = z.object({
  apiUrl: z.string().url({ message: 'Please enter a valid URL.' }),
  apiUsername: z.string().min(1, 'API Username is required.'),
  apiPassword: z.string().min(1, 'API Password is required.'),
});
type SettingsFormValues = z.infer<typeof settingsSchema>;
export function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    // In a real app, these would be loaded from a secure store or config
    defaultValues: {
      apiUrl: 'http://127.0.0.1:1401',
      apiUsername: 'jcliadmin',
      apiPassword: '',
    },
  });
  const onSave = async (values: SettingsFormValues) => {
    setIsSaving(true);
    console.log('Saving settings:', values);
    // Simulate API call to save settings
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    toast.success('Settings saved successfully!');
  };
  const onTestConnection = async () => {
    setIsTesting(true);
    // Simulate API call to test connection
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsTesting(false);
    // Simulate a successful connection
    toast.success('Connection successful!', {
      description: 'Successfully connected to the Jasmin HTTP API.',
    });
  };
  return (
    <>
      <Toaster richColors />
      <div className="flex justify-center">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSave)} className="w-full max-w-2xl">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Application Settings</CardTitle>
                <CardDescription>
                  Configure the connection to your Jasmin SMS Gateway HTTP API.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="apiUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API URL</FormLabel>
                      <FormControl>
                        <Input placeholder="http://127.0.0.1:1401" {...field} />
                      </FormControl>
                      <FormDescription>
                        The base URL of the Jasmin HTTP API.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="apiUsername"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Username</FormLabel>
                      <FormControl>
                        <Input placeholder="jcliadmin" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="apiPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={onTestConnection} disabled={isTesting || isSaving}>
                  {isTesting ? (
                    <>
                      <Icons.activity className="mr-2 h-4 w-4 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    'Test Connection'
                  )}
                </Button>
                <Button type="submit" disabled={isSaving || isTesting}>
                  {isSaving ? (
                    <>
                      <Icons.activity className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Settings'
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </>
  );
}