import { useEffect, useState } from "react";

export function useChartData() {
  const [data, setData] = useState([]);
  const [info, setInfo] = useState(null)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {  
    let isMounted = true;
    const timeoutId = setTimeout(() => {
      if (isMounted) {
        setLoading(false);
      }
    }, 3000);
  
    const fetchCharts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://coinfair.xyz/get_kline`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "chain_id":56,
            "token":"0x717486cbE3962E5AF43D3D3bB323e0d742C4d704"
          }),
        });
  
        if (!response.ok) {
          console.log(`Error fetching tokens: ${response.statusText}`);
          throw new Error(`Error fetching tokens: ${response.statusText}`);
        }
  
        const result = await response.json();
        console.log(result)
        if (isMounted) {
          setData(result?.kline_data || []);
          setInfo({
            currentPrice: result?.current_price,
            marketCap: result?.market_cap,
            cf01Liquidity: result?.cf01_liquidity,
            cfUSDLiquidity: result?.cfusd_liquidity,
            quantity: result?.equivalent_USD_quantity,
            volatility: result?.volatility,
          })
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          if (err instanceof Error) {
            console.error("Error fetching tokens:", err.message);
            setError(err.message);
          } else {
            console.error("Unknown error:", err);
            setError(String(err));
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          clearTimeout(timeoutId);
        }
      }
    };
  
    fetchCharts();
  
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, []);

  return {
    data,
    info,
    loading,
    error,
  };
}