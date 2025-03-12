import { BillingPlan } from '../entities/subscription.entity';
import { addMonths, addYears } from 'date-fns';

export function calculateSubscriptionDates(plan: BillingPlan): {
  startDate: Date;
  endDate: Date;
  nextBillingDate: Date;
} {
  const startDate = new Date();

  let endDate: Date;
  if (plan === BillingPlan.MONTHLY) {
    endDate = addMonths(startDate, 1);
  } else if (plan === BillingPlan.YEARLY) {
    endDate = addYears(startDate, 1);
  } else if (plan === BillingPlan.QUARTERLY) {
    endDate = addMonths(startDate, 3);
  } else {
    throw new Error('Invalid Billing Plan');
  }

  return {
    startDate,
    endDate,
    nextBillingDate: endDate,
  };
}
