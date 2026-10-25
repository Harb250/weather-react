// One place for every network call: fetch + timeout + res.ok check.
// Every failure becomes an ApiError with a `kind` the UI can turn into a message.

export class ApiError extends Error {
  constructor(kind, message, status) {
    super(message);
    this.name = 'ApiError';
    this.kind = kind;
    this.status = status;
  }
}

const TIMEOUT_MS = 10_000;

function kindForStatus(status) {
  if (status === 404) return 'not-found';
  if (status === 429) return 'rate-limit';
  if (status >= 500) return 'server';
  return 'http';
}

export async function getJSON(url, signal) {
  // Abort on either the component's signal (unmount / new search) or the timeout.
  const timeout = AbortSignal.timeout(TIMEOUT_MS);
  const combined = signal ? AbortSignal.any([signal, timeout]) : timeout;

  let res;
  try {
    res = await fetch(url, { signal: combined });
  } catch (err) {
    if (signal?.aborted) throw err; // cancelled on purpose, not a real error
    if (timeout.aborted) throw new ApiError('timeout', 'Request timed out');
    throw new ApiError('network', 'Network request failed');
  }

  if (!res.ok) {
    throw new ApiError(kindForStatus(res.status), `HTTP ${res.status}`, res.status);
  }

  try {
    return await res.json();
  } catch {
    throw new ApiError('bad-data', 'Response was not valid JSON', res.status);
  }
}
