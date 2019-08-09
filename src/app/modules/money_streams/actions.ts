import {MoneyStream} from "modules/money_streams/types";
import types from './types';

export function updateMoneyStream(moneyStream: Partial<MoneyStream>) {
  return {
    type: types.UPDATE_MONEY_STREAM,
    payload: moneyStream
  };
}

export function createMoneyStream(moneyStream: MoneyStream) {
  return {
    type: types.CREATE_MONEY_STREAM,
    payload: moneyStream
  };
}

export function deleteMoneyStream(moneyStream: MoneyStream) {
  return {
    type: types.DELETE_MONEY_STREAM,
    payload: moneyStream,
  };
}

export function setSyncedMoneyStreams(moneyStreams: MoneyStream[]) {
  return {
    type: types.SET_SYNCED_MONEY_STREAMS,
    payload: moneyStreams,
  };
}
