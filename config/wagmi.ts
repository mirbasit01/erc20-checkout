// import { http, createConfig } from '@wagmi/core'
// import { sepolia } from '@wagmi/core/chains'
// import { injected } from '@wagmi/connectors'

// export const config = createConfig({
//   chains: [sepolia],
//   connectors: [injected()],
//   transports: {
//     [sepolia.id]: http(),
//   },
//   ssr: true, 
// })


// // https://sepolia.etherscan.io/address/0xaa8e23fb1079ea71e0a56f48a2aa51851d8433d0#writeContract
import { http, createConfig } from '@wagmi/core'
import { sepolia } from '@wagmi/core/chains'
import { injected } from '@wagmi/connectors'

const INFURA_API_KEY = "4eec8c85be644684bf8717dc31ed465e"

export const config = createConfig({
  chains: [sepolia],
  connectors: [injected()],
  transports: {
    [sepolia.id]: http(`https://sepolia.infura.io/v3/${INFURA_API_KEY}`),
  },
  ssr: true,
})
