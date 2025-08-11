import { useAccount, useConnect, useDisconnect } from 'wagmi'

export const useWallet = () => {
    const { address, isConnected } = useAccount()
    const { connect, connectors, isPending: isConnecting, status } = useConnect()
    const { disconnectAsync } = useDisconnect()

    console.log('Available connectors:', connectors.map(c => ({ id: c.id, name: c.name })))

    const connectWallet = async () => {
        const metaMaskConnector = connectors.find((connector) =>
            connector.id === 'metaMask' || connector.name === 'MetaMask'
        )

        console.log('Available connectors:', connectors.map(c => ({ id: c.id, name: c.name })))
        console.log('MetaMask connector found:', metaMaskConnector)

        if (metaMaskConnector)  {

            try  {
                await connect({ connector: metaMaskConnector })
                console.log('Wallet connected successfully')
            } catch (error) {
                console.error('Failed to connect wallet:', error)
                throw error
            }
        } else {
            console.error('MetaMask connector not found. Make sure MetaMask is installed.')
            alert('MetaMask not found. Please install MetaMask extension.')
            throw new Error('MetaMask not found')
        }
    }
    const disconnectWallet = async () => {
        try {
            await disconnectAsync()
            console.log('Wallet disconnected successfully')
        } catch (error) {
            console.error('Failed to disconnect wallet:', error)
        }
    }


    return {
        address,
        isConnected,
        isConnecting,
        connectWallet,
        disconnectWallet,
        status,

    }
}
