"use client";

import { useConnect, useAccount, useWriteContract } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { useState } from 'react';
import { sepolia } from 'viem/chains';
import { contractAddress } from '@/utils/contractaddress';
import { contractABI } from '@/utils/contractABI';


export const PayButton = ({ price }: { price: number }) => {
  const { connectAsync } = useConnect()
  const { address } = useAccount()
  const { writeContractAsync } = useWriteContract()
  const [started, setStarted] = useState(false)
  const [errors, setErrors] = useState<string | undefined>()
  const [completed, setCompleted] = useState(false)

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
          '0x64498163f2b3E5AA871d335F4CBA6d5b5DcdD6BA',
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
    </>
  )
}