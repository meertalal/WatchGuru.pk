/**
 * Thin typed client for the WatchGuru.pk API.
 *
 * The API always answers with an envelope:
 *   success → { "data": ... }
 *   error   → { "error": { "code", "message", "fields"? } }
 *
 * `request<T>()` unwraps `data` and throws `ApiError` for anything else, so
 * callers never have to inspect status codes or envelopes themselves.
 */

const rawBase = (import.meta.env.VITE_API_URL as string | undefined)?.trim()
export const API_BASE_URL = rawBase ? rawBase.replace(/\/+$/, '') : '/api'

const TOKEN_KEY = 'watchguru-pk:admin-token:v1'

/** Field-level validation messages keyed by the API's field path. */
export type ApiFieldErrors = Record<string, string>

export class ApiError extends Error {
  readonly status: number
  readonly code: string
  readonly fields: ApiFieldErrors

  constructor(status: number, code: string, message: string, fields: ApiFieldErrors = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.fields = fields
  }

  /** True for the error the API returns when a lookup simply misses. */
  get isNotFound(): boolean {
    return this.status === 404
  }
}

/** Message suitable for a toast or inline alert. */
export function errorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (error instanceof ApiError && error.message) return error.message
  if (error instanceof Error && error.message) return error.message
  return fallback
}

/* ------------------------------------------------------------------ */
/*  Admin token storage                                                */
/* ------------------------------------------------------------------ */

export function getAdminToken(): string | null {
  try {
    return window.localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setAdminToken(token: string | null): void {
  try {
    if (token) window.localStorage.setItem(TOKEN_KEY, token)
    else window.localStorage.removeItem(TOKEN_KEY)
  } catch {
    /* storage unavailable: the session simply will not survive a reload */
  }
}

export function clearAdminToken(): void {
  setAdminToken(null)
}

/* ------------------------------------------------------------------ */
/*  Requests                                                           */
/* ------------------------------------------------------------------ */

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  /** Attach the stored admin bearer token. */
  auth?: boolean
  signal?: AbortSignal
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = false, signal } = options
  const headers: Record<string, string> = { Accept: 'application/json' }

  if (body !== undefined) headers['Content-Type'] = 'application/json'

  if (auth) {
    const token = getAdminToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  let response: Response

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      signal,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error
    throw new ApiError(
      0,
      'NETWORK_ERROR',
      'Cannot reach the WatchGuru.pk service. Check your connection and try again.',
    )
  }

  const text = await response.text()
  let payload: unknown = null

  if (text) {
    try {
      payload = JSON.parse(text)
    } catch {
      payload = null
    }
  }

  if (!response.ok) {
    const envelope = (payload as { error?: { code?: string; message?: string; fields?: ApiFieldErrors } } | null)
      ?.error

    throw new ApiError(
      response.status,
      envelope?.code ?? 'REQUEST_FAILED',
      envelope?.message ?? 'The request could not be completed.',
      envelope?.fields ?? {},
    )
  }

  return (payload as { data?: T } | null)?.data as T
}
