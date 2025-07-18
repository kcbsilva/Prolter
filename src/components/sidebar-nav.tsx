// src/components/sidebar-nav.tsx
'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import type { SidebarNavItem } from '@/config/sidebarNav';
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSubContent,
  SidebarMenuSubTrigger,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { useLocale } from '@/contexts/LocaleContext';

interface SidebarNavProps {
  items: SidebarNavItem[];
  isSubMenu?: boolean;
}

const iconSize = 'h-3.5 w-3.5';

const SidebarNav: React.FC<SidebarNavProps> = ({ items = [], isSubMenu = false }) => {
  const pathname = usePathname();
  const { t } = useLocale();

  const isLinkActive = (currentPath: string, href?: string): boolean => {
    if (!href) return false;
    const cleanHref = href.split('?')[0];
    const cleanPathname = currentPath.split('?')[0];
    if (cleanHref === '/') return cleanPathname === '/';
    return cleanPathname === cleanHref || cleanPathname.startsWith(cleanHref + '/');
  };

  const isBranchActive = (item: SidebarNavItem): boolean => {
    if (item.href && isLinkActive(pathname, item.href)) return true;
    return item.children?.some(child => isBranchActive(child)) ?? false;
  };

  const renderItem = (item: SidebarNavItem, index: number) => {
    const key = item.title ? `${t(item.title)}-${index}` : `sep-${index}`;

    if (item.isSeparator) return <SidebarSeparator key={key} />;

    const IconComponent = item.icon as React.ElementType | undefined;
    const icon = IconComponent ? (
      <IconComponent
        className={`${iconSize} ${isSubMenu ? 'text-muted-foreground' : ''}`}
      />
    ) : null;

    if (item.children?.length) {
      const branchIsActive = isBranchActive(item);
      const [isOpen, setIsOpen] = React.useState(branchIsActive);

      React.useEffect(() => {
        if (branchIsActive) setIsOpen(true);
      }, [branchIsActive]);

      return (
        <SidebarMenuItem key={key}>
          <div>
            <SidebarMenuSubTrigger
              onClick={() => setIsOpen(prev => !prev)}
              tooltip={t(item.tooltip || item.title)}
              isActive={branchIsActive}
              size={isSubMenu ? 'sm' : 'default'}
              data-state={isOpen ? 'open' : 'closed'} // here is the fix: use data-state instead of isOpen
            >
              {icon}
              <span className="truncate">{t(item.title)}</span>
              <ChevronDown className={iconSize} />
            </SidebarMenuSubTrigger>
            {isOpen && (
              <SidebarMenuSubContent isOpen={isOpen}>
                <SidebarNav items={item.children} isSubMenu />
              </SidebarMenuSubContent>
            )}
          </div>
        </SidebarMenuItem>
      );
    }

    return (
      <SidebarMenuItem key={key}>
        <SidebarMenuButton
          href={item.href || '#'}
          isActive={isLinkActive(pathname, item.href)}
          tooltip={t(item.tooltip || item.title)}
          size={isSubMenu ? 'sm' : 'default'}
        >
          {icon}
          <span className="truncate">{t(item.title)}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <div className="bg-background border-r border-[#14213D] h-full">
      {items.map(renderItem)}
    </div>
  );
};

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export default SidebarNav;
