import {LightningNode} from 'lib/lnd-http';

export interface MoneyStream {
    id: string;
    title: string;
    to: LightningNode;
    max_amount: number;
    used_amount: number;
    amount_per_unit: number;
    payment_interval: number;
    payment_interval_unit: 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';
    state: 'waitingForConfirmation' | 'open' | 'closed' | 'paused';
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

// A message sent from the browser via WebLN to Joule.
export interface MoneyStreamMessage {
    application: 'Joule';
    moneyStreamId: MoneyStream['id'];
    action: MoneyStreamTypes;
    payload: any;
}

enum MoneyStreamTypes {
    GET_MONEY_STREAM = 'GET_MONEY_STREAM',
    CREATE_MONEY_STREAM = 'CREATE_MONEY_STREAM',
    UPDATE_MONEY_STREAM = 'UPDATE_MONEY_STREAM',
    DELETE_MONEY_STREAM = 'DELETE_MONEY_STREAM',
    SET_SYNCED_MONEY_STREAMS = 'SET_SYNCED_MONEY_STREAMS',
}

export default MoneyStreamTypes;
