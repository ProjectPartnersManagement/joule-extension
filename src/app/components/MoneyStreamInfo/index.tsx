import React from 'react';
import {connect} from 'react-redux';
import {AppState} from 'store/reducers';
import './style.less';
import {intervalUnits, MoneyStream} from 'modules/money_streams/types';
import {Button, Form, Icon, Input, Select, Tooltip} from 'antd';
import Unit from 'components/Unit';
import {Link} from 'react-router-dom';
import AmountField from 'components/AmountField';
import NodeInfo from "components/PromptTemplate/NodeInfo";
import {deleteMoneyStream, updateMoneyStream} from 'modules/money_streams/actions';

interface StateProps {
    account: AppState['account']['account'];
    moneyStream: MoneyStream;
}

interface OwnProps {
    moneyStreamId: MoneyStream['id'];
    onDelete?: () => void;
    hideConfirm?: boolean;
}

interface DispatchProps {
    updateMoneyStream: typeof updateMoneyStream;
    deleteMoneyStream: typeof deleteMoneyStream;
}

type Props = StateProps & DispatchProps & OwnProps;

class MoneyStreamInfo extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    private getNumberOfUnits() {
        return Math.floor(this.props.moneyStream.max_amount / this.props.moneyStream.amount_per_unit);
    }

    private getConfirmationOrStartStopButtons() {
        // If the stream is not yet confirmed, only allow confirming or deleting it. Starting and stopping is not allowed.
        if (this.props.moneyStream.state === 'waitingForConfirmation') {
            if (!this.props.hideConfirm) {
                return <Form.Item>
                    <Button type="default" size="large" block onClick={this.handleConfirm}>
                        Confirm
                    </Button>
                </Form.Item>;
            }
            return;
        }
        // If the stream is confirmed already, starting it is allowed.
        else if (this.props.moneyStream.state === 'open') {
            return <Form.Item>
                <Button type="default" size="large" block onClick={this.handlePause}>
                    Pause
                </Button>
            </Form.Item>;
        } else if (this.props.moneyStream.state === 'paused') {
            return <Form.Item>
                <Button type="default" size="large" block onClick={this.handleStart}>
                    Start
                </Button>
            </Form.Item>;
        } else {
            return;
        }
    }

    render() {
        const {moneyStream, account} = this.props;
        const blockchainBalance = account ? account.blockchainBalance : 'unknown';

        if (!moneyStream) {
            return (<div className="MoneyStreamInfo"></div>);
        }

        return (
            <div className="MoneyStreamInfo">
                <NodeInfo pubkey={moneyStream.to.pub_key} alias={moneyStream.to.alias}/>
                <div className="configuration">
                    <Form className="money-stream-configuration" onSubmit={this.handleSubmit}>
                        <Form.Item
                            className="StreamTitle"
                            label="Beschreibung"
                        >
                            <Input
                                className="StreamTitle-input"
                                value={moneyStream.title}
                                type="text"
                                onChange={this.handleChangeTitle}
                            />
                        </Form.Item>

                        <AmountField
                            label="Max Amount"
                            amount={moneyStream.max_amount.toString()}
                            onChangeAmount={this.handleChangeMaxAmount}
                            minimumSats="1"
                            maximumSats={blockchainBalance}
                            showMax
                            required
                            help={
                                <small>
                                    Available on-chain balance: <Unit value={blockchainBalance}/>
                                    <Tooltip title="How is this calculated?">
                                        <Link to="/balances">
                                            <Icon type="info-circle"/>
                                        </Link>
                                    </Tooltip>
                                </small>
                            }
                        />

                        <Form.Item
                            className="UsedAmount"
                            label="Used Amount"
                        >
                            <Input
                                className="UsedAmount-input"
                                value={moneyStream.used_amount.toString()}
                                readOnly
                            />
                        </Form.Item>

                        <div className="UnitConfiguration">
                            <AmountField
                                label="Amount per unit"
                                amount={moneyStream.amount_per_unit.toString()}
                                onChangeAmount={this.handleChangeAmountPerUnit}
                                minimumSats="1"
                                maximumSats={blockchainBalance}
                                required
                            />

                            <Form.Item
                                className="NumberOfUnits"
                                label="Number of units"
                            >
                                <Input
                                    className="NumberOfUnits-input"
                                    value={this.getNumberOfUnits()}
                                    readOnly
                                />
                            </Form.Item>
                        </div>

                        <div className="IntervalConfiguration">
                            <Form.Item
                                className="PaymentInterval"
                                label="Payment Interval"
                            >
                                <Input
                                    className="PaymentInterval-input"
                                    value={moneyStream.payment_interval}
                                    type="number"
                                    onChange={this.handleChangeInterval}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Interval Unit"
                            >
                                <Select
                                    className="PaymentIntervalUnits"
                                    value={moneyStream.payment_interval_unit as any}
                                    dropdownMatchSelectWidth={true}
                                    onChange={this.handleChangeIntervalUnit}
                                >
                                    {intervalUnits.map(intervalUnit => (
                                        <Select.Option key={intervalUnit} value={intervalUnit}>
                                            {intervalUnit.substr(0, 1).toUpperCase() + intervalUnit.substr(1)}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </div>

                        {this.getConfirmationOrStartStopButtons()}
                        <Form.Item>
                            <Button type="danger" size="large" block ghost onClick={this.handleDelete}>
                                Delete
                            </Button>
                        </Form.Item>
                    </Form>
                </div>

                <div id="moneyStreamId">Money Stream ID: {this.props.moneyStreamId}</div>
            </div>
        );
    }

    private handleSubmit = () => {
        alert('Submit handled');
    };

    private handleChangeMaxAmount = (amount: string) => {
        if (this.props.moneyStream.max_amount.toString() === amount) return;
        console.log(`max_amount changed.`);

        this.props.updateMoneyStream({
            id: this.props.moneyStream.id,
            max_amount: +amount
        });
    };

    private handleChangeAmountPerUnit = (amount: string) => {
        if (this.props.moneyStream.amount_per_unit.toString() === amount) return;

        console.log('amount_per_unit changed.');

        this.props.updateMoneyStream({
            id: this.props.moneyStream.id,
            amount_per_unit: +amount
        });
    };

    private handleChangeInterval = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log('payment_interval changed.');
        this.props.updateMoneyStream({
            id: this.props.moneyStream.id,
            payment_interval: +e.target.value
        });
    };

    private handleChangeIntervalUnit = (e: React.ChangeEvent<HTMLSelectElement>) => {
        console.log('payment_interval_unit changed.');
        this.props.updateMoneyStream({
            id: this.props.moneyStream.id,
            payment_interval_unit: e.target.value as any
        });
    };

    private handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log('title changed.');
        this.props.updateMoneyStream({
            id: this.props.moneyStream.id,
            title: e.target.value
        });
    };

    private handleConfirm = () => {
        console.log('Stream confirmed.');
        this.props.updateMoneyStream({
            id: this.props.moneyStream.id,
            state: 'open'
        });
    };

    private handleStart = () => {
        console.log('Stream started/resumed.');
        this.props.updateMoneyStream({
            id: this.props.moneyStream.id,
            state: 'open'
        });
    };

    private handlePause = () => {
        console.log('Stream paused.');
        this.props.updateMoneyStream({
            id: this.props.moneyStream.id,
            state: 'paused'
        });
    };

    private handleDelete = () => {
        console.log('Money stream deletion triggered.');

        if (this.props.onDelete) this.props.onDelete();
        this.props.deleteMoneyStream(this.props.moneyStream);
    };
}

export default connect<StateProps, DispatchProps, OwnProps, AppState>(
    (state, ownProps) => ({
        account: state.account.account,
        moneyStream: state.moneyStreams.moneyStreams.find(moneyStream => moneyStream.id === ownProps.moneyStreamId) as MoneyStream,
    }),
    {
        updateMoneyStream,
        deleteMoneyStream
    }
)(MoneyStreamInfo);
