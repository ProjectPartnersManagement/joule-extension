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
  state : 'waitingForConfirmation' | 'open' | 'closed';
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
    CREATE_MONEY_STREAM = 'CREATE_MONEY_STREAM',
    UPDATE_MONEY_STREAM = 'UPDATE_MONEY_STREAM',
    DELETE_MONEY_STREAM = 'DELETE_MONEY_STREAM',
}

export default MoneyStreamTypes;
