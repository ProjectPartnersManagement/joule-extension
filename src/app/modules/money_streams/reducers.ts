import types, {MoneyStream} from './types';

export interface MoneyStreamsState {
    moneyStreams: MoneyStream[];
}

export const INITIAL_STATE: MoneyStreamsState = {
    moneyStreams: []
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
            console.log('Money stream created.', action.payload);
            return {
                ...state,
                moneyStreams: clonedMoneyStreams
            };
        case types.DELETE_MONEY_STREAM:
            // Remove the money stream from the list of money streams.
            clonedMoneyStreams.splice(clonedMoneyStreams.findIndex(moneyStream => moneyStream.id === action.payload.id), 1);
            return {
                ...state,
                moneyStreams: clonedMoneyStreams
            };
        // Used for retrieving the money streams from the chrome cloud storage. "Set" means setting the values from the cache in the app.
        case types.SET_SYNCED_MONEY_STREAMS:
            return {
                ...state,
                moneyStreams: action.payload
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
