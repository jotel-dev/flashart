const { SelfAgent } = require('@selfxyz/agent-sdk');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function main() {
  const privateKey = process.env.AGENT_PRIVATE_KEY;
  if (!privateKey) {
    console.error('\x1b[31m[ERROR] AGENT_PRIVATE_KEY is not defined in your .env.local file.\x1b[0m');
    console.log('Please copy .env.example (or append to .env.local) and set a valid hex private key.');
    process.exit(1);
  }

  console.log('\n\x1b[36m==================================================');
  console.log('         CELO AI AGENT (ERC-8004) REGISTRY        ');
  console.log('==================================================\x1b[0m\n');
  
  try {
    // Instantiate the agent utilizing the private key from environment variables
    const agent = new SelfAgent({
      privateKey,
      network: 'celo', // Deployed on Celo mainnet
    });

    const agentAddress = agent.getAddress();
    console.log(`\x1b[32m[✔] Agent Wallet Initialized successfully!\x1b[0m`);
    console.log(`\x1b[33m[ℹ] Agent Address:\x1b[0m ${agentAddress}\n`);
    
    console.log('\x1b[1mNext Steps to Complete ERC-8004 + Self Agent ID Registration:\x1b[0m');
    console.log('------------------------------------------------------------');
    console.log('1. Visit the registration portal at: \x1b[34mhttps://app.ai.self.xyz/register\x1b[0m');
    console.log('2. Connect your project leader wallet (holding your Self human verify credential).');
    console.log(`3. Bind this agent address (\x1b[33m${agentAddress}\x1b[0m) to your human Passport.`);
    console.log('4. The portal generates a ZK proof linking your human checkmark to this agent key.');
    console.log('5. Once registered, your agent wallet qualifies for the Proof of Ship AI Agent prize pool!\n');
    
  } catch (error) {
    console.error('\x1b[31m[Error] Failed to initialize agent SDK:\x1b[0m', error.message || error);
  }
}

main();
