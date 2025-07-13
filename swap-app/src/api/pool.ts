import http from "../utils/http.ts";
import { useCustomQuery } from "../utils/reactQuery.ts";
export interface Transaction {
  args: {
    amount0In: string;
    amount1In: string;
    amount0Out: string;
    amount1Out: string;
    sender: string;
    to: string;
  };
  blockNumber: string;
  isoTime: string;
  timestamp: string;
}

export interface PoolToken {
  token0: string;
  token0Name: string;
  token0Symbol: string;
  token0Decimals: number;
  token1: string;
  token1Name: string;
  token1Symbol: string;
  token1Decimals: number;
}
const getTransactions = (): Promise<Transaction[]> => {
  return http.get("/api/transactions");
};

const getPoolTokens = (): Promise<PoolToken> => {
  return http.get("/api/poolTokens");
};

export const useTransactions = () => {
  return useCustomQuery(["transactions"], getTransactions);
};

export const usePoolTokens = () => {
  return useCustomQuery(["poolTokens"], getPoolTokens);
};
