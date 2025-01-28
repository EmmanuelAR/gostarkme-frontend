"use client"

import { calculatePorcentage } from "@/app/utils"
import ProgressBar from "@/components/ui/ProgressBar"
import ShareXButton from "@/components/ui/ShareOnX"
import { BRAAVOS_CHAIN_ID, CHAIN_ID, provider } from "@/constants"
import { addrSTRK } from "@/contracts/addresses"
import { activeChainId } from "@/state/activeChain"
import { walletStarknetkitLatestAtom } from "@/state/connectedWallet"
import { latestTxAtom } from "@/state/latestTx"
import { useAtom, useAtomValue } from "jotai"
import Image, { type StaticImageData } from "next/image"
import { useState } from "react"
import { CallData, cairo } from "starknet"

interface FundDonateProps {
  currentBalance: number
  goal: number
  addr: string
  name: string
  icon?: StaticImageData
}

const FundDonate = ({ currentBalance, goal, addr, name, icon }: FundDonateProps) => {
  const [amount, setAmount] = useState<number | "">("")
  const [error, setError] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [localBalance, setLocalBalance] = useState<number>(currentBalance)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [latestTx, setLatestTx] = useAtom(latestTxAtom)
  const [isDonating, setIsDonating] = useState(false)
  const wallet = useAtomValue(walletStarknetkitLatestAtom)
  const chainId = useAtomValue(activeChainId)
  const progress = calculatePorcentage(localBalance, goal)
  const [donationMessage, setDonationMessage] = useState("")

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "" ? "" : Number(e.target.value)
    setAmount(value)
    setError("")
  }

  const waitForTransaction = async (hash: string) => {
    try {
      await provider.waitForTransaction(hash)
      return true
    } catch (error) {
      console.error("Error waiting for transaction:", error)
      return false
    }
  }

  const handleDonateClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (amount === "") {
      setError("This field is required.")
      return
    }

    if (typeof amount === "number" && amount < 0) {
      setError("The amount cannot be negative.")
      return
    }

    setError("")
    setIsLoading(true)
    setIsDonating(true)

    try {
      const tx = await wallet?.account.execute([
        {
          contractAddress: addrSTRK,
          entrypoint: "transfer",
          calldata: CallData.compile({
            recipient: addr,
            amount: cairo.uint256(amount * 10 ** 18),
          }),
        },
        {
          contractAddress: addr,
          entrypoint: "update_receive_donation",
          calldata: CallData.compile({
            strks: cairo.uint256(amount * 10 ** 18),
          }),
        },
      ])

      if (tx) {
        const isConfirmed = await waitForTransaction(tx.transaction_hash)

        if (isConfirmed) {
          if (typeof amount === "number") {
            setLocalBalance((prev) => Number(prev) + amount)
          }
          setDonationMessage(
            `🙌 Supporting ${name} on Go Stark Me with ${amount} $STRK! Donate now: https://gostarkme.com 💪 @undefined_org_ @Starknet`,
          )
          setAmount("")
          setLatestTx(tx.transaction_hash)
          setShowSuccessPopup(true)
          setError("Transaction successful!")
          setTimeout(() => {
            setError("")
          }, 3000)
        } else {
          setError("Transaction failed to confirm. Please try again.")
        }
      }
    } catch (error: any) {
      setError(error.message || "Transaction failed. Please try again.")
      setIsLoading(false)
      setIsDonating(false)
    } finally {
      setIsLoading(false)
      setIsDonating(false)
    }
  }

  return (
    <div className="flex flex-col">
      <ProgressBar progress={progress} />
      <div className="flex justify-center my-2">
        <p className="text-center mx-2 font-bold">
          {localBalance.toString()} / {goal.toString()}{" "}
        </p>
        <Image src={icon || ""} alt="icon" width={24} height={24} />
      </div>
      <div className="flex justify-center">
        <input
          className={`border p-2 my-5  w-1/4 ${error ? "border-red-500" : "border-gray-400"}`}
          type="number"
          placeholder="Enter the amount of STRK"
          onChange={handleAmountChange}
          value={amount}
          min={0}
          required
          disabled={isLoading}
        />
      </div>
      {error && (
        <p className={`text-center mb-4 ${error === "Transaction successful!" ? "text-green-500" : "text-red-500"}`}>
          {error}
        </p>
      )}
      <div className="text-center">
        <button
          disabled={(chainId !== CHAIN_ID && chainId !== BRAAVOS_CHAIN_ID) || !wallet || isDonating}
          onClick={handleDonateClick}
          className={`self-center bg-darkblue text-white py-3 px-10 md:py-3 md:px-10
          text-xs md:text-sm shadow-xl hover:bg-starkorange active:bg-darkblue ease-in-out
          duration-500 active:duration-0 shadow-gray-400 ${(chainId !== CHAIN_ID && chainId !== BRAAVOS_CHAIN_ID) || isDonating ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isDonating === true ? "Donating..." : "Donate"}
        </button>
        {wallet && chainId !== CHAIN_ID && chainId !== BRAAVOS_CHAIN_ID && (
          <p className="text-sm text-gray-500 mt-2">
            Your wallet is currently connected to the wrong network. Please switch to {CHAIN_ID} to continue.
          </p>
        )}
        {!wallet && <p className="text-sm text-gray-500 mt-2">Please connect your wallet to donate.</p>}
      </div>

      {showSuccessPopup && (
        <div className="fixed inset-0 bg-white bg-opacity-100 flex justify-center items-center">
          <div className="w-[400px] flex flex-col items-center justify-center gap-4 text-center bg-white p-5">
            <h2 className="text-base font-bold">Success 🚀</h2>
            <p className="text-sm text-gray-600">
              Your vote was submitted, take a look at the transaction{" "}
              <a
                className="text-blue-600 hover:underline"
                target="_blank"
                href={"https://voyager.online/tx/" + latestTx}
                rel="noreferrer"
              >
                here
              </a>
              .
            </p>
            <p className="text-sm text-gray-600">Share your contribution via X to tell everyone how cool you are</p>
            <ShareXButton message={donationMessage} />
          </div>
        </div>
      )}
    </div>
  )
}

export default FundDonate

