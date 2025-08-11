
// import { http, createConfig, noopStorage  } from '@wagmi/core'
// import { sepolia } from '@wagmi/core/chains'
// import { injected } from '@wagmi/connectors'

// const INFURA_API_KEY = "4eec8c85be644684bf8717dc31ed465e"

// export const config = createConfig({
//   chains: [sepolia],
//   connectors: [injected()],
//   transports: {
//     [sepolia.id]: http(`https://sepolia.infura.io/v3/${INFURA_API_KEY}`),
//   },
//   ssr: true,
//  })
// // import { http, createConfig, createStorage, noopStorage } from '@wagmi/core'
// // import { sepolia } from '@wagmi/core/chains'
// // import { injected } from '@wagmi/connectors'

// // const INFURA_API_KEY = "4eec8c85be644684bf8717dc31ed465e"

// // // Custom storage implementation that respects user disconnect intent
// // const customStorage: Storage = {
// //   getItem: (key: string): string | null => {
// //     // Only allow reconnection if user didn't manually disconnect
// //     if (key === 'wagmi.connected' && localStorage.getItem('user_disconnected') === 'true') {
// //       return null;
// //     }
// //     return localStorage.getItem(key);
// //   },
// //   setItem: (key: string, value: string): void => {
// //     localStorage.setItem(key, value);
// //   },
// //   removeItem: (key: string): void => {
// //     localStorage.removeItem(key);
// //   },
// //   clear: (): void => {
// //     localStorage.clear();
// //   },
// //   get length(): number {
// //     return localStorage.length;
// //   },
// //   key: (index: number): string | null => {
// //     return localStorage.key(index);
// //   }
// // }

// // export const config = createConfig({
// //   chains: [sepolia],
// //   connectors: [injected()],
// //   transports: {
// //     [sepolia.id]: http(`https://sepolia.infura.io/v3/${INFURA_API_KEY}`),
// //   },
// //   ssr: true,
  
// //   // Option 1: Completely disable persistence (prevents auto-reconnection)
// //   // storage: noopStorage,
  
// //   // Option 2: Use custom storage that respects user disconnect intent
// //   storage: createStorage({
// //     storage: customStorage,
// //   }),
  
// //   // Option 3: Use your current simple approach with noopStorage (recommended for your case)
// //   // storage: noopStorage,
// // })
import { http, createConfig, createStorage, cookieStorage } from '@wagmi/core'
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
  storage: createStorage({
    storage: cookieStorage,
    // Optional: Configure cookie behavio
    key: 'wagmi', // Cookie name prefix (default)
  }),
})

// Alternative: Custom cookie configuration
export const configWithCustomCookies = createConfig({
  chains: [sepolia],
  connectors: [injected()],
  transports: {
    [sepolia.id]: http(`https://sepolia.infura.io/v3/${INFURA_API_KEY}`),
  },
  ssr: true,
  storage: createStorage({
    storage: {
      ...cookieStorage,
      // You can override cookie settings here if needed
    },
  }),
})