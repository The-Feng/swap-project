import React, { useEffect, useRef } from 'react'
import type { Transaction, PoolToken } from '../api/pool'
import {
  createChart,
  ColorType,
  LineSeries,
  type IChartApi,
  type ISeriesApi
} from 'lightweight-charts';
import dayjs from 'dayjs'
interface Props {
  transactions: Transaction[];
  poolToken: PoolToken
}

const renderTransactions = (transactions: Transaction[]) => {
  return transactions.map((item) => ({
    value: item.args.amount0In === "0" ? item.args.amount0Out : item.args.amount0In,
    time: dayjs(new Date(item.isoTime)).format('YYYY-MM-DD HH:mm:ss')
  }))
}

export default function TransactionsCharts({ transactions = [] }: Props) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Line'> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const data = renderTransactions(transactions)

    // 创建图表
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#ffffff' },
        textColor: '#333',
      },
      grid: {
        vertLines: { color: '#f0f0f0' },
        horzLines: { color: '#f0f0f0' },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
      },
      localization: {
        dateFormat: 'yyyy-MM-dd HH:mm:ss',
      }
    });

    chartRef.current = chart;

    // 添加折线图系列
    const lineSeries = chart.addSeries(LineSeries) as ISeriesApi<'Line'>;

    lineSeries.applyOptions({
      priceFormat: {
        type: 'custom' as const,
        minMove: 0.01,
        formatter: (price: number): string => `$${price.toFixed(2)}`,
      },
    });

    seriesRef.current = lineSeries;

    // // 设置数据
    lineSeries.setData(data);

    // 清理函数
    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [transactions]);
  return (
    <div className="h-80 w-full">
      <div ref={chartContainerRef} className="h-full w-full" />
    </div>
  )
}