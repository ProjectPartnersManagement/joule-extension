import {Store, createStore, applyMiddleware, Middleware} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {composeWithDevTools} from 'remote-redux-devtools';
import rootReducer, {AppState, combineInitialState} from './reducers';
import rootSaga from './sagas';
import {browser} from "webextension-polyfill-ts/src/generated/index";

const sagaMiddleware = createSagaMiddleware();
const rebroadcastMiddleware: Middleware = () => {
    return (next) => {
        return (action) => {
            // If this is a store instance belonging to a content script, let WebLN know about this store change. That's important
            // for when a user starts/stops a money stream and wants his frontend to react to these changes.
            if (action.type.includes('MONEY_STREAM')) {
                browser.runtime.sendMessage({
                    application: 'Joule',
                    isStoreBroadcast: true,
                    action,
                    moneyStreamId: action.payload.id
                });
            }

            return next(action);
        };
    };
};

const bindMiddleware = (middleware: any) => {
    if (process.env.NODE_ENV !== 'production') {
        const {createLogger} = require('redux-logger');
        const logger = createLogger({
            collapsed: true,
        });
        middleware = [...middleware, logger];
    }
    return composeWithDevTools(applyMiddleware(...middleware));
};

export function configureStore(initialState: Partial<AppState> = combineInitialState) {
    const store: Store<AppState> = createStore(
        rootReducer,
        initialState,
        bindMiddleware([sagaMiddleware, rebroadcastMiddleware]),
    );

    sagaMiddleware.run(rootSaga);

    // Listen for changes to Money Streams. Those changes must occur in all open Joule windows.
    browser.runtime.onMessage.addListener((request: any) => {
        // Only handle Joule-internal requests that contain redux action data.
        // If the request is a store broadcast already, do not apply the action a second time. A store broadcast
        // is fired from the extension to the content script in order to inform WebLN about changes in a money stream
        // resulting from changes within the extension.
        if (!request || request.application !== 'Joule' || !request.action || request.isStoreBroadcast) return;

        // Note the change in this window's store as well.
        store.dispatch(request.action);
    });


    return {store, persistor: null};
}
