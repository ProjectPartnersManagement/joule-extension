import types, {MoneyStream} from './types';

export interface MoneyStreamsState {
    moneyStreams: MoneyStream[];
}

export const INITIAL_STATE: MoneyStreamsState = {
    moneyStreams: [
        {
            id: 'abcdefg',
            title: 'Playboy.de',
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
            state : 'open',
            created_at: 1562765210, // Unix timestamp
        },
    ]
};

export default function moneyStreamsReducers(
    state: MoneyStreamsState = INITIAL_STATE,
    action: any,
): MoneyStreamsState {
    const clonedMoneyStreams: MoneyStream[] = JSON.parse(JSON.stringify(state.moneyStreams));
    let changedClonedMoneyStream: MoneyStream;

    switch (action.type) {
        // When the user updates a money stream through the Joule interface.
        case types.UPDATE_MONEY_STREAM:
            if (!action.payload.id) {
                throw new Error('Update payload is missing the money stream ID.');
            }
            changedClonedMoneyStream = getChangedClonedMoneyStream(action.payload.id, clonedMoneyStreams);

            const protectedProperties = ['to', 'created_at'];

            const moneyStreamFields: MoneyStream = action.payload;
            for (const i in moneyStreamFields) {
                if (protectedProperties.includes(i)) {
                    throw new Error('Unable to update protected money stream property.');
                }
                if (!changedClonedMoneyStream.hasOwnProperty(i)) {
                    throw new Error(`Money stream field "${i}" does not exist on the existing object. Updating impossible.`);
                }
                changedClonedMoneyStream[i as keyof MoneyStream] = moneyStreamFields[i as keyof MoneyStream];
            }

            return {
                ...state,
                moneyStreams: clonedMoneyStreams
            };
        case types.CREATE_MONEY_STREAM:
            // Add the money stream to the list of money streams.
            clonedMoneyStreams.push(action.payload);
            return {
                ...state,
                moneyStreams: clonedMoneyStreams
            };
        case types.DELETE_MONEY_STREAM:
            // Add the money stream to the list of money streams.
            clonedMoneyStreams.splice(clonedMoneyStreams.findIndex(moneyStream => moneyStream.id === action.payload.id), 1);
            return {
                ...state,
                moneyStreams: clonedMoneyStreams
            };
    }

    return state;
}

function getChangedClonedMoneyStream(id: MoneyStream["id"], clonedMoneyStreams: MoneyStream[]) {
    const changedClonedMoneyStream = clonedMoneyStreams.find(moneyStream => moneyStream.id === id);

    if (!changedClonedMoneyStream) {
        throw new Error('Updating non existent money stream impossible.');
    }

    return changedClonedMoneyStream;
}