# ETH ERC20 Checkout

A **Next.js** project that integrates **Wagmi v2** and **Viem** to enable ERC-20 token payments, wallet connection, and blockchain interaction.

## 📌 Features
- ✅ Connect Ethereum wallet (MetaMask, WalletConnect, etc.)
- ✅ Read token balances from ERC-20 smart contracts
- ✅ Send ERC-20 token transfers
- ✅ Real-time blockchain data using `@tanstack/react-query`
- ✅ Styled with TailwindCSS
- ✅ Fully typed with TypeScript

---

## 🚀 Tech Stack
- **[Next.js 14](https://nextjs.org/)** – React framework
- **[React 18](https://react.dev/)** – UI library
- **[Wagmi v2](https://wagmi.sh/)** – React hooks for Ethereum
- **[Viem](https://viem.sh/)** – Ethereum JavaScript SDK
- **[@tanstack/react-query](https://tanstack.com/query)** – Data fetching & caching
- **[TailwindCSS](https://tailwindcss.com/)** – Styling
- **TypeScript** – Type safety

---

## 📂 Project Structure
eth-erc20-checkout/
│── public/ # Static files
│── src/
│ ├── pages/ # Next.js pages
│ ├── components/ # Reusable components
│ ├── hooks/ # Custom React hooks
│ ├── utils/ # Helper functions & constants
│ └── styles/ # Tailwind/global styles
│── package.json # Project dependencies & scripts
│── tailwind.config.js
│── tsconfig.json
└── README.md

---

## ⚙️ Installation

```bash
# 1️⃣ Clone the repository
git clone https://github.com/mirbasit01/erc20-checkout.git

# 2️⃣ Navigate to project folder
cd eth-erc20-checkout

# 3️⃣ Install dependencies
npm install

# 4️⃣ Start development server
npm run dev


🔑 Environment Variables
Create a .env.local file in the project root and set your values:

env
Copy
Edit
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_id
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourERC20TokenAddress
📖 Usage
Open the app in your browser at http://localhost:3000

Connect your Ethereum wallet

View token balance or make token transfers

Checkout with ERC-20 tokens

🛠 Scripts
Command	Description
npm run dev	Start development server
npm run build	Build the production app
npm run start	Run production build
npm run lint	Lint the codebase
