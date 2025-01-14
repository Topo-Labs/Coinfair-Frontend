const cache = {};
const cacheMax = 100;

function generateKey(dependencies: any[]) {
  return dependencies.join("-")
}

export default function useSearchCacheData(key: any[]): { listData: string[], page: number } | null {
  const keyString = generateKey(key)
  if (cache[keyString]) {
    return cache[keyString]
  }
  return null;
}

export function useStorageCacheData(key: any[], value: { listData: string[], page: number }) {
  if (Object.keys(cache).length > cacheMax) {
    delete cache[Object.keys(cache)[0]]
  }
  if (value.listData && value.page) {
    const keyString = generateKey(key)
    cache[keyString] = value;
  }
}