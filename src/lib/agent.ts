import { createWalletClient, http, stringToHex } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { celo } from 'viem/chains';

// A mock private key for fallback during local development/builds if AGENT_PRIVATE_KEY is unset
const MOCK_PRIVATE_KEY = '0x0000000000000000000000000000000000000000000000000000000000000001';

const getAgentAccount = () => {
  const key = process.env.AGENT_PRIVATE_KEY || MOCK_PRIVATE_KEY;
  return privateKeyToAccount(key as `0x${string}`);
};

export const getAgentAddress = (): string => {
  try {
    return getAgentAccount().address;
  } catch {
    return '0x0000000000000000000000000000000000000000';
  }
};

/**
 * Sends an on-chain transaction receipt representing the delivery of the generated art.
 * The transaction is sent from the Agent's wallet to the User's wallet on Celo.
 * The prompt and metadata are stored in hex format in the transaction payload (data).
 */
export async function sendAgentReceipt(userAddress: string, prompt: string, imageUrl: string): Promise<string> {
  // If the agent private key is not configured, we fallback to a simulated hash
  if (!process.env.AGENT_PRIVATE_KEY) {
    console.log('[AI AGENT] Simulation Mode: No AGENT_PRIVATE_KEY set. Returning mock transaction.');
    return 'simulated_agent_tx_' + Date.now();
  }

  try {
    const account = getAgentAccount();
    const client = createWalletClient({
      account,
      chain: celo,
      transport: http(),
    });

    const payload = {
      spec: 'ERC-8004-DELIVERY',
      agent: account.address,
      user: userAddress,
      prompt,
      imageUrl,
      timestamp: Date.now(),
    };

    // Broadcast a 0 CELO data transaction to register the delivery receipt on-chain
    const hash = await client.sendTransaction({
      to: userAddress as `0x${string}`,
      data: stringToHex(JSON.stringify(payload)),
      value: BigInt(0),
    });

    return hash;
  } catch (error) {
    console.error('[AI AGENT] Error broadcasting delivery receipt transaction:', error);
    // Return a failed simulation hash so the backend does not crash on missing gas or provider errors
    return 'simulated_agent_tx_failed_' + Date.now();
  }
}
