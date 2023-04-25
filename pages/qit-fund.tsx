import React, { useEffect, useState } from "react";
import myPageAbi from "../components/abi/QIT.json";
import erc20ABI from "../components/abi/erc20.json";
import { BigNumber, ethers } from "ethers";
import Notification, { NotificationContent } from "../components/Notification";
import LiquiditySwapCard from "../components/swap/LiquiditySwapCard";

import { useAccount, useNetwork, useProvider, useSigner } from "wagmi";
import { fetchSigner } from "@wagmi/core";

import { timeout } from "../components/utils/timeout";
import SmallSpinner from "../components/animations/SmallSpinner";

function MyPage() {
  const [showNotification, setNotificationShow] = useState(false);
  const [currentTab, setCurrentTab] = useState<string>("deposit");
  const [inputValue, setInputValue] = useState<string>("");
  const [outputValue, setOutputValue] = useState<string>();
  const [swapButtonText, setSwapButtonText] = useState<string>("Loading...");
  const [holdingValue, setHoldingValue] = useState<string>("0");
  const [contractInfo, setContractInfo] = useState<{
    address: ethers.Contract["address"];
    tokenName: string;
    qitbalance: ethers.BigNumber;
    usdtbalance: ethers.BigNumber;
    allowance: ethers.BigNumber;
    lockupEnds: number;
    pendingWithdrawals: ethers.BigNumber;
  }>({
    address: "-",
    tokenName: "QIT",
    qitbalance: BigNumber.from(0),
    usdtbalance: BigNumber.from(0),
    allowance: BigNumber.from(0),
    lockupEnds: 0,
    pendingWithdrawals: BigNumber.from(0),
  });
  const { chain } = useNetwork();

  const [ready, setReady] = useState<boolean>(false);
  useEffect(() => {
    setReady(true);
  }, []);

  const [notificationStatus, setNotificationStatus] =
    useState<NotificationContent["status"]>("info");
  const [notificationMessage, setNotificationMessage] = useState<string>("");
  const [notificationTitle, setNotificationTitle] = useState<string>("");

  const minDeposit = 1000; // this will be updated to actual value
  const minTopup = 500; // this will be updated to actual value
  const [loading, setLoading] = useState<boolean>(false); // loading state for button

  const { address, isConnecting, isDisconnected, isConnected } = useAccount();
  const provider = useProvider();

  const QIT = new ethers.Contract(
    "0x4C4470D0B9c0dD92B25Be1D2fB5181cdA7e6E3f7",
    myPageAbi,
    provider
  );
  const ERC20 = new ethers.Contract(
    "0xEcAD8721BA48dBdc0eac431D68A0b140F07c0801",
    erc20ABI,
    provider
  );

  async function getHoldingValue() {
    if (isConnecting) {
      console.log("Connecting...");
      return;
    }
    if (isDisconnected) {
      console.log("Disconnected");
      return;
    }
    if (isConnected) {
      console.log("Connected", address);
      try {
        const _holdingValue = await QIT.getHoldingValue(address);
        setHoldingValue(_holdingValue.toString());
      } catch (error) {
        console.error("Couldn't get holdingValue: " + error);
      }
    }
  }

  useEffect(() => {
    getHoldingValue();
    _setContractInfo();
  }, [isConnecting, isDisconnected, isConnected, chain]);

  async function getWithdrawalValue(value: string) {
    const number = parseInt(value, 10);
    if (value !== "" || number == 0) {
      try {
        setOutputValue("Loading...");
        const n = ethers.utils.parseUnits(value, 6);
        const wd = await QIT.getWithdrawalReturn(n);
        setOutputValue((+ethers.utils.formatUnits(wd, 18)).toFixed(2));
      } catch (error) {
        console.log(error);
      }
    } else {
      setOutputValue("0");
    }
  }
  async function getDepositValue(value: string) {
    const number = parseInt(value, 10);
    if (value !== "" || number == 0) {
      if (number >= minDeposit) {
        try {
          setOutputValue("Loading...");
          const n = ethers.utils.parseEther(value);
          const deposit = await QIT.getDepositReturn(n);
          setOutputValue((+ethers.utils.formatUnits(deposit, 6)).toFixed(2));
        } catch (error) {
          console.log(error);
        }
      } else {
        //TODO: Change to red and show Min Deposit = $x
        //console.log("Input is less than minDeposit");
        setOutputValue("Min deposit is " + minDeposit);
      }
    } else {
      setOutputValue("0");
    }
  }

  function changeNotificationContent(
    title: NotificationContent["title"],
    message: NotificationContent["message"],
    status: NotificationContent["status"]
  ) {
    setNotificationTitle(title);
    setNotificationMessage(message);
    setNotificationStatus(status);
  }

  // Logic to determine if user can swap or needs approval first
  async function swapOrApprove() {
    const signer = await fetchSigner();
    // DEPOSITS
    if (currentTab == "deposit" && inputValue !== "" && signer) {
      if (contractInfo.allowance.toBigInt() < ethers.utils.parseEther(inputValue).toBigInt()) {
        const ERC20connect = ERC20.connect(signer);
        try {
          setLoading(true);
          console.log("Approving");
          // Approving
          const transaction = await ERC20connect.approve(
            QIT.address,
            ethers.utils.parseEther("10000000000000")
          );
          changeNotificationContent("In progress", "Approval Requested", "loading");
          setNotificationShow(true);
          const receipt = await transaction.wait();

          changeNotificationContent("Complete", "Approval was successful", "success");
          console.log(receipt);
          _setContractInfo();
          await timeout(2000);
          setNotificationShow(false);
        } catch (error) {
          changeNotificationContent("Failed", "Approval was rejected", "error");
          setNotificationShow(true);
          console.log("Wallet transaction did not complete");
        } finally {
          setLoading(false);
        }
        // update after completion
      } else {
        const QITconnect = QIT.connect(signer);
        try {
          setLoading(true);
          console.log("Depositing");
          // Depositing
          const transaction = await QITconnect.depositToFund(ethers.utils.parseEther(inputValue));
          console.log("Transaction: ", transaction);
          changeNotificationContent("In progress", "Deposit Requested", "loading");
          setNotificationShow(true);
          const receipt = await transaction.wait();

          changeNotificationContent("Complete", "Deposit was successful", "success");
          console.log("Receipt: ", receipt);

          await timeout(2000);
          setNotificationShow(false);
          _setContractInfo();
        } catch (error) {
          changeNotificationContent("Failed", "Deposit was rejected", "error");
          setNotificationShow(true);
          console.log("Unable to complete Deposit");
        } finally {
          setLoading(false);
        }
      }
    } else {
      console.log("No signer");
    }
  }

  // Sets the contract values
  async function _setContractInfo() {
    setLoading(true);
    try {
      setContractInfo({
        address: QIT.address,
        tokenName: "QIT",
        qitbalance: await QIT.balanceOf(address),
        usdtbalance: await ERC20.balanceOf(address),
        allowance: await ERC20.allowance(address, QIT.address),
        lockupEnds: await QIT.withdrawalLockTime(address),
        pendingWithdrawals: await QIT.pendingWithdrawals(address),
      });
    } catch (error) {
      console.error("Couldn't set QIT contract info: " + error);
    } finally {
      setLoading(false);
    }

    if (isConnected) {
      await getHoldingValue();
    } else if (isConnecting) {
      console.log("Connecting account");
    } else {
      console.log("Not connected");
    }
  }
  // account change -> contract info update
  useEffect(() => {
    if (address) {
      _setContractInfo();
    }
  }, [address]);

  // Returns swap button with correct body text based on input value
  function changeSwapButtonText() {
    if (inputValue == "") {
      setSwapButtonText("Enter Amount");
    }
    if (inputValue !== "") {
      if (currentTab === "withdrawal") {
        setSwapButtonText("Swap QIT for USDT");
      } else if (
        contractInfo.allowance.toBigInt() < ethers.utils.parseUnits(inputValue, 6).toBigInt() &&
        currentTab === "deposit"
      ) {
        setSwapButtonText("Give permission to deposit USDT");
      } else if (
        contractInfo.allowance.toBigInt() >= ethers.utils.parseUnits(inputValue, 6).toBigInt()
      ) {
        setSwapButtonText("Swap USDT for QIT");
      }
    }
  }
  // Keeps track of input value to update swap button text
  useEffect(() => {
    changeSwapButtonText();
  }, [inputValue, contractInfo.allowance, currentTab]);

  function resetOutputValue(_currentTab: string) {
    if (_currentTab === currentTab) {
      return;
    }
    setOutputValue("");
  }

  // Update balances

  return (
    <>
      {/* Exchange */}
      <div className="min-h-screen">
        <div className="flex items-center justify-between">
          <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:flex lg:justify-between lg:px-8">
            <div className="min-w-0 flex-1">
              <h2 className="text-4xl font-bold text-center tracking-tight text-white sm:text-5xl lg:text-6xl">
                Quantifi Investor Fund
              </h2>
              <h4 className="text-xl font-bold text-center tracking-tight text-white sm:text-xl lg:text-xl">
                **Deposits Paused Pending Presale
              </h4>
            </div>
          </div>
        </div>
        {/* Cards */}
        <div className="my-10 flex w-full flex-col items-center justify-center px-4 sm:flex-row sm:items-start ">
          {/* Holdings */}
          <div className="my-3 mx-7 min-h-full w-full max-w-lg overflow-hidden rounded-lg bg-neutral-100 px-6 py-4 text-gray-900 shadow-lg ">
            {/* Title */}
            <div className="mb-2 text-xl font-bold">My Holdings</div>
            <div>
              <div className="flex justify-between">
                <span className="mb-2 mr-2 block rounded-full py-1 text-base font-semibold text-gray-700">
                  Tokens
                </span>
                <span className="text-right">
                  {!loading ? (
                    (+ethers.utils.formatUnits(contractInfo.qitbalance, 6)).toLocaleString(
                      undefined,
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )
                  ) : (
                    <SmallSpinner />
                  )}{" "}
                  QIT
                </span>
              </div>

              <div className="flex h-full justify-between">
                <span className="mb-2 mr-2 block rounded-full py-1 text-base font-semibold text-gray-700">
                  Value
                </span>
                <span className="text-right">
                  {!loading ? (
                    (+ethers.utils.formatEther(holdingValue)).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  ) : (
                    <SmallSpinner />
                  )}{" "}
                  USDT
                </span>
              </div>

              <div className="flex justify-between">
                <span className="mb-2 mr-2 block rounded-full py-1 text-base font-semibold text-gray-700">
                  Change
                </span>
                <span className="text-right">12%</span>
              </div>
            </div>
          </div>
          {/* My Withdrawals */}
          <div className="my-3 mx-7 h-full w-full max-w-lg overflow-hidden rounded-lg bg-neutral-100 px-6 py-4 text-gray-900 shadow-lg ">
            {/* Title */}
            <div className="mb-2 text-xl font-bold">My Withdrawals</div>
            <div>
              <div className="flex justify-between">
                <span className="mb-2 mr-2 block rounded-full py-1 text-base font-semibold text-gray-700">
                  Withdrawal Lockup Ends
                </span>
                <span className="text-right">
                  {ready && new Date(contractInfo.lockupEnds * 1000).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="mb-2 mr-2 block rounded-full py-1 text-base font-semibold text-gray-700">
                  Pending Withdrawals
                </span>
                <span className="text-right">
                  {(+ethers.utils.formatUnits(contractInfo.pendingWithdrawals, 6)).toFixed(2)} QIT
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Information text */}
        <div className="bg-gray-800 ">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24 sm:px-6 lg:flex lg:justify-between lg:px-8">
            <div className="max-w-2xl">
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                About the Fund
              </h1>
              <p className="text-md mt-5 flex-nowrap text-gray-400 sm:text-xl">
                The Quantifi Investor Fund offers managed exposure to a wide array of
                cryptocurrencies on the BNB Blockchain. The fund prioritizes low drawdown and is
                directed by a sophisticated quantitative investment model (see{" "}
                <a
                  href="Https://joel-lowe.gitbook.io/quantifi"
                  className="text-gray-300 hover:text-white"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Docs
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="inline-block h-4 w-4 pl-1"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                    />
                  </svg>
                </a>
                ). Please note: Investment in the fund requires a minimum deposit of ${minDeposit},
                or minimum top up of ${minTopup}. All deposits are subject to a 30 day lockup and
                incur a 2% deposit fee.
              </p>
            </div>
          </div>
        </div>

        {/* Swap */}
        <div className="flex justify-center px-4">
          <LiquiditySwapCard
            loading={loading}
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            resetOutputValue={resetOutputValue}
            swapButtonText={swapButtonText}
            inputValue={inputValue}
            setInputValue={setInputValue}
            outputValue={outputValue}
            getDepositValue={getDepositValue}
            getWithdrawalValue={getWithdrawalValue}
            swapOrApprove={swapOrApprove}
            QITBalance={(+ethers.utils.formatUnits(contractInfo.qitbalance, 6)).toFixed(2)}
            USDTBalance={(+ethers.utils.formatEther(contractInfo.usdtbalance)).toFixed(2)}
          />
        </div>
      </div>

      {/* Notification */}
      <Notification
        title={notificationTitle}
        message={notificationMessage}
        show={showNotification}
        status={notificationStatus}
        setNotificationShow={setNotificationShow}
      />
    </>
  );
}

export default MyPage;
