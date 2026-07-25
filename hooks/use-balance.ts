'use client';

import { useState, useEffect, useCallback } from 'react';
import type { DerivWS } from '@deriv/core';
import type { DerivAccount } from '@deriv/core';

interface UseBalanceReturn {
  accounts: DerivAccount[];
  updateAccountBalance: (accountId: string, newBalance: string) => void;
}

export function useBalance(
  ws: DerivWS | null,
  isConnected: boolean,
  isAuthenticated: boolean,
  initialAccounts: DerivAccount[]
): UseBalanceReturn {
  const [accounts, setAccounts] = useState<DerivAccount[]>(initialAccounts);

  const updateAccountBalance = useCallback((accountId: string, newBalance: string) => {
    setAccounts((prev: DerivAccount[]) =>
      prev.map((acc: DerivAccount) =>
        acc.account_id === accountId ? { ...acc, balance: newBalance } : acc
      )
    );
  }, []);

  useEffect(() => {
    if (!ws || !isConnected || !isAuthenticated) return;

    let disposed = false;

    // Subscribe to balance updates from Deriv WebSocket
    const subscribeToBalance = async () => {
      try {
        await ws.send({ balance: 1, subscribe: 1 });
      } catch {
        // Subscription failed - non-blocking
      }
    };

    // Listen for balance updates
    const unsubscribe = ws.onMessage((data) => {
      if (disposed) return;
      if (data.msg_type === 'balance') {
        const balanceData = data.balance as { balance: string; loginid: string };
        if (balanceData && balanceData.loginid && balanceData.balance) {
          updateAccountBalance(balanceData.loginid, balanceData.balance);
        }
      }
    });

    subscribeToBalance();

    return () => {
      disposed = true;
      unsubscribe();
      // Forget balance subscription on cleanup
      if (ws?.isConnected) {
        ws.send({ forget: 'balance' }).catch(() => {});
      }
    };
  }, [ws, isConnected, isAuthenticated, updateAccountBalance]);

  // Update accounts when initial accounts change (e.g., after account switch)
  useEffect(() => {
    setAccounts(initialAccounts);
  }, [initialAccounts]);

  return { accounts, updateAccountBalance };
}
