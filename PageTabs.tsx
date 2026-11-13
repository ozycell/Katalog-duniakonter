/**
 * PageTabs Component - Standardized fixed tabs for pages
 * 
 * Features:
 * - Fixed position below header (56px)
 * - Base height: 56px, Button height: 40px
 * - 16px horizontal padding
 * - Solid background (supports dark/light mode)
 * - Full width within layout constraints
 * 
 * Usage:
 * <PageTabs
 *   tabs={[
 *     { value: 'member', label: 'Member', icon: Users },
 *     { value: 'bonus', label: 'Bonus', icon: Gift },
 *   ]}
 *   activeTab={activeTab}
 *   onChange={setActiveTab}
 * />
 */

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TabItem {
  value: string;
  label: string;
  icon?: React.ElementType;
}

export interface PageTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (value: string) => void;
  className?: string;
}

export function PageTabs({ tabs, activeTab, onChange, className }: PageTabsProps) {
  return (
    <div className="w-full bg-muted">
      <div className="max-w-md sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto">
        <div className={cn("flex gap-1 h-14 items-center px-4", className)}>
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.value}
                onClick={() => onChange(tab.value)}
                className={cn(
                  'flex-1 h-10 text-[0.875rem] font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5',
                  activeTab === tab.value
                    ? 'bg-background text-primary shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {TabIcon && <TabIcon className="h-4 w-4" />}
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
