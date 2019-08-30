import {
    GetInfoResponse,
    RequestInvoiceArgs,
    RequestInvoiceResponse,
    SendPaymentResponse,
    SignMessageResponse,
    WebLNProvider,
} from 'webln';
import {PROMPT_TYPE} from './types';
import {MoneyStream} from "modules/money_streams/types";
import shortid from "shortid";

export default class JouleWebLNProvider implements WebLNProvider {
    private isEnabled: boolean = false;
    private activePrompt: PROMPT_TYPE | null = null;
    public events = new EventTarget();

    constructor() {
        window.addEventListener('moneyStreamChangeWithinExtension', (moneyStreamChangeWithinExtensionEvent) => {
            this.events.dispatchEvent(new CustomEvent('moneyStreamChange', {
                detail: (moneyStreamChangeWithinExtensionEvent as CustomEvent).detail
            }));
        });
    }

    async enable() {
        if (this.isEnabled) {
            return;
        }
        return this.promptUser(PROMPT_TYPE.AUTHORIZE).then(() => {
            this.isEnabled = true;
        });
    }

    async getInfo() {
        if (!this.isEnabled) {
            throw new Error('Provider must be enabled before calling getInfo');
        }
        return this.promptUser<GetInfoResponse>(PROMPT_TYPE.INFO);
    }

    async sendPayment(paymentRequest: string) {
        if (!this.isEnabled) {
            throw new Error('Provider must be enabled before calling sendPayment');
        }
        return this.promptUser<SendPaymentResponse, { paymentRequest: string }>(
            PROMPT_TYPE.PAYMENT,
            {
                paymentRequest,
            },
        );
    }

    async makeInvoice(args: string | number | RequestInvoiceArgs) {
        if (!this.isEnabled) {
            throw new Error('Provider must be enabled before calling makeInvoice');
        }

        // Force into RequestInvoiceArgs format for strings (or bozos
        // who send numbers despite being typed otherwise!)
        if (typeof args !== 'object') {
            args = {amount: args};
        }

        return this.promptUser<RequestInvoiceResponse, RequestInvoiceArgs>(
            PROMPT_TYPE.INVOICE,
            args,
        );
    }

    async createMoneyStream(preFilledMoneyStream: Partial<MoneyStream>) {
        const moneyStream: MoneyStream = {
            id: shortid.generate(),
            title: 'Custom Money Stream',
            to: {
                pub_key: 'PUBLIC_KEY',
                addresses: [{
                    network: 'bitcoin',
                    addr: 'ADDRESS_1'
                }],
                alias: 'Burda Media',
                color: '#00b0f0',
                last_update: 1562765210,
            },
            max_amount: 10000,
            used_amount: 5000,
            amount_per_unit: 25,
            payment_interval: 5,
            payment_interval_unit: 'second',
            created_at: Math.round(Date.now() / 1000), // Unix timestamp
            ...preFilledMoneyStream,
            state: 'waitingForConfirmation',
        };

        return this.promptUser<MoneyStreamResponse, MoneyStreamArgs>(
            PROMPT_TYPE.MONEYSTREAM, {
                moneyStream,
            });
    }

    async pauseMoneyStream(moneyStreamId: MoneyStream['id']) {
        return this.sendMessageMoneyStream(moneyStreamId, 'UPDATE_MONEY_STREAM', {
            state: 'paused'
        });
    }

    async resumeMoneyStream(moneyStreamId: MoneyStream['id']) {
        return this.sendMessageMoneyStream(moneyStreamId, 'UPDATE_MONEY_STREAM', {
            state: 'open'
        });
    }

    async getMoneyStream(moneyStreamId: MoneyStream['id']) {
        return this.sendMessageMoneyStream(moneyStreamId, 'GET_MONEY_STREAM');
    }

    async signMessage(message: string) {
        if (!this.isEnabled) {
            throw new Error('Provider must be enabled before calling signMessage');
        }

        return this.promptUser<SignMessageResponse, { message: string }>(PROMPT_TYPE.SIGN, {
            message,
        });
    }

    async verifyMessage(signature: string, message: string) {
        if (!this.isEnabled) {
            throw new Error('Provider must be enabled before calling verifyMessage');
        }

        return this.promptUser<void, { signature: string; msg: string }>(PROMPT_TYPE.VERIFY, {
            signature,
            msg: message,
        });
    }

    // Internal prompt handler
    private promptUser<R = undefined, T = undefined>(
        type: PROMPT_TYPE,
        args?: T,
    ): Promise<R> {
        if (this.activePrompt) {
            Promise.reject(new Error('User is busy'));
        }

        return new Promise((resolve, reject) => {
            window.postMessage(
                {
                    application: 'Joule',
                    prompt: true,
                    type,
                    args,
                },
                '*',
            );

            function handleWindowMessage(ev: MessageEvent) {
                if (!ev.data || ev.data.application !== 'Joule' || ev.data.prompt) {
                    return;
                }
                if (ev.data.error) {
                    reject(ev.data.error);
                } else {
                    resolve(ev.data.data);
                }
                window.removeEventListener('message', handleWindowMessage);
            }

            window.addEventListener('message', handleWindowMessage);
        });
    }

    async sendMessageMoneyStream(moneyStreamId: MoneyStream['id'], actionType: 'UPDATE_MONEY_STREAM' | 'GET_MONEY_STREAM', payload?: Partial<MoneyStream>) {
        return new Promise((resolve, reject) => {
            function handleWindowMessage(ev: MessageEvent) {
                if (!ev.data || ev.data.application !== 'Joule' || ev.data.prompt || ev.data.action !== actionType || ev.data.moneyStreamId !== moneyStreamId) {
                    return;
                }
                if (ev.data.error) {
                    reject(ev.data.error);
                } else {
                    resolve(ev.data.data);
                }
                window.removeEventListener('message', handleWindowMessage);
            }

            window.addEventListener('message', handleWindowMessage);

            window.postMessage(
                {
                    application: 'Joule',
                    prompt: false,
                    action: {
                        type: actionType,
                        payload: {
                            ...payload,
                            id: moneyStreamId
                        }
                    },
                    moneyStreamId,
                },
                '*',
            );
        });
    }
}

export interface MoneyStreamResponse {
    moneyStream: MoneyStream;
}

export interface MoneyStreamArgs {
    moneyStream: MoneyStream;
}
