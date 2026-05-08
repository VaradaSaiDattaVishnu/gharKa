import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  ShoppingBag,
  CheckCircle,
  ChefHat,
  Package,
  PartyPopper,
  XCircle,
} from 'lucide-react-native';
import { OrderStatus } from '@gharka/shared';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

const STEPS = [
  { status: OrderStatus.PLACED, label: 'Order Placed', icon: ShoppingBag },
  { status: OrderStatus.CONFIRMED, label: 'Confirmed', icon: CheckCircle },
  { status: OrderStatus.READY, label: 'Ready for Pickup', icon: ChefHat },
  { status: OrderStatus.PICKED_UP, label: 'Picked Up', icon: Package },
  { status: OrderStatus.COMPLETED, label: 'Completed', icon: PartyPopper },
];

const STATUS_ORDER: Record<string, number> = {
  [OrderStatus.PLACED]: 0,
  [OrderStatus.CONFIRMED]: 1,
  [OrderStatus.READY]: 2,
  [OrderStatus.PICKED_UP]: 3,
  [OrderStatus.COMPLETED]: 4,
  [OrderStatus.CANCELLED]: -1,
};

interface OrderTimelineProps {
  currentStatus: OrderStatus;
}

export function OrderTimeline({ currentStatus }: OrderTimelineProps) {
  const currentIndex = STATUS_ORDER[currentStatus] ?? -1;
  const isCancelled = currentStatus === OrderStatus.CANCELLED;

  return (
    <View style={styles.container}>
      {isCancelled ? (
        <View style={styles.cancelledContainer}>
          <View style={[styles.iconCircle, styles.iconCancelled]}>
            <XCircle size={20} color={colors.error} />
          </View>
          <Text style={[styles.label, styles.labelCancelled]}>Order Cancelled</Text>
        </View>
      ) : (
        STEPS.map((step, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;
          const isLast = index === STEPS.length - 1;
          const IconComponent = step.icon;

          return (
            <View key={step.status} style={styles.step}>
              <View style={styles.stepLeft}>
                <View
                  style={[
                    styles.iconCircle,
                    isCompleted ? styles.iconCompleted : styles.iconPending,
                    isCurrent && styles.iconCurrent,
                  ]}
                >
                  <IconComponent
                    size={16}
                    color={isCompleted ? colors.white : colors.ash}
                  />
                </View>
                {!isLast && (
                  <View
                    style={[
                      styles.line,
                      isCompleted && index < currentIndex
                        ? styles.lineCompleted
                        : styles.linePending,
                    ]}
                  />
                )}
              </View>
              <Text
                style={[
                  styles.label,
                  isCompleted ? styles.labelCompleted : styles.labelPending,
                  isCurrent && styles.labelCurrent,
                ]}
              >
                {step.label}
              </Text>
            </View>
          );
        })
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepLeft: {
    alignItems: 'center',
    width: 40,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCompleted: {
    backgroundColor: colors.coriander.DEFAULT,
  },
  iconPending: {
    backgroundColor: colors.mist,
  },
  iconCurrent: {
    backgroundColor: colors.turmeric.DEFAULT,
  },
  iconCancelled: {
    backgroundColor: '#FFEBEE',
  },
  line: {
    width: 2,
    height: 28,
  },
  lineCompleted: {
    backgroundColor: colors.coriander.DEFAULT,
  },
  linePending: {
    backgroundColor: colors.mist,
  },
  label: {
    ...typography.body,
    marginLeft: spacing.md,
    marginTop: spacing.sm,
  },
  labelCompleted: {
    color: colors.charcoal,
    fontFamily: 'Inter_600SemiBold',
  },
  labelPending: {
    color: colors.ash,
  },
  labelCurrent: {
    color: colors.turmeric.DEFAULT,
    fontFamily: 'Inter_600SemiBold',
  },
  labelCancelled: {
    color: colors.error,
    fontFamily: 'Inter_600SemiBold',
    marginLeft: spacing.md,
    marginTop: spacing.sm,
  },
  cancelledContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
