class CacheService {
  private static instance: CacheService;
  private cache: Map<string, { value: any; timestamp: number }>;
  private readonly ttl: number;

  private constructor(ttlSeconds: number = 3600) {
    this.cache = new Map();
    this.ttl = ttlSeconds * 1000;
    console.log("Instância do CacheService criada.");
  }

  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  public set<T>(key: string, value: T): void {
    const timestamp = Date.now();
    this.cache.set(key, { value, timestamp });
  }

  public get<T>(key: string): T | undefined {
    const item = this.cache.get(key);

    if (!item) {
      return undefined;
    }

    const isExpired = (Date.now() - item.timestamp) > this.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return undefined;
    }

    return item.value as T;
  }

  public has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;

    const isExpired = (Date.now() - item.timestamp) > this.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  public del(key: string): void {
    this.cache.delete(key);
  }

  public flush(): void {
    this.cache.clear();
  }
}

export const cache = CacheService.getInstance();
