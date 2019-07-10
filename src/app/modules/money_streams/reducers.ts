import {MoneyStream} from './types';

export interface MoneyStreamsState {
  moneyStreams: MoneyStream[];
}

export const INITIAL_STATE: MoneyStreamsState = {
    moneyStreams : [
        {
            id                    : 'abcdefg',
            title                 : 'Playboy.de',
            to                    : {
                pub_key     : 'PUBLIC_KEY',
                addresses   : [{
                    network : 'bitcoin',
                    addr    : 'ADDRESS_1'
                }],
                alias       : 'Burda Media',
                color       : '#00b0f0',
                last_update : 1562765210,
            },
            max_amount            : 10000,
            used_amount           : 5000,
            amount_per_unit       : 25,
            payment_interval      : 5,
            payment_interval_unit : 'second',
            created_at            : 1562765210, // Unix timestamp
        },
    ]
};

export default function moneyStreamsReducers(
  state: MoneyStreamsState = INITIAL_STATE,
  action: any,
): MoneyStreamsState {
  switch (action.type) {
    case 'GET_MONEY_STREAMS':
      return {
        ...state,
      };

      // TODO Implement opening a money stream
    case 'OPEN_MONEY_STREAM':
      return {
        ...state,
      };

      // TODO Implement closing a money stream
    case 'CLOSE_CHANNEL':
      return {
        ...state,
      };
  }

  return state;
}
