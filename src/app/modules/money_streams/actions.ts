import {MoneyStream} from "modules/money_streams/types";
import types from './types';

export function updateMoneyStream(moneyStream: Partial<MoneyStream>) {
  return {
    type: types.UPDATE_MONEY_STREAM,
    payload: moneyStream
  };
}

export function openMoneyStream() {
  return {
    type: types.OPEN_MONEY_STREAM,
  };
}

export function closeMoneyStream(moneyStreamId: number) {
  return {
    type: types.CLOSE_MONEY_STREAM,
    payload: { moneyStreamId },
  };
}
