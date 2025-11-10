/**
 * VirtualizedList Component
 *
 * Virtual scrolling component for efficiently rendering large lists
 * Only renders items that are visible in the viewport
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface VirtualizedListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  overscan?: number; // Number of items to render outside viewport
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  gap?: number;
  onEndReached?: () => void;
  endReachedThreshold?: number;
}

export function VirtualizedList<T>({
  items,
  itemHeight,
  containerHeight,
  overscan = 5,
  renderItem,
  className,
  gap = 0,
  onEndReached,
  endReachedThreshold = 100,
}: VirtualizedListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate visible range
  const totalHeight = items.length * (itemHeight + gap);
  const startIndex = Math.max(0, Math.floor(scrollTop / (itemHeight + gap)) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / (itemHeight + gap)) + overscan
  );
  const visibleItems = items.slice(startIndex, endIndex + 1);
  const offsetY = startIndex * (itemHeight + gap);

  // Handle scroll
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.currentTarget;
      setScrollTop(target.scrollTop);

      // Check if reached end
      if (onEndReached) {
        const { scrollTop, scrollHeight, clientHeight } = target;
        if (scrollHeight - scrollTop - clientHeight < endReachedThreshold) {
          onEndReached();
        }
      }
    },
    [onEndReached, endReachedThreshold]
  );

  return (
    <div
      ref={containerRef}
      className={cn('overflow-auto', className)}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            top: offsetY,
            left: 0,
            right: 0,
          }}
        >
          {visibleItems.map((item, index) => (
            <div
              key={startIndex + index}
              style={{
                height: itemHeight,
                marginBottom: gap,
              }}
            >
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * VirtualizedGrid Component
 *
 * Virtual scrolling for grid layouts (product catalogs)
 */
interface VirtualizedGridProps<T> {
  items: T[];
  itemHeight: number;
  itemsPerRow: number;
  containerHeight: number;
  overscan?: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  gap?: number;
  onEndReached?: () => void;
  endReachedThreshold?: number;
}

export function VirtualizedGrid<T>({
  items,
  itemHeight,
  itemsPerRow,
  containerHeight,
  overscan = 2,
  renderItem,
  className,
  gap = 16,
  onEndReached,
  endReachedThreshold = 100,
}: VirtualizedGridProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate rows
  const totalRows = Math.ceil(items.length / itemsPerRow);
  const rowHeight = itemHeight + gap;
  const totalHeight = totalRows * rowHeight;

  // Calculate visible rows
  const startRow = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const endRow = Math.min(
    totalRows - 1,
    Math.ceil((scrollTop + containerHeight) / rowHeight) + overscan
  );

  // Get visible items
  const startIndex = startRow * itemsPerRow;
  const endIndex = Math.min(items.length - 1, (endRow + 1) * itemsPerRow - 1);
  const visibleItems = items.slice(startIndex, endIndex + 1);
  const offsetY = startRow * rowHeight;

  // Handle scroll
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.currentTarget;
      setScrollTop(target.scrollTop);

      // Check if reached end
      if (onEndReached) {
        const { scrollTop, scrollHeight, clientHeight } = target;
        if (scrollHeight - scrollTop - clientHeight < endReachedThreshold) {
          onEndReached();
        }
      }
    },
    [onEndReached, endReachedThreshold]
  );

  // Group items into rows
  const rows: T[][] = [];
  for (let i = 0; i < visibleItems.length; i += itemsPerRow) {
    rows.push(visibleItems.slice(i, i + itemsPerRow));
  }

  return (
    <div
      ref={containerRef}
      className={cn('overflow-auto', className)}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            top: offsetY,
            left: 0,
            right: 0,
          }}
        >
          {rows.map((row, rowIndex) => (
            <div
              key={startRow + rowIndex}
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${itemsPerRow}, 1fr)`,
                gap: gap,
                marginBottom: gap,
              }}
            >
              {row.map((item, colIndex) => (
                <div
                  key={startIndex + rowIndex * itemsPerRow + colIndex}
                  style={{ height: itemHeight }}
                >
                  {renderItem(item, startIndex + rowIndex * itemsPerRow + colIndex)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Hook for calculating responsive items per row
 */
export function useResponsiveItemsPerRow(breakpoints: {
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  '2xl'?: number;
}) {
  const [itemsPerRow, setItemsPerRow] = useState(breakpoints.md || 2);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width >= 1536 && breakpoints['2xl']) {
        setItemsPerRow(breakpoints['2xl']);
      } else if (width >= 1280 && breakpoints.xl) {
        setItemsPerRow(breakpoints.xl);
      } else if (width >= 1024 && breakpoints.lg) {
        setItemsPerRow(breakpoints.lg);
      } else if (width >= 768 && breakpoints.md) {
        setItemsPerRow(breakpoints.md);
      } else if (width >= 640 && breakpoints.sm) {
        setItemsPerRow(breakpoints.sm);
      } else {
        setItemsPerRow(1);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [breakpoints]);

  return itemsPerRow;
}
