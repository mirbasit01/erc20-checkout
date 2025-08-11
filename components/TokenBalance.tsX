import { useAccount, useReadContract } from 'wagmi';
import { useEffect } from 'react';
import { contractAddress } from '../utils/contractaddress';
import { contractABI } from '../utils/contractABI';

export default function TokenBalance() {
  const { address, isConnected } = useAccount();

  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'balanceOf',
    args: [address],
    query: { enabled: !!address } // prevents fetching until address is available
  });

  const { data: decimals } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'decimals',
    query: { enabled: !!address }
  });

  const { data: symbol } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'symbol',
    query: { enabled: !!address }
  });

   useEffect(() => {
    if (isConnected) {
      refetchBalance();
    }
  }, [isConnected, address, refetchBalance]);

  if (!isConnected) return <div>Please connect wallet</div>;

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
