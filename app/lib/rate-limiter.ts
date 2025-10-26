interface Attempt {
  count: number;
  expiry: number;
}

const attemptsCache = new Map<string, Attempt>();

const MAX_ATTEMPTS = 5;
const LOCKOUT_PERIOD = 15 * 60 * 1000;

function getIp(headers: Headers): string {
  return headers.get('x-forwarded-for') ?? '127.0.0.1';
}

function check(ip: string): { success: true } | { success: false; error: string } {
  const now = Date.now();
  const attempt = attemptsCache.get(ip);

  if (attempt && attempt.expiry > now && attempt.count >= MAX_ATTEMPTS) {
    const timeLeft = Math.ceil((attempt.expiry - now) / 1000 / 60);
    return {
      success: false,
      error: `Muitas tentativas de login. Por favor, tente novamente em ${timeLeft} minutos.`,
    };
  }

  return { success: true };
}

function recordFailure(ip: string): void {
  const now = Date.now();
  let attempt = attemptsCache.get(ip);

  if (!attempt || attempt.expiry < now) {
    attempt = { count: 0, expiry: now + LOCKOUT_PERIOD };
  }

  attempt.count++;
  attemptsCache.set(ip, attempt);
}

function clear(ip: string): void {
  attemptsCache.delete(ip);
}

export const rateLimiter = {
  getIp,
  check,
  recordFailure,
  clear,
};
