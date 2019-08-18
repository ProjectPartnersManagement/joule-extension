import handlePrompts from './handlePrompts';
import handlePassword from './handlePassword';
import handleContextMenu from './handleContextMenu';
import {configureStore} from "store/configure";
import {handleMoneyStreamMessages} from "./handleMoneyStreamMessages";

const {store} = configureStore();

function initBackground() {
  handlePrompts();
  handlePassword();
  handleContextMenu();
  // Handles events coming from the injected content script. Possible actions are starting or stopping existing money streams.
  handleMoneyStreamMessages(store);
}

initBackground();
