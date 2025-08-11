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


export const PayButton = ({ price }: { price: number }) => {
   const { address } = useAccount()
  const { writeContractAsync } = useWriteContract()
  const [started, setStarted] = useState(false)
  const [errors, setErrors] = useState<string | undefined>()
  const [completed, setCompleted] = useState(false)
  const { signMessage, data: signData, error: signError, reset: resetSignMessage } = useSignMessage()
  const [amountq, setAmountq] = useState<string>("");
  const [toAddress, setToAddress] = useState<string>("");

  const { connectWallet, disconnectWallet, isConnected, status } = useWallet()

  const handlePayment = async () => {
    if (!amountq && !toAddress) {
      alert('Please fill in both address and amount');
      return
    }

    try {
      setErrors("")
      setStarted(true)
      // if (!address) {
      //   await connectAsync({ chainId: sepolia.id, connector: injected() })
      // }
      const amount = parseUnits(amountq.toString(), 18) // 18 decimals

      const data = await writeContractAsync({
        chainId: sepolia.id,
        address: contractAddress,
        functionName: 'transfer',
        abi: contractABI,
        args: [
          // '0xa4754D3975FA44c28E67eB4798a3607fa00c0521',
          toAddress,
          amount
        ],
      })
      setCompleted(true)
      console.log(data)
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
    localStorage.clear()
    resetSignMessage()
      console.log('Disconnected successfully')
    } catch (err) {
      console.error('Failed to disconnect', err)
    }
  }

  useEffect(() => {
    if (!address) {
      resetSignMessage()
      localStorage.removeItem('signed')
    }
  }, [address, resetSignMessage])

  useEffect(() => {
    const hasSigned = localStorage.getItem('signed')
    if (
      address && !hasSigned
    ) {
      signMessage({ message: 'sign' })
    }
  }, [status])

  useEffect(() => {
    if (signData && address) {
      localStorage.setItem('signed', signData)
    }
  }, [signData, address])


  return (
    <>
      {isConnected ? (
        <>
          <button onClick={() => { handleDisconnect() }} style={{ color: 'black', border: '1px solid black', padding: '8px 16px', borderRadius: '4px' }}>
            Disconnect Wallet

          </button>
        </>
      ) : (
        <button onClick={connectWallet} style={{ color: 'black', border: '1px solid black', padding: '8px 16px', borderRadius: '4px' }}>
          Connect Wallet

        </button>
      )}


      <p className='text-black'>
        {address}
      </p>

      <div >
        <h2>Transfer Sepolia</h2>
        <div >
          <input
            type="text"
            placeholder="Recipient Address"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            style={{ width: '500px', height: '20px', fontSize: '16px', padding: '8px' , color: 'black'}}
             className='border-4'
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Amount"
            value={amountq}
            onChange={(e) => setAmountq(e.target.value)}
            style={{ width: '200px', height: '20px', fontSize: '16px', padding: '8px', marginTop: "10px" , color: 'black',}}
            className='border-4'
          />
        </div>
        <button
          style={{ marginTop: "10px" }}
          onClick={handlePayment}
        >
          Send transaction
        </button>
        {/* {hash && <div>Transaction Hash: {hash}</div>}
        {error && <div>Error: {error.message}</div>} */}
      </div>

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