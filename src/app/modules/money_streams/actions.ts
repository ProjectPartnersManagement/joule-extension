export function getMoneyStreams() {
  return { type: 'GET_MONEY_STREAMS '};
}

export function openMoneyStream() {
  return {
    type: 'OPEN_MONEY_STREAM',
  };
}

export function closeMoneyStream(moneyStreamId: number) {
  return {
    type: 'CLOSE_MONEY_STREAM',
    payload: { moneyStreamId },
  };
}
