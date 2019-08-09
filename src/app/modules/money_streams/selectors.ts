import {AppState} from "store/reducers";

export function getSyncedMoneyStreams(state: AppState) {
    return state.moneyStreams.moneyStreams;
}
