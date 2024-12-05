import { useEffect, useRef } from 'react';
import { CandlestickData, createChart } from 'lightweight-charts';
import moment from 'moment-timezone';  // 引入 moment-timezone
import styled, { keyframes } from 'styled-components';
import { useChartData } from '../hooks/useChartData';

const spinScale = keyframes`
  0% {
    transform: scale(0.8) rotate(0deg);
  }
  50% {
    transform: scale(1.2) rotate(180deg);
  }
  100% {
    transform: scale(0.8) rotate(360deg);
  }
`;

export const LoadingRing = styled.div`
  width: 100%;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  &::before {
    content: '';
    width: 50px;
    height: 50px;
    border: 5px solid rgba(0, 0, 0, 0.2);
    border-top: 5px solid black;
    border-radius: 50%;
    animation: ${spinScale} 1.5s infinite ease-in-out;
  }
`;

const CandlestickChart = ({}) => {
  const chartContainerRef = useRef(null);
  const { data, loading, error } = useChartData();

  console.log(data, loading);

  useEffect(() => {
    if (chartContainerRef.current && !loading && data && data.length > 0) {
      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
        crosshair: {
          mode: 0,
        },
        timeScale: {
          timeVisible: true,
          secondsVisible: true,
        },
      });

      const candlestickSeries = chart.addCandlestickSeries();

      const formattedData = data.map(item => ({
        time: moment.unix(item.time).tz("UTC").local().unix(),
        open: parseFloat(item.open),
        high: parseFloat(item.high),
        low: parseFloat(item.low),
        close: parseFloat(item.close),
      }));

      candlestickSeries.setData(formattedData as unknown as CandlestickData[]);

      const resizeObserver = new ResizeObserver(() => {
        chart.resize(chartContainerRef.current.clientWidth, chartContainerRef.current.clientHeight);
      });

      resizeObserver.observe(chartContainerRef.current);

      // Cleanup: 在组件卸载时清理 chart 实例和 resizeObserver
      return () => {
        resizeObserver.disconnect();
        chart.remove();
      };
    }
  }, [data, loading]);

  if (loading) {
    return (
      <div style={{ position: 'relative', width: '100%', height: '400px' }}>
        <LoadingRing />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ position: 'relative', width: '100%', height: '400px' }}>
        Error loading chart data.
      </div>
    );
  }

  return <div ref={chartContainerRef} style={{ position: 'relative', width: '100%', height: '400px' }} />;
};

export default CandlestickChart;
