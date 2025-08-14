// src/app/admin/settings/global/page.js
'use client';

import * as React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocale } from '@/contexts/LocaleContext';

const globalSettingsSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  companyLogoUrl: z.string().url('Invalid URL format').optional().or(z.literal('')),
  defaultCurrency: z.string().length(3, 'Currency code must be 3 letters (e.g., USD)'),
  timezone: z.string().min(1, 'Timezone is required'),
  language: z.enum(['en'], {
    required_error: "Please select a default language.",
  }).default('en'),
});

// Placeholder for where settings would be stored/fetched in a real app
// For now, it's just in-memory.
let initialSettings = {
  companyName: 'NetHub ISP',
  companyLogoUrl: '',
  defaultCurrency: 'USD',
  timezone: 'America/New_York',
  language: 'en',
};

// Simulate API calls
const loadGlobalSettings = async () => {
  console.log("Simulating loading global settings...");
  return { ...initialSettings, language: 'en' };
};

const saveGlobalSettings = async (data) => {
  console.log("Simulating saving global settings:", data);
  initialSettings = { ...data, language: 'en' };
};

export default function GlobalSettings() {
  const { toast } = useToast();
  const { t, setLocale } = useLocale();
  const iconSize = "h-3 w-3";

  const form = useForm({
    resolver: zodResolver(globalSettingsSchema),
    defaultValues: {
      companyName: '',
      companyLogoUrl: '',
      defaultCurrency: '',
      timezone: '',
      language: 'en',
    },
  });

  React.useEffect(() => {
    loadGlobalSettings().then(settings => {
      const validatedSettings = {
        companyName: settings.companyName || '',
        companyLogoUrl: settings.companyLogoUrl || '',
        defaultCurrency: settings.defaultCurrency || '',
        timezone: settings.timezone || '',
        language: 'en',
      };
      form.reset(validatedSettings);
      if (typeof window !== 'undefined') {
         setLocale('en');
      }
    }).catch(error => {
      toast({
        title: t('global_settings.load_error_title'),
        description: t('global_settings.load_error_description'),
        variant: 'destructive',
      });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data) => {
    try {
      const dataToSave = { ...data, language: 'en' };
      await saveGlobalSettings(dataToSave);
      if (typeof window !== 'undefined') {
        setLocale('en');
      }
      toast({
        title: t('global_settings.save_success_title'),
        description: t('global_settings.save_success_description'),
      });
    } catch (error) {
      toast({
        title: t('global_settings.save_error_title'),
        description: t('global_settings.save_error_description'),
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-base font-semibold">{t('globalSettings.title')}</h1>
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('global_settings.company_name_label')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('global_settings.company_name_placeholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="companyLogoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('global_settings.company_logo_label')}</FormLabel>
                    <FormControl>
                      <Input type="url" placeholder={t('global_settings.company_logo_placeholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="defaultCurrency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('global_settings.currency_label')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('global_settings.currency_placeholder')} maxLength={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="timezone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('global_settings.timezone_label')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('global_settings.timezone_placeholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

               <FormField
                 control={form.control}
                 name="language"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>{t('global_settings.language_label')}</FormLabel>
                     <Select
                        onValueChange={(value) => {
                            if (value === 'en') {
                                field.onChange(value);
                            }
                        }}
                        value={field.value || 'en'}
                     >
                       <FormControl>
                         <SelectTrigger>
                           <SelectValue placeholder={t('global_settings.language_placeholder')} />
                         </SelectTrigger>
                       </FormControl>
                       <SelectContent>
                         <SelectItem value="en">{t('global_settings.language_english')}</SelectItem>
                       </SelectContent>
                     </Select>
                     <FormMessage />
                   </FormItem>
                 )}
               />
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? t('global_settings.saving_button') : <><Save className={`mr-2 ${iconSize}`} /> {t('global_settings.save_button')}</>}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}