"use client";

import { useConnect, useAccount, useWriteContract, useSignMessage } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { useEffect, useState } from 'react';
import { sepolia } from 'viem/chains';
import { contractAddress } from '@/utils/contractaddress';
import { contractABI } from '@/utils/contractABI';
import TokenBalance from './TokenBalance';
import { useWallet } from '@/hook/useWallet';
import { parseUnits } from 'viem'
import { config } from '@/config/wagmi';
import { simulateContract, waitForTransactionReceipt, writeContract } from '@wagmi/core'


export const PayButton = ({ price }: { price: number }) => {
  const { address } = useAccount()
  const { writeContractAsync } = useWriteContract()
  const [started, setStarted] = useState(false)
  const [errors, setErrors] = useState<string | undefined>()
  const [completed, setCompleted] = useState(false)
  const [amountuser, setAmountuser] = useState<string>("");
  const [toAddress, setToAddress] = useState<string>("");
  const [txHash, setTxHash] = useState<string | null>(null);
  const { connectWallet, disconnectWallet, isConnected, status } = useWallet()
  const [hasUserManuallyConnected, setHasUserManuallyConnected] = useState(false);

  const { signMessage,
    data: signData,
    error: signError,
    reset: resetSignMessage
  } = useSignMessage()

  const handlePayment = async () => {
    if (!amountuser && !toAddress) {
      alert('Please fill in both address and amount');
      return
    }
    try {
      setErrors("")
      setStarted(true)
      const amount = parseUnits(amountuser.toString(), 18)
      const { request } = await simulateContract(config, {
        chainId: sepolia.id,
        abi: contractABI,
        address: contractAddress,
        functionName: 'transfer',
        args: [toAddress, amount],
      });
      const hash = await writeContract(config, request);
      const receipt = await waitForTransactionReceipt(config, { hash });
      console.log("Transaction receipt:", receipt);
      if (receipt.status === 'success') {
        setCompleted(true);
        setTxHash(hash);
      } else {
        setErrors("Transaction failed on-chain.");
      }

      setStarted(false);
    } catch (err) {
      console.log(err)
      setStarted(false)
      setErrors("Payment failed. Please try again.")
    }
  }


  const handleDisconnect = async () => {
    try {
      console.log('Disconnecting wallet...')
      await disconnectWallet()
      localStorage.removeItem('signed')
      localStorage.removeItem('wagmi.connected')
      localStorage.removeItem('wagmi.wallet')
      console.log('Disconnected successfully')
      resetSignMessage()
      setHasUserManuallyConnected(false)
      setCompleted(false)
      setTxHash(null)
      setErrors(undefined)
    } catch (err) {
      console.error('Failed to disconnect', err)
    }
  }
  const handleConnect = async () => {
    try {
      setHasUserManuallyConnected(true)
      await connectWallet()
    } catch (err) {
      console.error('Failed to connect', err)
      setHasUserManuallyConnected(false)
    }
  }

  useEffect(() => {
    if (!address) {
      resetSignMessage()
      localStorage.removeItem('signed')
      setHasUserManuallyConnected(false)
      setCompleted(false)
      setTxHash(null)
    }
  }, [address, resetSignMessage])

  useEffect(() => {
    const hasSigned = localStorage.getItem('signed')
    if (
      address && !hasSigned && hasUserManuallyConnected && status === 'success'
    ) {
      signMessage({ message: 'sign' })
    }
  }, [address, hasUserManuallyConnected, status, signMessage])


  useEffect(() => {
    if (signData && address) {
      localStorage.setItem('signed', signData)
    }
  }, [signData, address])


  return (
    <>
      {isConnected ? (
        <>
          <button onClick={handleDisconnect} style={{ color: 'black', border: '1px solid black', padding: '8px 16px', borderRadius: '4px' }}>
            Disconnect Wallet

          </button>
        </>
      ) : (
        <button onClick={handleConnect} style={{ color: 'black', border: '1px solid black', padding: '8px 16px', borderRadius: '4px' }}>
          Connect Wallet

        </button>
      )}


      <p className='text-black'>
        {address}
      </p>

      {address ? (
        <div >
          <h2>Transfer Sepolia</h2>
          <div >
            <input
              type="text"
              placeholder="Recipient Address"
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              style={{ width: '500px', height: '20px', fontSize: '16px', padding: '8px', color: 'black' }}
              className='border-4'
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Amount"
              value={amountuser}
              onChange={(e) => setAmountuser(e.target.value)}
              style={{ width: '200px', height: '20px', fontSize: '16px', padding: '8px', marginTop: "10px", color: 'black', }}
              className='border-4'
            />
          </div>
        </div>

      ) : (
        <div>
        </div>
      )}

      {address && !completed && (
        <button
          disabled={started}
          className="mt-5 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={handlePayment}
        >
          {started ? "Confirming..." : "Pay Now"}
        </button>
      )}
      {completed && <p className='text-stone-800 mt-2 bg-green-200 rounded-md text-sm py-2 px-4'>Thank you for your payment.</p>}
      {errors && <p className='text-stone-800 mt-2 bg-red-200 rounded-md text-sm py-2 px-4'>{errors}</p>}
      <div>
        <TokenBalance />
      </div>
      {txHash && (
        <div className="text-black">
          Transaction Hash: <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank">{txHash}</a>
        </div>
      )}
      {address && (
        <>
          <button onClick={() => signMessage({ message: 'hello world' })}>
            Sign Manually (Optional)
          </button>
          {signData && <div className='text-black'>Signature: {signData}</div>}
          {signError && <div className='text-black '>{"User rejected the transaction !!"}</div>}
        </>
      )}
    </>

  )
}