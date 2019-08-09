import React from 'react';
import {connect} from 'react-redux';
import {AppState} from 'store/reducers';
import './moneyStream.less';
import {MoneyStream} from 'modules/money_streams/types';
import {createMoneyStream, deleteMoneyStream, updateMoneyStream} from 'modules/money_streams/actions';
import MoneyStreamInfo from 'components/MoneyStreamInfo';
import PromptTemplate from "components/PromptTemplate";
import {getPromptArgs, rejectPrompt} from "utils/prompt";
import {MoneyStreamArgs} from "../../webln/provider";

interface StateProps {
    account: AppState['account']['account'];
    moneyStreams: MoneyStream[];
}

interface OwnState {
    moneyStreamId: MoneyStream['id'];
}

interface OwnProps {
    close?(): void;
}

interface DispatchProps {
    updateMoneyStream: typeof updateMoneyStream;
    deleteMoneyStream: typeof deleteMoneyStream;
    createMoneyStream: typeof createMoneyStream,
}

type Props = StateProps & DispatchProps & OwnProps;

class MoneyStreamPrompt extends React.Component<Props, OwnState> {
    private args: MoneyStreamArgs;
    state: OwnState;

    constructor(props: Props) {
        super(props);

        this.args = getPromptArgs<MoneyStreamArgs>();
        this.state = {
            moneyStreamId: this.args.moneyStream.id
        };
        console.log('Prompt Arguments', this.args);
    }

    componentWillMount() {
        this.createMoneyStream();
    }

    private createMoneyStream = () => {
        console.log('Current money streams state', this.props.moneyStreams);
        this.props.createMoneyStream(this.args.moneyStream);
        console.log('Money Stream State after creating the new one', this.props.moneyStreams);
    };

    render() {
        return (
            <PromptTemplate
                beforeConfirm={this.handleConfirm}
                beforeReject={this.handleReject}
            >
                <MoneyStreamInfo moneyStreamId={this.state.moneyStreamId} key={this.state.moneyStreamId}/>
                <input type="button" onClick={this.createMoneyStream} value="Create Money Stream" />
            </PromptTemplate>
        );
    }

    private handleConfirm = () => {
        console.log('Money Stream State on confirm', this.props.moneyStreams);
        this.props.updateMoneyStream({
            id: this.state.moneyStreamId,
            state: 'open'
        });
        if (this.props.close) {
            this.props.close();
        }
        return {
            moneyStream: this.props.moneyStreams.find(moneyStream => moneyStream.id === this.state.moneyStreamId)
        };
    };
    private handleReject = () => {
        const existingMoneyStream = this.props.moneyStreams.find(moneyStream => moneyStream.id === this.state.moneyStreamId);
        if (existingMoneyStream) {
            this.props.deleteMoneyStream(existingMoneyStream);
        }

        if (this.props.close) {
            this.props.close();
        }
        rejectPrompt();
    };
}

export default connect<StateProps, DispatchProps, OwnProps, AppState>(
    (state) => ({
        account: state.account.account,
        moneyStreams: state.moneyStreams.moneyStreams
    }),
    {
        updateMoneyStream,
        deleteMoneyStream,
        createMoneyStream
    }
)(MoneyStreamPrompt);
