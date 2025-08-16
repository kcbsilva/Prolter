// src/components/client/contracts/SignedFormBadge.tsx
'use client';

import * as React from 'react';
import { Badge } from '@/components/shared/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/shared/ui/tooltip';
import { Building2, Phone, MessageCircle, HelpCircle, FileText } from 'lucide-react';

export interface SignedFormBadgeProps {
  type: 'office' | 'telephone' | 'im' | 'unknown';
  details?: string;
  fileUrl?: string;
}

export function SignedFormBadge ({ type, details, fileUrl }: SignedFormBadgeProps) {
  const typeMap: Record<
    SignedFormBadgeProps['type'],
    { label: string; icon: React.ElementType; color: string }
  > = {
    office: {
      label: 'In Office',
      icon: Building2,
      color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    },
    telephone: {
      label: 'Telephone',
      icon: Phone,
      color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    },
    im: {
      label: 'Digital Consent',
      icon: MessageCircle,
      color: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    },
    unknown: {
      label: 'Unknown',
      icon: HelpCircle,
      color: 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300',
    },
  };

  const { label, icon: Icon, color } = typeMap[type];

  // Badge base element
  let badgeElement: React.ReactNode = (
    <Badge
      variant="secondary"
      className={`flex items-center gap-1 px-2 py-0.5 rounded-md ${color}`}
    >
      <Icon className="h-4 w-4" />
      <span className="text-xs font-medium">{label}</span>
      {fileUrl && <FileText className="h-3.5 w-3.5 ml-1 opacity-75" />}
    </Badge>
  );

  // Make badge a link if fileUrl exists
  if (fileUrl) {
    badgeElement = (
      <a
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block"
      >
        {badgeElement}
      </a>
    );
  }

  // Wrap with tooltip if details exist
  if (details) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{badgeElement}</TooltipTrigger>
        <TooltipContent side="top">
          <p>{details}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return <>{badgeElement}</>;
}
