import React, { useCallback } from 'react';
import type { PoolToken, Transaction } from '../api/pool';
import cn from "classnames";

interface TransactionsTableProps {
  transactions: Transaction[];
  poolToken: PoolToken;
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({ transactions: data, poolToken }) => {
  const transactions = data;
  transactions.length = 20
  const transactionTime = useCallback((isoTime: string) => {
    const time = new Date().getTime() - new Date(isoTime).getTime()
    return time < 60 * 1000 ? `${Math.floor(time / 1000)}秒` : time < 60 * 60 * 1000 ? `${Math.floor(time / 1000 / 60)}分` : time < 24 * 60 * 60 * 1000 ? `${Math.floor(time / 1000 / 60 / 60)}时` : `${Math.floor(time / 1000 / 60 / 60 / 24)}天`
  }, [])
  const fontColor = useCallback((amount: string) => {
    return amount !== "0" ? 'text-red-500' : 'text-green-500'
  }, [])
  return (
    <div className="overflow-x-auto w-full">
      <div className="max-h-80 overflow-y-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden w-full">
          <thead className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal sticky top-0 z-10">
            <tr>
              <th className="py-3 px-4 text-left sticky left-0 bg-gray-100 z-10">时间</th>
              <th className="py-3 px-4 text-left sticky left-16 bg-gray-100 z-10">类型</th>
              <th className="py-3 px-4 text-left">{poolToken?.token0Symbol}</th>
              <th className="py-3 px-4 text-left">{poolToken?.token1Symbol}</th>
              <th className="py-3 px-4 text-left">钱包</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm font-light">
            {transactions.map((transaction, index) => (
              <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4 sticky left-0 bg-white z-9 shadow-sm">{
                  transactionTime(transaction.isoTime)
                }</td>
                <td className={cn("py-3 px-4 sticky left-16 bg-white z-9 shadow-sm font-bold", fontColor(transaction.args.amount0In))}>{(transaction.args.amount0In === "0" ? "购买" : "出售") + poolToken?.token0Symbol}</td>
                <td className="py-3 px-4">{transaction.args.amount0In === "0" ? transaction.args.amount0Out : transaction.args.amount0In}</td>
                <td className="py-3 px-4">{Number(transaction.args.amount1In === "0" ? transaction.args.amount1Out : transaction.args.amount1In) / 1e6}</td>
                <td className="py-3 px-4">{transaction.args.sender}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionsTable;