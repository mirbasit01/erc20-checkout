// components/TokenBalance.js
import { useAccount, useReadContract } from 'wagmi';
import { contractAddress } from '../utils/contractaddress';
import { contractABI } from '../utils/contractABI';

export default function TokenBalance() {
  const { address, isConnected } = useAccount();

  const { data: balance } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'balanceOf',
    args: [address]
  });

  const { data: decimals } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'decimals'
  });

  const { data: symbol } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'symbol'
  });

  if (!isConnected) return (<div>Please connect wallet</div>);

  const readableBalance = balance && decimals
    ? Number(balance) / 10 ** Number(decimals)
    : 0;

  return (
    <div className="p-4 rounded shadow">
      <h2 className="text-black font-bold mb-2">Your Token Balance</h2>
      <p className='text-black ' style={{color: 'black'}}>{readableBalance} {String(symbol)}</p>
    </div>
  );
}
