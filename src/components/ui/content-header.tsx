// src/components/ui/content-header.tsx
'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { Card, CardContent } from '@/components/shared/ui/card';
import { Input } from '@/components/shared/ui/input';
import { Button } from '@/components/shared/ui/button';
import { Plus, Search, Trash2 } from 'lucide-react';
import { sidebarNav } from '@/config/sidebarNav';
import { useLocale } from '@/contexts/LocaleContext';
import { cn } from '@/lib/utils';
import { AddEntityModal } from '@/components/ui/modals/AddEntityModal';
import { z, ZodObject, ZodRawShape } from 'zod';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/shared/ui/tooltip';

function singularize(word: string) {
  if (word.endsWith('ies')) return word.replace(/ies$/, 'y');
  if (word.endsWith('s')) return word.slice(0, -1);
  return word;
}

function findNavItem(
  pathname: string,
  items: typeof sidebarNav
): { title?: string; icon?: any } | null {
  for (const item of items) {
    if (item.href && pathname.startsWith(item.href)) {
      return { title: item.title, icon: item.icon };
    }
    if (item.children) {
      const childMatch = findNavItem(pathname, item.children);
      if (childMatch) return childMatch;
    }
  }
  return null;
}

interface FieldConfig {
  name: string;
  label: string;
  type?: string;
}

interface ContentHeaderProps<T extends ZodRawShape = ZodRawShape> {
  title?: string;
  searchPlaceholder?: string;
  addLabel?: string;
  onSearchChange?: (value: string) => void;
  showSearch?: boolean;
  showAddButton?: boolean;
  className?: string;

  schema?: ZodObject<T>;
  fields?: FieldConfig[];
  onAddEntitySubmit?: (data: z.infer<ZodObject<T>>) => void;

  checkedCount?: number;
  onRemoveClick?: () => void;
}

export function ContentHeader<T extends ZodRawShape>({
  title,
  searchPlaceholder,
  addLabel,
  onSearchChange,
  showSearch = true,
  showAddButton = true,
  className,
  schema,
  fields,
  onAddEntitySubmit,
  checkedCount = 0,
  onRemoveClick,
}: ContentHeaderProps<T>) {
  const pathname = usePathname();
  const { t } = useLocale();
  const matched = findNavItem(pathname, sidebarNav);

  const translationKey = matched?.title || '';
  const fallbackTitle = translationKey.replace(/^sidebar\./, '').replace(/_/g, ' ');
  const translatedTitle = title || t(translationKey, fallbackTitle.replace(/\b\w/g, (l) => l.toUpperCase()));
  const singularTitle = singularize(translatedTitle);
  const Icon = matched?.icon;

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <>
      <Card className={cn('w-full', className)}>
        <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 p-1">
          <div className="flex items-center gap-1 text-lg font-semibold">
            {Icon && <Icon className="h-5 w-5 text-primary" />}
            {translatedTitle}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full sm:w-auto">
            {showSearch && (
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={
                    searchPlaceholder ||
                    t(`${translationKey}_search_placeholder`, `Search ${translatedTitle}`)
                  }
                  className="pl-8"
                  onChange={(e) => onSearchChange?.(e.target.value)}
                />
              </div>
            )}

            {showAddButton && schema && fields && onAddEntitySubmit && (
              <Button onClick={() => setIsModalOpen(true)} className="whitespace-nowrap">
                <Plus className="h-4 w-4 mr-2" />
                {addLabel || t(`${translationKey}_add_button`, `Add ${singularTitle}`)}
              </Button>
            )}

            {onRemoveClick && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={checkedCount === 0}
                    onClick={onRemoveClick}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t(`${translationKey}_remove_button`, 'Remove')}</TooltipContent>
              </Tooltip>
            )}
          </div>
        </CardContent>
      </Card>

      {schema && fields && onAddEntitySubmit && (
        <AddEntityModal
          entityName={singularTitle}
          schema={schema}
          fields={fields}
          onSubmit={onAddEntitySubmit}
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          showTrigger={false}
        />
      )}
    </>
  );
}
