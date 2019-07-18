import React from 'react';
import {connect} from 'react-redux';
import {AppState} from 'store/reducers';
import './style.less';
import {MoneyStream} from 'modules/money_streams/types';
import {deleteMoneyStream, updateMoneyStream} from 'modules/money_streams/actions';
import MoneyStreamInfo from 'components/MoneyStreamInfo';
import {Button} from "antd";

interface StateProps {
    account: AppState['account']['account'];
    moneyStream: MoneyStream;
}

interface OwnProps {
    moneyStreamId: MoneyStream['id'];

    close?(): void;
}

interface DispatchProps {
    updateMoneyStream: typeof updateMoneyStream;
    deleteMoneyStream: typeof deleteMoneyStream;
}

type Props = StateProps & DispatchProps & OwnProps;

class MoneyStreamForm extends React.Component<Props> {
    render() {
        return (
            <div className="MoneyStreamForm">
                <MoneyStreamInfo moneyStreamId={this.props.moneyStreamId} key={this.props.moneyStreamId}/>
                <div className="MoneyStreamForm-buttons">
                    <Button
                        onClick={this.handleReject}
                    >
                    Reject
                    </Button>
                    <Button
                        type="primary"
                        onClick={this.handleConfirm}
                    >
                    Confirm
                    </Button>
                </div>
            </div>
    );
    }

    private handleConfirm = () => {
        this.props.updateMoneyStream({
            id: this.props.moneyStream.id,
            state: 'open'
        });
        if (this.props.close) {
            this.props.close();
        }
    };
    private handleReject = () => {
        this.props.deleteMoneyStream(this.props.moneyStream);
        if (this.props.close) {
            this.props.close();
        }
    };
}

export default connect<StateProps, DispatchProps, OwnProps, AppState>(
    (state, ownProps) => ({
        account: state.account.account,
        moneyStream: state.moneyStreams.moneyStreams.find(moneyStream => moneyStream.id === ownProps.moneyStreamId) as MoneyStream
    }),
    {
        updateMoneyStream,
        deleteMoneyStream
    }
)(MoneyStreamForm);
