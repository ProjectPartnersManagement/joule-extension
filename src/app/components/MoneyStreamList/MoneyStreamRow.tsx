import React from 'react';
import moment from 'moment';
import classnames from 'classnames';
import {Tooltip} from 'antd';
import Identicon from 'components/Identicon';
import {getNodeChain} from 'modules/node/selectors';
import './MoneyStreamRow.less';
import {AppState} from 'store/reducers';
import {connect} from 'react-redux';
import {MoneyStream} from 'modules/money_streams/types';

interface StateProps {
  chain: ReturnType<typeof getNodeChain>;
}

interface OwnProps {
  moneyStream: MoneyStream;
  onClick?(source: MoneyStream): void;
}

type Props = StateProps & OwnProps;

class TransactionRow extends React.Component<Props> {
  render() {
    const {
      moneyStream,
      onClick,
    } = this.props;

    return (
      <div
        className={classnames('TransactionRow', onClick && 'is-clickable')}
        onClick={this.handleClick}
      >
        <div className="TransactionRow-avatar">
          <Identicon className="TransactionRow-avatar-img" pubkey={moneyStream.to.pub_key} />
          <Tooltip title={this.getStatus(moneyStream)}>
            <div className={`TransactionRow-avatar-status is-${this.getStatus(moneyStream)}`} />
          </Tooltip>
        </div>
        <div className="TransactionRow-info">
          <div className="TransactionRow-info-title">{moneyStream.title}</div>
          <div className="TransactionRow-info-time">
            {moment.unix(moneyStream.created_at).format('MMM Do, LT')}
          </div>
        </div>
      </div>
    );
  }

  private handleClick = () => {
    if (this.props.onClick) {
      this.props.onClick(this.props.moneyStream);
    }
  };

  private getStatus(moneyStream: MoneyStream) {
    if(moneyStream.max_amount > moneyStream.used_amount) {
      return 'open';
    }
    else {
      return 'closed';
    }
  }
}

export default connect<StateProps, {}, OwnProps, AppState>(state => ({
  chain: getNodeChain(state),
}))(TransactionRow);
