// src/components/subscribers/profile/InformationTab.tsx
'use client';

import * as React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLocale } from '@/contexts/LocaleContext';
import { cn } from '@/lib/utils';
import { User, Briefcase, CalendarDays, Fingerprint, Home, Landmark, PhoneCall, Smartphone, Mail, MapPinIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr as frLocale, ptBR as ptBRLocale, enUS as enUSLocale } from 'date-fns/locale';
import type { Subscriber } from '@/types/subscribers';

const dateLocales = { en: enUSLocale, fr: frLocale, pt: ptBRLocale };

const OverviewDetailItem: React.FC<{ icon: React.ElementType, label: string, value?: string | null | Date }> = ({ icon: Icon, label, value }) => {
  const { locale } = useLocale();
  const iconSize = "h-3 w-3";
  return (
    <div className="flex items-start gap-3">
      <Icon className={`${iconSize} text-muted-foreground mt-1`} />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-xs font-medium">
          {value instanceof Date ? format(value, 'PP', { locale: dateLocales[locale] || enUSLocale }) : (value || '—')}
        </p>
      </div>
    </div>
  );
};

const Section: React.FC<{ title: string, icon: React.ElementType, children: React.ReactNode }> = ({ title, icon: Icon, children }) => {
  const iconSize = "h-3 w-3";
  return (
    <fieldset className="border border-border rounded-md p-4 pt-2 space-y-4">
      <legend className="text-sm font-semibold px-2 flex items-center gap-2">
        <Icon className={`${iconSize} text-primary`} />
        {title}
      </legend>
      {children}
    </fieldset>
  );
};

export const InformationTab: React.FC<{ subscriber: Subscriber }> = ({ subscriber }) => {
  const { t, locale } = useLocale();
  const iconSize = "h-3 w-3";

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <div className="grid md:grid-cols-2 gap-6">
          <Section title={t('subscriber_profile.personal_info_section')} icon={subscriber.subscriberType === 'Residential' ? User : Briefcase}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <OverviewDetailItem icon={User} label={t('subscriber_profile.overview_name')} value={subscriber.subscriberType === 'Residential' ? subscriber.fullName : subscriber.companyName} />
              {subscriber.subscriberType === 'Residential' && subscriber.birthday && (
                <OverviewDetailItem icon={CalendarDays} label={t('subscriber_profile.overview_birthday')} value={subscriber.birthday} />
              )}
              {subscriber.subscriberType === 'Commercial' && subscriber.establishedDate && (
                <OverviewDetailItem icon={CalendarDays} label={t('subscriber_profile.overview_established_date')} value={subscriber.establishedDate} />
              )}
              <OverviewDetailItem icon={Fingerprint} label={subscriber.subscriberType === 'Residential' ? t('subscriber_profile.overview_tax_id') : t('subscriber_profile.overview_business_number')} value={subscriber.subscriberType === 'Residential' ? subscriber.taxId : subscriber.businessNumber} />
              <OverviewDetailItem icon={CalendarDays} label={t('subscriber_profile.overview_signup_date')} value={subscriber.signupDate} />
            </div>
          </Section>

          <Section title={t('subscriber_profile.contact_info_section')} icon={PhoneCall}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <OverviewDetailItem icon={PhoneCall} label={t('subscriber_profile.overview_phone')} value={subscriber.phoneNumber} />
              {subscriber.mobileNumber && <OverviewDetailItem icon={Smartphone} label={t('subscriber_profile.overview_landline')} value={subscriber.mobileNumber} />}
              <OverviewDetailItem icon={Mail} label={t('subscriber_profile.overview_email')} value={subscriber.email} />
            </div>
          </Section>
        </div>

        <Section title={t('subscriber_profile.address_section')} icon={MapPinIcon}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <OverviewDetailItem icon={Home} label={t('subscriber_profile.overview_address')} value={subscriber.address} />
            <OverviewDetailItem icon={Landmark} label={t('subscriber_profile.overview_point_of_reference')} value={subscriber.pointOfReference} />
          </div>
        </Section>
      </CardContent>
    </Card>
  );
};
