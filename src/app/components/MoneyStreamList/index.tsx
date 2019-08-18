import React from 'react';
import { connect } from 'react-redux';
import { AppState } from 'store/reducers';
import MoneyStreamRow from 'components/MoneyStreamList/MoneyStreamRow';
import {MoneyStream} from 'modules/money_streams/types';
import runSelector from "../../../content_script/runSelector";
import {selectSettings} from "modules/settings/selectors";

interface StateProps {
  moneyStreams: AppState['moneyStreams']['moneyStreams'];
}

interface DispatchProps {
}

interface OwnProps {
  onClick(moneyStream: MoneyStream): void;
}

type Props = StateProps & DispatchProps & OwnProps;

class MoneyStreamList extends React.Component<Props> {
  async componentWillMount() {
      const moneyStreamList = await runSelector(selectSettings, 'settings', 'settings');
      console.log('Money Stream List', moneyStreamList);
  }

  render() {
    return <div className="MoneyStreamsList">{this.renderMoneyStreamRows()}</div>;
  }

  private renderMoneyStreamRows = () => {
    return this.props.moneyStreams.map(moneyStream => (
        <MoneyStreamRow
            key={moneyStream.id}
            moneyStream={moneyStream}
            onClick={() => this.props.onClick(moneyStream)}
        />
    ));
  };
}

export default connect<StateProps, DispatchProps, OwnProps, AppState>(
  state => ({
    moneyStreams: state.moneyStreams.moneyStreams,
  }),
)(MoneyStreamList);
