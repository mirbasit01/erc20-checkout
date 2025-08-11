 
import { useAccount, useReadContracts } from 'wagmi';
import { useEffect } from 'react';
import { contractAddress } from '../utils/contractaddress';
import { contractABI } from '../utils/contractABI';

export default function TokenBalance() {
  const { address, isConnected } = useAccount();

  const {
    data,
    refetch,
    isLoading,
    isError} = useReadContracts({
    contracts: [
      {
        address: contractAddress,
        abi: contractABI,
        functionName: 'balanceOf',
        args: [address],
      },
      {
        address: contractAddress,
        abi: contractABI,
        functionName: 'decimals',
      },
      {
        address: contractAddress,
        abi: contractABI,
        functionName: 'symbol',
      }
    ],
    query: { enabled: !!address } // Only fetch when wallet is connected
  });

  useEffect(() => {
    if (isConnected) {
      refetch();
    }
  }, [isConnected, address, refetch]);

  if (!isConnected) return <div className="text-black">Please connect wallet</div>;
  if (isLoading) return <div className="text-black">Loading...</div>;
  if (isError) return <div className="text-red-500">Error fetching balance</div>;

  // data will be an array in the same order as contracts[]
  const balance = data?.[0]?.result;
  const decimals = data?.[1]?.result;
  const symbol = data?.[2]?.result;

  const readableBalance = balance && decimals
    ? Number(balance) / 10 ** Number(decimals)
    : 0;

  return (
    <div className="p-4 rounded shadow">
      <h2 className="text-black font-bold mb-2">Your Token Balance</h2>
      <p className="text-black">
        {readableBalance} {String(symbol)}
      </p>
    </div>
  );
}

