import { useEffect, useRef } from 'react';
import { CandlestickData, createChart } from 'lightweight-charts';
import { useMatchBreakpointsContext } from '@pancakeswap/uikit';
import { useTranslation } from '@pancakeswap/localization';
import { Tooltip } from '@mui/material';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import { GrCircleQuestion } from "react-icons/gr";
import moment from 'moment-timezone';
import styled, { keyframes } from 'styled-components';
import { useChartData } from '../hooks/useChartData';

const formatNumber = (num: number | string | undefined | null): string => {
  let parsedNum: number;

  if (typeof num === 'string') {
    parsedNum = parseFloat(num);
  } else if (typeof num === 'number') {
    parsedNum = num;
  } else {
    return '0.00';
  }

  if (Number.isNaN(parsedNum)) {
    return '0.00';
  }

  if (parsedNum >= 1e12) {
    return `${(parsedNum / 1e12).toFixed(2)}T`;
  }
  if (parsedNum >= 1e9) {
    return `${(parsedNum / 1e9).toFixed(2)}B`;
  }
  if (parsedNum >= 1e6) {
    return `${(parsedNum / 1e6).toFixed(2)}M`;
  }
  if (parsedNum >= 1e4) {
    return `${(parsedNum / 1e4).toFixed(2)}W`;
  }
  if (parsedNum >= 1e3) {
    return `${(parsedNum / 1e3).toFixed(2)}K`;
  }
  return parsedNum.toFixed(2);
};

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

export const ChartBody = styled.div`
  display: flex;
  @media screen and (max-width: 900px) {
    flex-direction: column;
  }
`

export const Charts = styled.div`
  position: relative;
  width: 80%;
  height: 400px;
  @media screen and (max-width: 900px) {
    width: 100%;
    height: 300px;
    margin-right: -20px;
  }
`

export const ChartInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export const ChartInfoItem = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #EDEDED;
  border-radius: 8px;
  @media screen and (max-width: 900px) {
    flex: 1 1 calc(33.333% - 10px);
    max-width: calc(33.333% - 10px);
    margin-bottom: 10px;
    margin-right: 10px;
    padding: 10px 0;
    justify-content: flex-start;
  }
`

export const ChartInfoTitle = styled.div`
  text-align: center;
  font-size: 12px;
  color: #9D9D9D;
  margin-bottom: 5px;
`

export const ChartInfoValue = styled.div`
  text-align: center;
  font-size: 15px;
  font-weight: 600;
`

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

const CandlestickChart = () => {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const { data, info, loading, error } = useChartData();
  const { isDesktop } = useMatchBreakpointsContext();
  const { t } = useTranslation()

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

      const formattedData = data.map((item) => ({
        time: moment.unix(item.time).tz('UTC').local().unix(),
        open: parseFloat(item.open),
        high: parseFloat(item.high),
        low: parseFloat(item.low),
        close: parseFloat(item.close),
      }));

      candlestickSeries.setData(formattedData as unknown as CandlestickData[]);

      const priceScale = chart.priceScale('right');
      priceScale.applyOptions({
        autoScale: true,
        borderColor: '#f0f0f0',
        minimumWidth: 1,
      });

      const updateRightOffset = () => {
        const containerWidth = chartContainerRef.current?.clientWidth || 0;
        const dataPointWidth = 10;
        const calculatedRightOffset =
          (containerWidth / dataPointWidth - data.length) / 2;
        chart.timeScale().applyOptions({
          rightOffset: calculatedRightOffset > 0 ? calculatedRightOffset : 0,
        });
      };

      updateRightOffset();

      const resizeObserver = new ResizeObserver(() => {
        chart.resize(
          chartContainerRef?.current?.clientWidth || 0,
          chartContainerRef?.current?.clientHeight || 0,
        );
        updateRightOffset();
      });

      resizeObserver.observe(chartContainerRef?.current);

      return () => {
        resizeObserver.disconnect();
        chart.remove();
      };
    }

    return undefined;
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

  return (
    <ChartBody style={{ display: 'flex' }}>
      <Charts
        ref={chartContainerRef}
      />
      {
        isDesktop ? (
          <ChartInfo>
            <ChartInfoItem>
              <div>
                <ChartInfoTitle>Current Price</ChartInfoTitle>
                <ChartInfoValue>{info ? formatNumber(info.currentPrice) : '--'}</ChartInfoValue>
              </div>
            </ChartInfoItem>
            <ChartInfoItem>
              <div>
                <ChartInfoTitle>Market Cap</ChartInfoTitle>
                <ChartInfoValue>{info ? formatNumber(info.marketCap) : '--'}</ChartInfoValue>
              </div>
            </ChartInfoItem>
            <ChartInfoItem>
              <div>
                <ChartInfoTitle>cfUSD Liquidity</ChartInfoTitle>
                <ChartInfoValue>{info ? formatNumber(info.cfUSDLiquidity) : '--'}</ChartInfoValue>
              </div>
              <div style={{ marginLeft: '10px' }}>
                <ChartInfoTitle>CF01 Liquidity</ChartInfoTitle>
                <ChartInfoValue>{info ? formatNumber(info.cf01Liquidity) : '--'}</ChartInfoValue>
              </div>
            </ChartInfoItem>
            <ChartInfoItem>
              <div>
                <ChartInfoTitle style={{ display: 'flex', alignItems: 'center' }}>
                  Equivalent USD Liquidity
                  <Tooltip arrow title={'123123'} placement='top' sx={{ marginLeft: '10px' }}>
                    <HelpOutlineOutlinedIcon sx={{ width: '14px', height: '14px' }} />
                  </Tooltip>
                </ChartInfoTitle>
                <ChartInfoValue>{info ? formatNumber(info.quantity) : '--'}</ChartInfoValue>
              </div>
            </ChartInfoItem>
            <ChartInfoItem>
              <div>
                <ChartInfoTitle style={{ display: 'flex', alignItems: 'center' }}>
                  1% Depth of Volatility
                  <Tooltip arrow title={'123123'} placement='top' sx={{ marginLeft: '10px' }}>
                    <HelpOutlineOutlinedIcon sx={{ width: '14px', height: '14px' }} />
                  </Tooltip>
                </ChartInfoTitle>
                <ChartInfoValue>{info ? formatNumber(info.volatility) : '--'}</ChartInfoValue>
              </div>
            </ChartInfoItem>
          </ChartInfo>
        ) : (
          <ChartInfo>
            <div style={{ display: 'flex' }}>
              <ChartInfoItem>
                <div style={{ width: '100%' }}>
                  <ChartInfoTitle>Current Price</ChartInfoTitle>
                  <ChartInfoValue>{info ? formatNumber(info.currentPrice) : '--'}</ChartInfoValue>
                </div>
              </ChartInfoItem>
              <ChartInfoItem>
                <div style={{ width: '100%' }}>
                  <ChartInfoTitle>Market Cap</ChartInfoTitle>
                  <ChartInfoValue>{info ? formatNumber(info.marketCap) : '--'}</ChartInfoValue>
                </div>
              </ChartInfoItem>
              <ChartInfoItem>
                <div style={{ width: '100%' }}>
                  <ChartInfoTitle>cfUSD Liquidity</ChartInfoTitle>
                  <ChartInfoValue>{info ? formatNumber(info.cfUSDLiquidity) : '--'}</ChartInfoValue>
                </div>
              </ChartInfoItem>
            </div>
            <div style={{ display: 'flex' }}>
              <ChartInfoItem>
                <div style={{ width: '100%' }}>
                  <ChartInfoTitle>CF01 Liquidity</ChartInfoTitle>
                  <ChartInfoValue>{info ? formatNumber(info.cf01Liquidity) : '--'}</ChartInfoValue>
                </div>
              </ChartInfoItem>
              <ChartInfoItem>
                <div style={{ width: '100%' }}>
                  <ChartInfoTitle>cfUSD Quantity</ChartInfoTitle>
                  <ChartInfoValue>{info ? formatNumber(info.quantity) : '--'}</ChartInfoValue>
                </div>
              </ChartInfoItem>
              <ChartInfoItem>
                <div style={{ width: '100%' }}>
                  <ChartInfoTitle>1% Depth of Volatility</ChartInfoTitle>
                  <ChartInfoValue>{info ? formatNumber(info.volatility) : '--'}</ChartInfoValue>
                </div>
              </ChartInfoItem>
            </div>
          </ChartInfo>
        )
      }
    </ChartBody>
  );
};

export default CandlestickChart;
