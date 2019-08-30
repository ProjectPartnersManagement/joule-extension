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
        switch (moneyStream.state) {
            case 'waitingForConfirmation':
                stateIcon = <Icon className={`state-icon ${moneyStream.state}`} type="question-circle"/>;
                break;
            case 'closed':
                stateIcon = <Icon className={`state-icon ${moneyStream.state}`} type="close-circle"/>;
                break;
            case 'paused':
                stateIcon = <Icon className={`state-icon ${moneyStream.state}`} type="pause-circle"/>;
                break;
            case 'open':
                stateIcon = <Icon className={`state-icon ${moneyStream.state}`} type="check-circle"/>;
                break;
            default:
                // Unknown state
                stateIcon = <span/>;
        }

        return (
            <div
                className={classnames('TransactionRow', onClick && 'is-clickable')}
                onClick={this.handleClick}
            >
                <div className="TransactionRow-avatar">
                    <Identicon className="TransactionRow-avatar-img" pubkey={moneyStream.to.pub_key}/>
                    <Tooltip title={this.getStatusTooltip(moneyStream)}>
                        <div className={`TransactionRow-avatar-status is-${moneyStream.state}`}/>
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

    private getStatusTooltip(moneyStream: MoneyStream) {
        switch (moneyStream.state) {
            case 'waitingForConfirmation':
                return 'Waiting for confirmation';
            case 'closed':
                return 'Stream closed';
            case 'paused':
                return 'Stream paused';
            case 'open':
                return 'Stream open';
            default:
                return 'Unknown status';
        }
    }
}

export default connect<StateProps, {}, OwnProps, AppState>(state => ({
    chain: getNodeChain(state),
}))(TransactionRow);
