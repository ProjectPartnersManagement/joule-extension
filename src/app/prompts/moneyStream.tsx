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

    componentDidMount() {
        this.createMoneyStream();
    }

    private createMoneyStream = () => {
        setTimeout(() => {
            this.props.createMoneyStream(this.args.moneyStream);
        }, 500);
    };

    render() {
        return (
            <PromptTemplate
                beforeConfirm={this.handleConfirm}
                beforeReject={this.handleReject}
            >
                <MoneyStreamInfo moneyStreamId={this.state.moneyStreamId} hideConfirm={true} key={this.state.moneyStreamId}/>
            </PromptTemplate>
        );
    }

    private handleConfirm = async () => {
        console.log('Money Stream State on confirm', this.props.moneyStreams);
        this.props.updateMoneyStream({
            id: this.state.moneyStreamId,
            state: 'open'
        });

        // Wait for 1 second to allow changes to be written to the sync storage.
        await new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 1000);
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
