"use client";

import { useConnect, useAccount, useWriteContract } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { useState } from 'react';
import { sepolia } from 'viem/chains';
import { contractAddress } from '@/utils/contractaddress';
import { contractABI } from '@/utils/contractABI';
import TokenBalance from './TokenBalance';
import { useWallet } from '@/hook/useWallet';


export const PayButton = ({ price }: { price: number }) => {
  const { connectAsync } = useConnect()
  const { address } = useAccount()
  const { writeContractAsync } = useWriteContract()
  const [started, setStarted] = useState(false)
  const [errors, setErrors] = useState<string | undefined>()
  const [completed, setCompleted] = useState(false)


  const { connectWallet, disconnectWallet } = useWallet()

  const handlePayment = async () => {
    try {
      setErrors("")
      setStarted(true)
      if(!address) {
        await connectAsync({ chainId: sepolia.id, connector: injected()})
      }

      const data = await writeContractAsync({
        chainId: sepolia.id,
        address: contractAddress,
        functionName: 'transfer',
        abi:contractABI,
        args: [
          '0xc748afDF4651ce619848202584868BAaC0C763e4',
          price * 1000000,
        ],
      })
      setCompleted(true)
      console.log(data)
    } catch(err) {
      console.log(err)
      setStarted(false)
      setErrors("Payment failed. Please try again.")
    }
  }

  return (
    <>
   <button onClick={connectWallet} style={{color: 'black', border: '1px solid black', padding: '8px 16px', borderRadius: '4px'}}>
      Connect Wallet
    
   </button>
    <p className='text-black'>
      {address}
    </p>
      {!completed && (
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
    </>
  )
}