export { };

declare global {
    interface Window {
        ethereum?: {
            isMiniPay?: boolean;
            request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
        };
    }
}