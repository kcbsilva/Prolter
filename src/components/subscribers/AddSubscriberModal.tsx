// src/components/subscribers/AddSubscriberModal.tsx
'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { CalendarIcon, User, Building, Save, Loader2, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useLocale } from '@/contexts/LocaleContext';
import type { SubscriberData } from '@/types/subscribers';
import confetti from 'canvas-confetti';

export type AddSubscriberModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

const subscriberSchema = z
  .object({
    subscriber_type: z.enum(['Residential', 'Commercial']),
    full_name: z.string().optional(),
    company_name: z.string().optional(),
    birthday: z.date().optional(),
    established_date: z.date().optional(),
    address: z.string().min(1),
    point_of_reference: z.string().optional(),
    email: z.string().email(),
    phone_number: z.string().min(1),
    mobile_number: z.string().optional(),
    tax_id: z.string().optional(),
    business_number: z.string().optional(),
    id_number: z.string().optional(),
  })
  .refine((d) => d.subscriber_type !== 'Residential' || (d.full_name && d.full_name.length > 0), {
    message: 'Full Name is required for Residential subscribers.',
    path: ['full_name'],
  })
  .refine((d) => d.subscriber_type !== 'Residential' || d.birthday, {
    message: 'Birthday is required for Residential subscribers.',
    path: ['birthday'],
  })
  .refine((d) => d.subscriber_type !== 'Residential' || (d.tax_id && d.tax_id.length > 0), {
    message: 'Tax ID is required for Residential subscribers.',
    path: ['tax_id'],
  })
  .refine(
    (d) => d.subscriber_type !== 'Commercial' || (d.company_name && d.company_name.length > 0),
    {
      message: 'Company Name is required for Commercial subscribers.',
      path: ['company_name'],
    }
  )
  .refine((d) => d.subscriber_type !== 'Commercial' || d.established_date, {
    message: 'Established Date is required for Commercial subscribers.',
    path: ['established_date'],
  })
  .refine((d) => d.subscriber_type !== 'Commercial' || (d.tax_id && d.tax_id.length > 0), {
    message: 'CNPJ (Tax ID) is required for Commercial subscribers.',
    path: ['tax_id'],
  });

export type SubscriberFormData = z.infer<typeof subscriberSchema>;

export function AddSubscriberModal({ open, onClose, onSuccess }: AddSubscriberModalProps) {
  const { toast } = useToast();
  const { t } = useLocale();
  const iconSize = 'h-4 w-4';
  const [step, setStep] = React.useState(1);

  const form = useForm<SubscriberFormData>({
    resolver: zodResolver(subscriberSchema),
    defaultValues: {
      subscriber_type: undefined,
      address: '',
      email: '',
      phone_number: '',
    },
  });

  const subscriberType = form.watch('subscriber_type');

  const renderDateField = (name: keyof SubscriberFormData, label: string) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !field.value && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {field.value
                    ? format(
                      typeof field.value === 'string'
                        ? new Date(field.value)
                        : field.value,
                      'PPP'
                    )
                    : t('add_subscriber.pick_date', 'Pick a date')}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={
                  typeof field.value === 'string'
                    ? new Date(field.value)
                    : field.value
                }
                onSelect={field.onChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  const onSubmit = async (data: SubscriberFormData) => {
    try {
      const payload: SubscriberData = {
        ...data,
        birthday: data.birthday ?? null,
        established_date: data.established_date ?? null,
      };

      const res = await fetch('/api/subscribers/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Unknown error occurred.');
      }

      toast({
        title: t('add_subscriber.add_success_toast_title', 'Subscriber added'),
        description: t(
          'add_subscriber.add_success_toast_description',
          'The subscriber was saved successfully.'
        ),
      });

      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });

      form.reset();
      setStep(1);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast({
        title: t('add_subscriber.add_error_toast_title', 'Error Adding Subscriber'),
        description:
          err.message ||
          t('add_subscriber.add_error_toast_desc', 'Could not add subscriber.'),
        variant: 'destructive',
      });
    }
  };

  const nextStep = async () => {
    console.log('nextStep called, current step:', step);
    console.log('subscriberType:', subscriberType);
    
    let fieldsToValidate: (keyof SubscriberFormData)[] = [];
  
    if (step === 1) {
      fieldsToValidate = ['subscriber_type'];
    } else if (step === 2) {
      // Validate step 2 fields based on subscriber type
      if (subscriberType === 'Residential') {
        fieldsToValidate = ['full_name', 'birthday', 'tax_id'];
      } else if (subscriberType === 'Commercial') {
        fieldsToValidate = ['company_name', 'established_date', 'tax_id'];
      }
    }
  
    console.log('Fields to validate:', fieldsToValidate);
    console.log('Current form values:', form.getValues());
    
    const valid = await form.trigger(fieldsToValidate);
    console.log('Validation result:', valid);
    
    if (!valid) {
      console.log('Validation failed, form errors:', form.formState.errors);
      return;
    }
    
    console.log('Moving to next step');
    setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const isFinalStep = step === 3;

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-2xl bg-background border shadow-xl">
        <DialogHeader />

        <div className="flex items-center justify-between px-4 pb-6">
          {[
            { step: 1, label: 'Type' },
            { step: 2, label: 'Personal' },
            { step: 3, label: 'Contact' },
          ].map(({ step: s, label }, index, arr) => (
            <React.Fragment key={s}>
              <div className="flex flex-col items-center gap-1 min-w-[60px]">
                <div
                  className={cn(
                    'w-6 h-6 rounded-full border-2 transition-colors flex items-center justify-center',
                    step === s
                      ? 'bg-primary border-primary'
                      : step > s
                        ? 'bg-green-500 border-green-500'
                        : 'bg-muted border-border'
                  )}
                >
                  {step > s && <Check className="w-4 h-4 text-white" />}
                </div>
                <span
                  className={cn(
                    'text-xs text-center',
                    step === s ? 'text-primary font-medium' : 'text-muted-foreground'
                  )}
                >
                  {label}
                </span>
              </div>
              {index < arr.length - 1 && (
                <div className="flex-1 h-[2px] bg-border mx-2" />
              )}
            </React.Fragment>
          ))}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            {step === 1 && (
              <FormField
                control={form.control}
                name="subscriber_type"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-col space-y-2"
                      >
                        {[
                          {
                            value: 'Residential',
                            label: t('add_subscriber.type_residential', 'Residential'),
                            icon: <User className={iconSize} />,
                          },
                          {
                            value: 'Commercial',
                            label: t('add_subscriber.type_commercial', 'Commercial'),
                            icon: <Building className={iconSize} />,
                          },
                        ].map(({ value, label, icon }) => (
                          <div key={value} className="flex items-center space-x-2">
                            <RadioGroupItem value={value} id={value} />
                            <label
                              htmlFor={value}
                              className="flex items-center gap-2 cursor-pointer rounded-lg border p-4 flex-1 transition-colors hover:bg-muted"
                            >
                              {icon}
                              <span className="text-sm font-medium">{label}</span>
                            </label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {step === 2 && (
              <>
                {subscriberType === 'Residential' && (
                  <>
                    <FormField
                      control={form.control}
                      name="full_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('add_subscriber.fullname_label', 'Full Name')}</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {renderDateField('birthday', t('add_subscriber.birthday_label', 'Birthday'))}
                  </>
                )}

                {subscriberType === 'Commercial' && (
                  <>
                    <FormField
                      control={form.control}
                      name="company_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('add_subscriber.company_name_label', 'Company Name')}</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {renderDateField('established_date', t('add_subscriber.established_date_label', 'Established Date'))}
                  </>
                )}

                <FormField
                  control={form.control}
                  name="tax_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('add_subscriber.tax_id_label', 'Tax ID')}</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {step === 3 && (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                      <FormLabel>{t('add_subscriber.phone_label', 'Phone Number')}</FormLabel>
                      <FormControl><Input type="tel" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mobile_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('add_subscriber.mobile_label', 'Mobile Number')}</FormLabel>
                      <FormControl><Input type="tel" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('add_subscriber.address_label', 'Address')}</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="business_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('add_subscriber.business_number_label', 'Business Number')}</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="id_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('add_subscriber.id_number_label', 'ID Number')}</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <DialogFooter className="pt-2 flex justify-between">
              <div>
                {step > 1 && (
                  <Button type="button" variant="outline" onClick={prevStep}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {t('add_subscriber.back_button', 'Back')}
                  </Button>
                )}
              </div>
              <div>
                {isFinalStep ? (
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? (
                      <Loader2 className={`mr-2 ${iconSize} animate-spin`} />
                    ) : (
                      <Save className={`mr-2 ${iconSize}`} />
                    )}
                    {t('add_subscriber.finish_button', 'Finish')}
                  </Button>
                ) : (
                  <Button type="button" onClick={nextStep}>
                    {t('add_subscriber.next_button', 'Next')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}