// tslint:disable no-empty-interface
import { combineReducers } from 'redux';
import crypto, { CryptoState, INITIAL_STATE as cryptoInitialState } from 'modules/crypto';
import sync, { SyncState, INITIAL_STATE as syncInitialState } from 'modules/sync';
import node, { NodeState, INITIAL_STATE as nodeInitialState } from 'modules/node';
import channels, {
  ChannelsState,
  INITIAL_STATE as channelsInitialState,
} from 'modules/channels';
import account, {
  AccountState,
  INITIAL_STATE as accountInitialState,
} from 'modules/account';
import payment, {
  PaymentState,
  INITIAL_STATE as paymentInitialState,
} from 'modules/payment/reducers';
import settings, {
  SettingsState,
  INITIAL_STATE as settingsInitialState,
} from 'modules/settings';
import rates, { RatesState, INITIAL_STATE as ratesInitialState } from 'modules/rates';
import peers, { PeersState, INITIAL_STATE as peersInitialState } from 'modules/peers';
import sign, { SignState, INITIAL_STATE as signInitialState } from 'modules/sign';
import moneyStreams, {INITIAL_STATE as moneyStreamInitialState } from 'modules/money_streams';
import onchain, {
  OnChainState,
  INITIAL_STATE as onchainInitialState,
} from 'modules/onchain';
import {MoneyStreamsState} from 'modules/money_streams/reducers';

export interface AppState {
  crypto: CryptoState;
  sync: SyncState;
  node: NodeState;
  channels: ChannelsState;
  moneyStreams: MoneyStreamsState;
  account: AccountState;
  payment: PaymentState;
  settings: SettingsState;
  rates: RatesState;
  peers: PeersState;
  sign: SignState;
  onchain: OnChainState;
}

export const combineInitialState: Partial<AppState> = {
  crypto: cryptoInitialState,
  sync: syncInitialState,
  node: nodeInitialState,
  channels: channelsInitialState,
  moneyStreams: moneyStreamInitialState,
  account: accountInitialState,
  payment: paymentInitialState,
  settings: settingsInitialState,
  rates: ratesInitialState,
  peers: peersInitialState,
  sign: signInitialState,
  onchain: onchainInitialState,
};

export default combineReducers<AppState>({
  crypto,
  sync,
  node,
  channels,
  moneyStreams,
  account,
  payment,
  settings,
  rates,
  peers,
  sign,
  onchain,
});
