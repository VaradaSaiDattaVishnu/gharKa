import React from 'react';
import { OrderStatus } from '@gharka/shared';
import { Badge } from '../ui/Badge';

type BadgeVariant = 'turmeric' | 'coriander' | 'terracotta' | 'info' | 'warning' | 'error' | 'muted';

const statusConfig: Record<OrderStatus, { label: string; variant: BadgeVariant }> = {
  [OrderStatus.PLACED]: { label: 'Placed', variant: 'info' },
  [OrderStatus.CONFIRMED]: { label: 'Confirmed', variant: 'turmeric' },
  [OrderStatus.READY]: { label: 'Ready', variant: 'coriander' },
  [OrderStatus.PICKED_UP]: { label: 'Picked Up', variant: 'coriander' },
  [OrderStatus.COMPLETED]: { label: 'Completed', variant: 'muted' },
  [OrderStatus.CANCELLED]: { label: 'Cancelled', variant: 'error' },
};

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md';
}

export function OrderStatusBadge({ status, size = 'md' }: OrderStatusBadgeProps) {
  const config = statusConfig[status] ?? { label: status, variant: 'muted' as BadgeVariant };
  return <Badge label={config.label} variant={config.variant} size={size} />;
}
