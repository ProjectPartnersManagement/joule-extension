import {Store} from "redux";
import {AppState} from "store/reducers";
import {browser} from "webextension-polyfill-ts/src/generated/index";
import MoneyStreamTypes, {MoneyStream, MoneyStreamMessage} from "modules/money_streams/types";

export function handleMoneyStreamMessages(store: Store<AppState>) {
    const onMessage = (request: MoneyStreamMessage) => {
        console.log('Registered message in background script.', request);

        // Abort if this request does not originate from the Joule plugin or does not deal with money streams.
        if (!request || request.application !== 'Joule' || !request.moneyStreamId) return;

        const existingMoneyStream = getMoneyStreamById(store, request.moneyStreamId);
        if (!existingMoneyStream) {
            return Promise.reject(new Error(`Money Stream "${request.moneyStreamId}" does not exist.`));
        }

        // // Getting a money stream is possible without any dispatch event.
        // if (request.action === 'GET_MONEY_STREAM') {
        //     return Promise.resolve({moneyStream: existingMoneyStream});
        // }

        if (!MoneyStreamTypes[request.action]) {
            return Promise.reject(new Error(`Invalid Money Stream dispatch action "${request.action}".`));
        }

        const dispatchData = {
            type: request.action,
            payload: {
                ...request.payload,
                id: request.moneyStreamId
            }
        };
        store.dispatch(dispatchData);
        const updatedMoneyStream = getMoneyStreamById(store, request.moneyStreamId);

        // Let all applications know about the changed money stream.
        broadcastStoreChangeWithinExtension(dispatchData);

        return Promise.resolve({
            moneyStream: updatedMoneyStream
        });
    };

    // Listen to messages sent from the browser, usually from our content script.
    browser.runtime.onMessage.addListener(onMessage);
}

// Send a message to the other extension windows that might be open.
function broadcastStoreChangeWithinExtension(dispatchData: any) {
    browser.runtime.sendMessage({
        dispatchData,
        application: 'Joule',
    });
}

// function sendError(message: string) {
//     // Trigger the message
//     browser.runtime.sendMessage({
//         application: 'Joule',
//         error: new Error(message)
//     });
// }

function getMoneyStreamById(store: Store<AppState>, id: MoneyStream['id']): MoneyStream | undefined {
    const currentState = store.getState();
    return currentState.moneyStreams.moneyStreams.find(moneyStream => moneyStream.id === id);
}
