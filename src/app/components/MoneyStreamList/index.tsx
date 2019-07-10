import React from 'react';
import { connect } from 'react-redux';
import { AppState } from 'store/reducers';
import MoneyStreamRow from 'components/MoneyStreamList/MoneyStreamRow';

interface StateProps {
  moneyStreams: AppState['moneyStreams'];
}

interface DispatchProps {
}

interface OwnProps {
  onClick?(): void;
}

type Props = StateProps & DispatchProps & OwnProps;

class MoneyStreamList extends React.Component<Props> {
  componentWillMount() {
  }

  render() {
    return <div className="MoneyStreamsList">{this.renderMoneyStreamRows()}</div>;
  }

  private renderMoneyStreamRows = () => {
    return this.props.moneyStreams.moneyStreams.map(moneyStream => (
        <MoneyStreamRow
            key={moneyStream.id}
            moneyStream={moneyStream}
            onClick={() => alert('123')}
        />
    ));
  };
}

export default connect<StateProps, DispatchProps, OwnProps, AppState>(
  state => ({
    moneyStreams: state.moneyStreams,
  }),
)(MoneyStreamList);