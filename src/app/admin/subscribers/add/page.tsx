// src/app/subscribers/add/page.tsx
'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/shared/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shared/ui/form";
import { Input } from "@/components/shared/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/shared/ui/radio-group";
import { Calendar } from "@/components/shared/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shared/ui/popover";
import { CalendarIcon, User, Building, Save, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from '@/hooks/use-toast';
import { useLocale } from '@/contexts/LocaleContext';
import { addSubscriber } from '@/services/postgres/subscribers';
import type { SubscriberData } from '@/types/subscribers';
import { useRouter } from 'next/navigation';

// ----------------------
// Validation Schema
// ----------------------
const baseSchema = z.object({
  address: z.string().min(1, 'Address is required'),
  point_of_reference: z.string().optional(),
  email: z.string().email('Invalid email address'),
  phone_number: z.string().min(1, 'Phone number is required'),
  mobile_number: z.string().optional(),
  tax_id: z.string().optional(),
  business_number: z.string().optional(),
  id_number: z.string().optional(),
  signup_date: z.date().optional(),
  status: z.enum(['Active', 'Inactive', 'Suspended', 'Planned', 'Canceled']).default('Active').optional(),
});

const residentialSchema = baseSchema.extend({
  subscriber_type: z.literal('Residential'),
  full_name: z.string().min(1, 'Full Name is required'),
  birthday: z.date({ required_error: 'Birthday is required' }),
  tax_id: z.string().min(1, 'Tax ID is required'),
});

const commercialSchema = baseSchema.extend({
  subscriber_type: z.literal('Commercial'),
  company_name: z.string().min(1, 'Company Name is required'),
  established_date: z.date({ required_error: 'Established Date is required' }),
  tax_id: z.string().min(1, 'CNPJ (Tax ID) is required'),
});

const subscriberSchema = z.discriminatedUnion('subscriber_type', [
  residentialSchema,
  commercialSchema,
]);

type SubscriberFormZodData = z.infer<typeof subscriberSchema>;

// ----------------------
// Component
// ----------------------
export default function AddSubscriberPage() {
  const { toast } = useToast();
  const { t } = useLocale();
  const router = useRouter();
  const iconSize = "h-3 w-3";

  const form = useForm<SubscriberFormZodData>({
    resolver: zodResolver(subscriberSchema),
    defaultValues: {
      subscriber_type: undefined,
      address: '',
      point_of_reference: '',
      email: '',
      phone_number: '',
      mobile_number: '',
      tax_id: '',
      business_number: '',
      id_number: '',
      signup_date: new Date(),
      status: 'Active',
    } as any, // allow partial defaults
  });

  const subscriberType = form.watch('subscriber_type');

  const onSubmit = React.useCallback(async (data: SubscriberFormZodData) => {
    try {
      const subscriberServiceData: SubscriberData = {
        ...data,
        birthday: 'birthday' in data ? data.birthday ?? null : null,
        established_date: 'established_date' in data ? data.established_date ?? null : null,
        signup_date: data.signup_date ?? new Date(),
      };

      const newSubscriber = await addSubscriber(subscriberServiceData);
      const name =
        newSubscriber.subscriberType === 'Residential'
          ? newSubscriber.fullName
          : newSubscriber.companyName;

      toast({
        title: t('add_subscriber.add_success_toast_title'),
        description: t('add_subscriber.add_success_toast_description', 'Details for {name} saved with ID {id}.')
          .replace('{name}', name || 'N/A')
          .replace('{id}', newSubscriber.id.toString()),
      });

      form.reset();
      router.push('/admin/subscribers/list');
    } catch (error: any) {
      toast({
        title: t('add_subscriber.add_error_toast_title', 'Error Adding Subscriber'),
        description: error.message || t('add_subscriber.add_error_toast_desc', 'Could not add subscriber.'),
        variant: 'destructive',
      });
    }
  }, [router, toast, t, form]);

  // ----------------------
  // Render
  // ----------------------
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-base font-semibold">{t('add_subscriber.title')}</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{t('add_subscriber.card_title')}</CardTitle>
          <CardDescription className="text-xs">{t('add_subscriber.card_description')}</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Subscriber Type */}
              <FormField
                control={form.control}
                name="subscriber_type"
                render={({ field }) => (
                  <FormItem className="space-y-3 md:col-span-2">
                    <FormLabel>{t('add_subscriber.type_label')} <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-4"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Residential" />
                          </FormControl>
                          <FormLabel className="font-normal flex items-center gap-2 text-xs">
                            <User className={`${iconSize} text-muted-foreground`} /> {t('add_subscriber.type_residential')}
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Commercial" />
                          </FormControl>
                          <FormLabel className="font-normal flex items-center gap-2 text-xs">
                            <Building className={`${iconSize} text-muted-foreground`} /> {t('add_subscriber.type_commercial')}
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Residential Fields */}
              {subscriberType === 'Residential' && (
                <>
                  <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('add_subscriber.fullname_label')} <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder={t('add_subscriber.fullname_placeholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="birthday"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>{t('add_subscriber.birthday_label')} <span className="text-red-500">*</span></FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn("pl-3 text-left font-normal text-xs", !field.value && "text-muted-foreground")}
                              >
                                {field.value ? format(field.value, "PPP") : <span>{t('add_subscriber.birthday_placeholder')}</span>}
                                <CalendarIcon className={`ml-auto ${iconSize} opacity-50`} />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tax_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('add_subscriber.taxid_label')} <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder={t('add_subscriber.taxid_placeholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="id_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('add_subscriber.id_number_label')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('add_subscriber.id_number_placeholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {/* Commercial Fields */}
              {subscriberType === 'Commercial' && (
                <>
                  <FormField
                    control={form.control}
                    name="company_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('add_subscriber.company_name_label')} <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder={t('add_subscriber.company_name_placeholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="established_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>{t('add_subscriber.established_date_label')} <span className="text-red-500">*</span></FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn("pl-3 text-left font-normal text-xs", !field.value && "text-muted-foreground")}
                              >
                                {field.value ? format(field.value, "PPP") : <span>{t('add_subscriber.established_date_placeholder')}</span>}
                                <CalendarIcon className={`ml-auto ${iconSize} opacity-50`} />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date > new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tax_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('add_subscriber.cnpj_label')} <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder={t('add_subscriber.cnpj_placeholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="business_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('add_subscriber.state_registration_label')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('add_subscriber.state_registration_placeholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {/* Shared Fields */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>{t('add_subscriber.address_label')} <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder={t('add_subscriber.address_placeholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="point_of_reference"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>{t('add_subscriber.point_of_reference_label')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('add_subscriber.point_of_reference_placeholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('add_subscriber.email_label')} <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input type="email" placeholder={t('add_subscriber.email_placeholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('add_subscriber.phone_label')} <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder={t('add_subscriber.phone_placeholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mobile_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('add_subscriber.mobile_label')}</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder={t('add_subscriber.mobile_placeholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="signup_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t('add_subscriber.signup_date_label')}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn("pl-3 text-left font-normal text-xs", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP") : <span>{t('add_subscriber.signup_date_placeholder')}</span>}
                            <CalendarIcon className={`ml-auto ${iconSize} opacity-50`} />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button type="submit" disabled={!subscriberType || form.formState.isSubmitting}>
                {form.formState.isSubmitting ? <Loader2 className={`mr-2 ${iconSize} animate-spin`} /> : <Save className={`mr-2 ${iconSize}`} />}
                {t('add_subscriber.save_button')}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
