import { useEffect, useState } from 'react';
import { clientClaim, CLAIM_HISTORY_DATA } from 'utils/urqlClient';

export function useClaimHistory(account: string) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClaimHistory = async () => {
      try {
        setLoading(true);
        const result = await clientClaim.query(CLAIM_HISTORY_DATA, { parent: account }).toPromise();
        if (result.error) {
          setError(result.error);
        } else {
          setData(result.data);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchClaimHistory();
  }, []);

  return {
    data,
    loading,
    error,
  };
}
