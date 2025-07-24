import { http, createConfig } from '@wagmi/core'
import { sepolia } from '@wagmi/core/chains'
import { injected } from '@wagmi/connectors'

export const config = createConfig({
  chains: [sepolia],
  connectors: [injected()],
  transports: {
    [sepolia.id]: http(),
  },
  ssr: true, 
})


// https://sepolia.etherscan.io/address/0xaa8e23fb1079ea71e0a56f48a2aa51851d8433d0#writeContract