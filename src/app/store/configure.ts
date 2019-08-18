import { Store, createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'remote-redux-devtools';
import rootReducer, { AppState, combineInitialState } from './reducers';
import rootSaga from './sagas';
import {browser} from "webextension-polyfill-ts/src/generated/index";

const sagaMiddleware = createSagaMiddleware();

const bindMiddleware = (middleware: any) => {
  if (process.env.NODE_ENV !== 'production') {
    const { createLogger } = require('redux-logger');
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
    bindMiddleware([sagaMiddleware]),
  );

  sagaMiddleware.run(rootSaga);

  // Listen for changes to Money Streams. Those changes must occur in all open Joule windows.
  browser.runtime.onMessage.addListener((request: any) => {
      // Only handle Joule-internal requests that contain dispatch data.
      if(!request || request.application !== 'Joule' || !request.dispatchData) return;

      // Note the change in this window's store as well.
      store.dispatch(request.dispatchData);
  });


  return { store, persistor: null };
}
