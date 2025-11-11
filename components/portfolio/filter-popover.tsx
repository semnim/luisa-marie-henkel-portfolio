'use client';

import { cn } from '@/lib/utils';
import * as Popover from '@radix-ui/react-popover';

interface FilterPopoverProps {
  categories: string[];
  years: number[];
  numResults: number;
  activeCategories: Set<string>;
  activeYears: Set<number>;
  onToggleCategory: (category: string) => void;
  onToggleYear: (year: number) => void;
}

export function FilterPopover({
  categories,
  years,
  activeCategories,
  activeYears,
  numResults,
  onToggleCategory,
  onToggleYear,
}: FilterPopoverProps) {
  return (
    <Popover.Root>
      <Popover.Trigger className="text-sm md:text-base hover:text-muted-foreground transition-colors">
        ({numResults}) Filter
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="end"
          className="w-auto p-4 space-y-3 bg-background border border-border rounded-md shadow-lg z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 min-w-64"
          sideOffset={5}
        >
          {/* Categories */}
          <p className="font-light text-muted-foreground text-sm">Categories</p>
          <div className="flex flex-col gap-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onToggleCategory(cat)}
                className={cn(
                  'capitalize transition-colors hover:opacity-80 text-xs text-left pl-2',
                  activeCategories.has(cat)
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Years */}
          <p className="font-light text-muted-foreground text-sm">Year</p>
          <div className="flex gap-4 flex-wrap">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => onToggleYear(year)}
                className={cn(
                  'transition-colors hover:opacity-80 text-xs text-left pl-2',
                  activeYears.has(year)
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                )}
              >
                {year}
              </button>
            ))}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
