import { useTransactions, usePoolTokens } from "./api/pool"
import TransactionsTable from "./components/TransactionsTable"
import TransactionsCharts from './components/TransactionsCharts'

export default function App() {
  const { data: transactions } = useTransactions()
  const { data: poolTokens } = usePoolTokens()
  return (
    <div>
      <TransactionsCharts transactions={transactions || []} poolToken={poolTokens!} />
      <TransactionsTable transactions={transactions || []} poolToken={poolTokens!} />
    </div>
  )
}
