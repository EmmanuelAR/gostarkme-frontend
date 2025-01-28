"use client"

import { calculatePorcentage } from "@/app/utils"
import { Button } from "@/components/ui/Button"
import ProgressBar from "@/components/ui/ProgressBar"
import ShareXButton from "@/components/ui/ShareOnX"
import { BRAAVOS_CHAIN_ID, CHAIN_ID, provider } from "@/constants"
import { activeChainId } from "@/state/activeChain"
import { walletStarknetkitLatestAtom } from "@/state/connectedWallet"
import { latestTxAtom } from "@/state/latestTx"
import { useAtom, useAtomValue } from "jotai"
import { useState } from "react"
import { CallData } from "starknet"

interface FundVoteProps {
  name: string
  upVotes: number
  upVotesNeeded: number
  addr: string
  voted: any
  setLoading: (load: boolean) => void
}

export const FundVote = ({ name, upVotes, upVotesNeeded, addr, voted, setLoading }: FundVoteProps) => {
  const wallet = useAtomValue(walletStarknetkitLatestAtom)
  const chainId = useAtomValue(activeChainId)
  const [progress, setProgress] = useState(calculatePorcentage(upVotes, upVotesNeeded))
  const [currentUpvotes, setCurrentUpvotes] = useState(upVotes)
  const voteMessage = `🗳️ Voted for ${name} on Go Stark Me! Support now: https://gostarkme.com 🙌💫 @undefined_org_ @Starknet`

  const [isVoting, setIsVoting] = useState(false)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [latestTx, setLatestTx] = useAtom(latestTxAtom)
  const [canVote, setCanVote] = useState(voted != BigInt(0) ? false : true)

  const waitForTransaction = async (hash: string) => {
    try {
      await provider.waitForTransaction(hash)
      return true
    } catch (error) {
      console.error("Error waiting for transaction:", error)
      return false
    }
  }

  const handleVoteClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    setIsVoting(true)

    try {
      const tx = await wallet?.account.execute([
        {
          contractAddress: addr,
          entrypoint: "receive_vote",
          calldata: CallData.compile({}),
        },
      ])

      if (tx) {
        const isConfirmed = await waitForTransaction(tx.transaction_hash)

        if (isConfirmed) {
          setLatestTx(tx.transaction_hash)
          setCanVote(false)
          setShowSuccessPopup(true)
          setCurrentUpvotes((prev) => Number(BigInt(prev) + BigInt(1)))
          setProgress(calculatePorcentage(Number(BigInt(upVotes) + BigInt(1)), Number(upVotesNeeded)))
        }
      }
    } catch (error: any) {
      console.log(error.message || "Transaction failed. Please try again.")
    } finally {
      setIsVoting(false)
    }
  }

  return (
    <div className="flex flex-col">
      <ProgressBar progress={progress} />
      <div className="flex justify-center items-center space-x-2 text-sm md:text-base">
        <p className="font-bold">
          {currentUpvotes.toString()} / {upVotesNeeded.toString()}
        </p>
        <p className="text-yellow-500">✨</p>
      </div>
      {isVoting ? (
        <div className="text-center">
          <Button
            label="Voting..."
            onClick={() => {}}
            className="opacity-50 cursor-not-allowed px-10 py-3 text-lg"
            disabled
          />
        </div>
      ) : wallet ? (
        !canVote ? (
          <div className="text-center">
            <Button
              label="Vote"
              onClick={() => {}}
              className="opacity-50 cursor-not-allowed px-10 py-3 text-lg"
              disabled
            />
            <p className="text-xs md:text-sm text-gray-500 mt-2">You have already voted</p>
          </div>
        ) : (
          <div className="text-center">
            <button
              onClick={handleVoteClick}
              disabled={isVoting || (chainId !== CHAIN_ID && chainId != BRAAVOS_CHAIN_ID)}
              className={`bg-darkblue text-white px-12 py-2 text-xl rounded-md shadow-md hover:bg-starkorange
              active:bg-darkblue ease-in-out duration-500 ${
                chainId !== CHAIN_ID && chainId != BRAAVOS_CHAIN_ID ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Vote
            </button>
            {chainId !== CHAIN_ID && chainId != BRAAVOS_CHAIN_ID && (
              <p className="px-6 py-3 text-lg md:text-sm text-gray-500 mt-2">
                Your wallet is connected to the wrong network. Please switch to {CHAIN_ID}.
              </p>
            )}
          </div>
        )
      ) : (
        <div className="text-center">
          <Button
            label="Vote"
            onClick={() => {}}
            className="opacity-50 cursor-not-allowed px-6 py-3 text-lg"
            disabled
          />
          <p className="text-xs md:text-sm text-gray-500 mt-2">Connect your wallet to vote</p>
        </div>
      )}

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
            <ShareXButton message={voteMessage} />
          </div>
        </div>
      )}
    </div>
  )
}

