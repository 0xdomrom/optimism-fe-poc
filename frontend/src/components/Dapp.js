import React from "react";

import {Contract} from "ethers";
import {OptimismProvider} from '@eth-optimism/provider'
import {Web3Provider} from '@ethersproject/providers'

import CounterArtifact from "../contracts/Counter.json";
import contractAddress from "../contracts/contract-address.json";

import {NoWalletDetected} from "./NoWalletDetected";
import {ConnectWallet} from "./ConnectWallet";
import {Loading} from "./Loading";
import {CountUp} from "./CountUp";
import {TransactionErrorMessage} from "./TransactionErrorMessage";
import {WaitingForTransactionMessage} from "./WaitingForTransactionMessage";


const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

export class Dapp extends React.Component {
  constructor(props) {
    super(props);

    // We store multiple things in Dapp's state.
    // You don't need to follow this pattern, but it's an useful example.
    this.initialState = {
      counterData: undefined,
      // The user's address and balance
      selectedAddress: undefined,
      // The ID about transactions being sent, and any possible error with them
      txBeingSent: undefined,
      transactionError: undefined,
      networkError: undefined,
    };

    this.state = this.initialState;
    this._web3 = undefined;
    this._provider = undefined;
  }

  render() {
    // Ethereum wallets inject the window.ethereum object. If it hasn't been
    // injected, we instruct the user to install MetaMask.
    if (window.ethereum === undefined) {
      return <NoWalletDetected/>;
    }

    // The next thing we need to do, is to ask the user to connect their wallet.
    // When the wallet gets connected, we are going to save the user's address
    // in the component's state. So, if it hasn't been saved yet, we have
    // to show the ConnectWallet component.
    //
    // Note that we pass it a callback that is going to be called when the user
    // clicks a button. This callback just calls the _connectWallet method.
    if (!this.state.selectedAddress || this.state.networkError) {
      return (
        <ConnectWallet
          connectWallet={() => this._connectWallet()}
          networkError={this.state.networkError}
          dismiss={() => this._dismissNetworkError()}
        />
      );
    }

    if (!this.state.counterData) {
      return <Loading/>;
    }

    // If everything is loaded, we render the application.
    return (
      <div className="container p-4">
        <div className="row">
          <div className="col-12">
            <h1>
              Count: {this.state.counterData.count.toString()}
            </h1>
            <p>
              Welcome <b>{this.state.selectedAddress}</b>.
            </p>
          </div>
        </div>

        <hr/>

        <div className="row">
          <div className="col-12">
            {/*
              Sending a transaction isn't an immediate action. You have to wait for it to be mined.
              If we are waiting for one, we show a message here.
            */}
            {this.state.txBeingSent && (
              <WaitingForTransactionMessage txHash={this.state.txBeingSent}/>
            )}

            {/*
              Sending a transaction can fail in multiple ways. 
              If that happened, we show a message here.
            */}
            {this.state.transactionError && (
              <TransactionErrorMessage
                message={this._getRpcErrorMessage(this.state.transactionError)}
                dismiss={() => this._dismissTransactionError()}
              />
            )}
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            {/*
              This component displays a form that the user can use to send a transaction.
            */}
            {(
              <CountUp
                countUp={() => this._countUp()}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  componentWillUnmount() {
    // Stop polling when the Dapp gets unmounted
    this._stopPollingData();
  }

  async _connectWallet() {
    // This method is run when the user clicks the Connect. It connects the
    // dapp to the user's wallet, and initializes it.

    // To connect to the user's wallet, we have to run this method.
    // It returns a promise that will resolve to the user's address.
    const [selectedAddress] = (await window.ethereum.send("eth_requestAccounts")).result;

    // Once we have the address, we can initialize the application.
    this._initialize(selectedAddress);

    // We reinitialize it whenever the user changes their account.
    window.ethereum.on("accountsChanged", ([newAddress]) => {
      this._stopPollingData();
      // `accountsChanged` event can be triggered with an undefined newAddress.
      // This happens when the user removes the Dapp from the "Connected
      // list of sites allowed access to your addresses" (Metamask > Settings > Connections)
      // To avoid errors, we reset the dapp state
      if (newAddress === undefined) {
        return this._resetState();
      }

      this._initialize(newAddress);
    });

    // We reset the dapp state if the network is changed
    window.ethereum.on("networkChanged", ([networkId]) => {
      this._stopPollingData();
      this._resetState();
    });
  }

  async _initialize(userAddress) {
    // This method initializes the dapp

    // We first store the user's address in the component's state
    this.setState({
      selectedAddress: userAddress,
    });

    // Then, we initialize ethers and start polling for the user's balance.

    // Fetching the token data and the user's balance are specific to this
    // sample project, but you can reuse the same initialization pattern.
    await this._intializeProvider();
    try {
      console.log(this._counter);
      this._startPollingData();
      this._updateCounterData();
    } catch (error) {
      this.setState({networkError: 'Counter contract not found on this network.'});
    }
  }

  async _intializeProvider() {
    // We first initialize ethers by creating a provider using window.ethereum
    this._web3 = new Web3Provider(window.ethereum);
    // TODO: don't just localhost here
    this._provider = new OptimismProvider('http://localhost:8545', this._web3);

    // When, we initialize the contract using that provider and the token's
    // artifact. You can do this same thing with your contracts.
    this._counter = await new Contract(
      contractAddress.Counter,
      CounterArtifact.abi,
      this._provider.getSigner(0)
    );
  }

  // The next to methods are needed to start and stop polling data. While
  // the data being polled here is specific to this example, you can use this
  // pattern to read any data from your contracts.
  //
  // Note that if you don't need it to update in near real time, you probably
  // don't need to poll it.
  _startPollingData() {
    this._pollDataInterval = setInterval(() => this._updateCounterData(), 1000);

    // We run it once immediately so we don't have to wait for it
    this._updateCounterData();
  }

  _stopPollingData() {
    clearInterval(this._pollDataInterval);
    this._pollDataInterval = undefined;
  }

  // The next two methods just read from the contract and store the results in the component state.
  async _updateCounterData() {
    console.log(this._counter)
    const count = await this._counter.count();
    this.setState({counterData: {count}});
  }

  async _countUp() {
    try {
      // If a transaction fails, we save that error in the component's state.
      // We only save one such error, so before sending a second transaction, we
      // clear it.
      this._dismissTransactionError();

      // We send the transaction, and save its hash in the Dapp's state. This
      // way we can indicate that we are waiting for it to be mined.
      const tx = await this._counter.countUp();
      this.setState({txBeingSent: tx.hash});

      // We use .wait() to wait for the transaction to be mined. This method
      // returns the transaction's receipt.
      const receipt = await tx.wait();
      console.log(receipt);

      // The receipt, contains a status flag, which is 0 to indicate an error.
      if (receipt.status === 0) {
        // We can't know the exact error that make the transaction fail once it
        // was mined, so we throw this generic one.
        throw new Error("Transaction failed");
      }

      // If we got here, the transaction was successful, so you may want to
      // update your state. Here, we update the user's balance.
      await this._updateCounterData();
    } catch (error) {
      // We check the error code to see if this error was produced because the
      // user rejected a tx. If that's the case, we do nothing.
      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return;
      }

      // Other errors are logged and stored in the Dapp's state. This is used to
      // show them to the user, and for debugging.
      console.error(error);
      this.setState({transactionError: error});
    } finally {
      // If we leave the try/catch, we aren't sending a tx anymore, so we clear
      // this part of the state.
      this.setState({txBeingSent: undefined});
    }
  }

  // This method just clears part of the state.
  _dismissTransactionError() {
    this.setState({transactionError: undefined});
  }

  // This method just clears part of the state.
  _dismissNetworkError() {
    this.setState({networkError: undefined});
  }

  // This is an utility method that turns an RPC error into a human readable
  // message.
  _getRpcErrorMessage(error) {
    if (error.data) {
      return error.data.message;
    }

    return error.message;
  }

  // This method resets the state
  _resetState() {
    this.setState(this.initialState);
  }

}
