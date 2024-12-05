import { useEffect, useState } from "react";

export function useChartData() {
  const [data, setData] = useState([]);
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
        const response = await fetch(`https://coinfair.xyz/test_kline`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        });
  
        if (!response.ok) {
          console.log(`Error fetching tokens: ${response.statusText}`);
          throw new Error(`Error fetching tokens: ${response.statusText}`);
        }
  
        const result = await response.json();
        if (isMounted) {
          setData(result || []);
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
    loading,
    error,
  };
}