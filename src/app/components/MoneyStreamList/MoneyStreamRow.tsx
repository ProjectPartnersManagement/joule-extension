import React from 'react';
import moment from 'moment';
import classnames from 'classnames';
import {Icon, Tooltip} from 'antd';
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

    let stateIcon: JSX.Element;
    switch(this.getStatus(moneyStream)) {
        case 'waiting-for-confirmation':
            stateIcon = <Icon className={`state-icon ${this.getStatus(moneyStream)}`} type="question-circle" />;
            break;
        case 'closed':
            stateIcon = <Icon className={`state-icon ${this.getStatus(moneyStream)}`} type="close-circle" />;
            break;
        default:
        case 'open':
            // No need to show an icon if the stream is open. This is the default.
            stateIcon = <span/>;
            break;
    }

    return (
      <div
        className={classnames('TransactionRow', onClick && 'is-clickable')}
        onClick={this.handleClick}
      >
        <div className="TransactionRow-avatar">
          <Identicon className="TransactionRow-avatar-img" pubkey={moneyStream.to.pub_key} />
          <Tooltip title={this.getStatusTooltip(moneyStream)}>
            <div className={`TransactionRow-avatar-status is-${this.getStatus(moneyStream)}`} />
              {stateIcon}
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
    if(moneyStream.state === 'waitingForConfirmation') {
        return 'waiting-for-confirmation'
    }
    else if(moneyStream.max_amount > moneyStream.used_amount) {
      return 'open';
    }
    else {
      return 'closed';
    }
  }

  private getStatusTooltip(moneyStream: MoneyStream) {
      switch(this.getStatus(moneyStream)) {
          case 'waiting-for-confirmation':
              return 'Waiting for confirmation';
          case 'closed':
              return 'Stream closed';
          default:
          case 'open':
              return 'Stream open';
      }
  }
}

export default connect<StateProps, {}, OwnProps, AppState>(state => ({
  chain: getNodeChain(state),
}))(TransactionRow);
