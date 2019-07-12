import {LightningNode} from 'lib/lnd-http';

export interface MoneyStream {
  id: string;
  title: string;
  to : LightningNode;
  max_amount: number;
  used_amount: number;
  amount_per_unit: number;
  payment_interval: number;
  payment_interval_unit: 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';
  created_at: number; // Unix timestamp
}

export const intervalUnits = [
  'second',
  'minute',
  'hour',
  'day',
  'week',
  'month',
  'year',
];

enum MoneyStreamTypes {
    OPEN_MONEY_STREAM = 'OPEN_MONEY_STREAM',
    UPDATE_MONEY_STREAM = 'UPDATE_MONEY_STREAM',
    CLOSE_MONEY_STREAM = 'CLOSE_MONEY_STREAM',
}

export default MoneyStreamTypes;
