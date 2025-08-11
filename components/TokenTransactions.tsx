import { useEffect, useState } from 'react';
import { useAccount, usePublicClient } from 'wagmi';
import { parseAbiItem } from 'viem';
import { contractAddress } from '../utils/contractaddress';

export default function TokenTransactions() {
    const { address, isConnected } = useAccount();
    const publicClient = usePublicClient();
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        if (!isConnected || !address) return;

        const fetchTransactions = async () => {
            const logs = await publicClient.getLogs({
                address: contractAddress,
                event: parseAbiItem(
                    'event Transfer(address indexed from, address indexed to, uint256 value)'
                ),
                args: [
                    undefined, // from (can be undefined for all)
                    undefined, // to
                ],
                fromBlock: 0n, // start from block 0 (or your token's deployment block)
                toBlock: 'latest',
            });

            // Filter logs for only sent/received by user
            const filtered = logs.filter(
                log =>
                    log.args.from?.toLowerCase() === address.toLowerCase() ||
                    log.args.to?.toLowerCase() === address.toLowerCase()
            );

            setTransactions(filtered);
        };

        fetchTransactions();
    }, [isConnected, address, publicClient]);

    if (!isConnected) return <div>Please connect wallet</div>;

    return (
        <div className='text-black'> 
            <h2>Your Token Transactions</h2>
            <ul>
                {transactions.map((tx, idx) => (
                    <li key={idx}>
                        From: {tx.args.from} <br />
                        To: {tx.args.to} <br />
                        Amount: {String(tx.args.value)} <br />
                        TxHash: {tx.transactionHash}
                    </li>
                ))}
            </ul>
        </div>
    );
}
