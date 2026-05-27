# FlashArt – AI Image Generation on Celo

FlashArt is a premium, high-tech, bento-grid Web3 dashboard that generates AI-powered artwork directly on-chain using the Celo network. 

Built with Next.js 16, React 19, and Tailwind CSS v4, it features a custom light/dark theme switch, responsive bento grid structure, and an autonomous AI Agent that registers image deliveries directly on the blockchain.

---

## Technical Features
1. **Premium Bento-Grid UI**: Modular glassmorphic visual widgets presenting selection settings, preview cards, pricing metrics, and real-time transaction ledger specifications.
2. **Scrolling Tech-Grid Background**: A dynamic scrolling mesh background animation paired with fading pastel glows customized for light and dark viewports.
3. **Celo AI Agent Delivery Receipts**: Satisfies the Celo Proof of Ship AI Agent requirements. For every generated artwork, the verified Agent Wallet broadcasts a transaction to the user's Celo address with the prompt details and image URL stored inside the hex data payload.
4. **Celo Network Auto-Switching**: Automatically prompts MetaMask or other client wallets to switch their network to Celo (Chain ID `42220`) if they are on an incorrect network (e.g. Ethereum).

---

## AI Agent Integration & Setup (Item #3)

To qualify for the **AI Agents Prize Pool** in the Celo Proof of Ship builder program, your agent must be registered with **ERC-8004** and **Self Agent ID**.

### 1. Configure the Agent Wallet
Rename `.env.example` or update `.env.local` in your root directory to include the following:
```env
STABILITY_API_KEY=your_stability_ai_key
# The private key of your AI Agent's Celo wallet (hex string starting with 0x)
AGENT_PRIVATE_KEY=0x_your_agent_private_key
```

### 2. Run the Initialization & Registration Script
Run the helper script using Node.js to load the SDK, initialize your agent wallet, and retrieve its Celo address:
```bash
node scripts/register-agent.js
```

### 3. Bind the Agent to Self Agent ID (ZK-Proof)
Follow the CLI instructions printed by the script:
1. Visit the registration portal at: **[app.ai.self.xyz/register](https://app.ai.self.xyz/register)**
2. Connect your Project Leader wallet (holding your Self human verify checkmark).
3. Bind your Agent Address (shown in the terminal) to your human Passport identity.
4. Once completed, your agent is officially registered with **ERC-8004** and qualifies for the prize pools!

---

## Local Development

First, install dependencies:
```bash
npm install
```

Start the local development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to launch the dashboard.

To compile a production build and run TypeScript checks:
```bash
npm run build
```
