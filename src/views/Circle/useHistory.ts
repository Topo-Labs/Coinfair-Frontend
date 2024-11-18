import { useEffect, useState } from 'react';
import { clientBSC, clientBase, MINT_HISTORY_DATA } from 'utils/urqlClient';

export function useRewardsPool(chainId, parent) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!chainId || !parent) {
      setLoading(false);
      setError("Missing chainId or parent");
      return undefined;
    }
  
    let isMounted = true; // 防止组件卸载后的状态更新
    let fetchCount = 0; // 计数器，限制请求次数
    const maxFetchCount = 120; // 最多请求 120 次（一小时的上限）
  
    const fetchTokens = async () => {
      if (fetchCount >= maxFetchCount) {
        clearInterval(interval); // 停止定时器
        return;
      }
  
      fetchCount += 1; // 每次请求时增加计数
      try {
        setLoading(true);
        const response = await fetch(`https://coinfair.xyz/get_tokens`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chain_id: chainId,
            parent,
          }),
        });
  
        if (!response.ok) {
          console.log(`Error fetching tokens: ${response.statusText}`);
          throw new Error(`Error fetching tokens: ${response.statusText}`);
        }
  
        const result = await response.json();
        if (isMounted) {
          setData(result.data.collectFees || []);
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
        }
      }
    };
  
    // 初次调用
    fetchTokens();
  
    // 设置定时器，每 30 秒请求一次数据
    const interval = setInterval(fetchTokens, 30000);
  
    // 清除定时器和组件卸载保护
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [chainId, parent]);

  return {
    data,
    loading,
    error,
  };
}

export function useMintHistory(chainId, account) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!account || !chainId) {
      setLoading(false);
      setData(null); // 清空数据
      setError("Missing account or chainId information");
      return undefined;
    }

    let fetchCount = 0; // 计数器，限制请求次数
    const maxFetchCount = 120; // 最多请求 120 次（一小时的上限）
    let isMounted = true; // 防止组件卸载后的状态更新

    const fetchMintHistory = async () => {
      if (fetchCount >= maxFetchCount) {
        clearInterval(interval); // 停止定时器
        return;
      }

      fetchCount += 1; // 每次请求时增加计数

      // 根据 chainId 选择不同的 client
      const client = chainId === 8453 ? clientBase : chainId === 56 ? clientBSC : null;
      if (!client) {
        setError(`Unsupported chainId: ${chainId}`);
        return;
      }

      try {
        setLoading(true);
        const result = await client.query(MINT_HISTORY_DATA, { minter: account }).toPromise();

        if (result.error) {
          setError(result.error.message);
        } else if (isMounted) {
          setData(result.data?.claims || []);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Unknown error");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // 初次调用
    fetchMintHistory();

    // 设置定时器，每 30 秒请求一次数据
    const interval = setInterval(fetchMintHistory, 30000);

    // 清除定时器和组件卸载保护
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [chainId, account]);

  return {
    data,
    loading,
    error,
  };
}

export function usePointsRank(chainId, account) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!chainId || !account) {
      setLoading(false);
      setError("Missing chainId or account");
      return undefined;
    }
  
    let isMounted = true;
    let fetchCount = 0;
    const maxFetchCount = 120;
  
    const fetchTokens = async () => {
      if (fetchCount >= maxFetchCount) {
        clearInterval(interval);
        return;
      }
  
      fetchCount += 1;
      try {
        setLoading(true);
        const response = await fetch(`https://coinfair.xyz/get_usr_info`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chain_id: chainId,
            addr: account,
          }),
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
        }
      }
    };

    fetchTokens();
  
    const interval = setInterval(fetchTokens, 30000);
  
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [chainId, account]);

  return {
    data,
    loading,
    error,
  };
}
