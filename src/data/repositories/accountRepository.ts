import type { CustomerAccount, ProfilePatch } from '../../types'
import {
  defaultStorage,
  readJson,
  storageKeys,
  writeJson,
  type StorageLike,
} from '../../lib/storage'

/**
 * Account persistence, behind an interface (DIP).
 *
 * Passwords are never stored in plain text — each account carries a random
 * salt and a SHA-256 hash (Web Crypto), falling back to a non-cryptographic
 * FNV-1a mix only in non-secure contexts (e.g. plain HTTP on a LAN), where
 * `crypto.subtle` is unavailable. This is demo-grade protection: a real
 * deployment must terminate TLS and use a server-side, slow hash
 * (bcrypt/argon2) with rate limiting.
 */
export interface RegisterInput {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
}

export type RegisterResult =
  | { ok: true; account: CustomerAccount }
  | { ok: false; error: 'EMAIL_TAKEN' | 'INVALID' }

export interface AccountRepository {
  list(): Promise<CustomerAccount[]>
  getById(id: string): Promise<CustomerAccount | null>
  register(input: RegisterInput): Promise<RegisterResult>
  authenticate(email: string, password: string): Promise<CustomerAccount | null>
  updateProfile(id: string, patch: ProfilePatch): Promise<CustomerAccount | null>
}

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T

const makeSalt = (): string => {
  const bytes = new Uint8Array(16)
  if (globalThis.crypto?.getRandomValues) globalThis.crypto.getRandomValues(bytes)
  else for (let i = 0; i < bytes.length; i += 1) bytes[i] = Math.floor(Math.random() * 256)
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

const fnv1a = (input: string): string => {
  let hash = 0x811c9dc5
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return `${(hash >>> 0).toString(16).padStart(8, '0')}${input.length.toString(16)}`
}

async function hashPassword(password: string, salt: string): Promise<string> {
  const input = `${salt}:${password}`
  if (globalThis.crypto?.subtle) {
    const data = new TextEncoder().encode(input)
    const digest = await globalThis.crypto.subtle.digest('SHA-256', data)
    return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('')
  }
  return fnv1a(input)
}

const normalizeEmail = (email: string) => email.trim().toLowerCase()

async function seedAccount(
  partial: Pick<CustomerAccount, 'firstName' | 'lastName' | 'email' | 'phone' | 'role'>,
  password: string,
): Promise<CustomerAccount> {
  const salt = makeSalt()
  return {
    id: `acct_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`,
    ...partial,
    email: normalizeEmail(partial.email),
    passwordHash: await hashPassword(password, salt),
    salt,
    createdAt: new Date().toISOString(),
    country: 'Pakistan',
  }
}

export class LocalStorageAccountRepository implements AccountRepository {
  private seeding: Promise<void> | null = null
  private readonly storage: StorageLike | null

  constructor(storage: StorageLike | null = defaultStorage()) {
    this.storage = storage
  }

  /** Creates the demo admin and demo customer exactly once. */
  private ensureSeeded(): Promise<void> {
    if (!this.seeding) this.seeding = this.seed()
    return this.seeding
  }

  private async seed(): Promise<void> {
    const existing = readJson<CustomerAccount[] | null>(this.storage, storageKeys.accounts, null)
    if (existing !== null) return
    const seeded = await Promise.all([
      seedAccount(
        {
          firstName: 'Store',
          lastName: 'Manager',
          email: 'admin@watchguru.pk',
          phone: '+923001234567',
          role: 'admin',
        },
        'admin123',
      ),
      seedAccount(
        {
          firstName: 'Demo',
          lastName: 'Customer',
          email: 'demo@watchguru.pk',
          phone: '+923221234567',
          role: 'customer',
        },
        'demo1234',
      ),
    ])
    writeJson(this.storage, storageKeys.accounts, seeded)
  }

  private readAll(): CustomerAccount[] {
    const raw = readJson<CustomerAccount[] | null>(this.storage, storageKeys.accounts, [])
    return Array.isArray(raw) ? raw : []
  }

  private writeAll(accounts: CustomerAccount[]): void {
    writeJson(this.storage, storageKeys.accounts, accounts)
  }

  async list(): Promise<CustomerAccount[]> {
    await this.ensureSeeded()
    return clone(this.readAll())
  }

  async getById(id: string): Promise<CustomerAccount | null> {
    await this.ensureSeeded()
    return clone(this.readAll().find((account) => account.id === id) ?? null)
  }

  async register(input: RegisterInput): Promise<RegisterResult> {
    await this.ensureSeeded()
    const email = normalizeEmail(input.email)
    const accounts = this.readAll()
    if (accounts.some((account) => account.email === email)) {
      return { ok: false, error: 'EMAIL_TAKEN' }
    }
    const salt = makeSalt()
    const account: CustomerAccount = {
      id: `acct_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`,
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      email,
      phone: input.phone.trim(),
      passwordHash: await hashPassword(input.password, salt),
      salt,
      role: 'customer',
      createdAt: new Date().toISOString(),
      country: 'Pakistan',
    }
    this.writeAll([...accounts, account])
    return { ok: true, account: clone(account) }
  }

  async authenticate(email: string, password: string): Promise<CustomerAccount | null> {
    await this.ensureSeeded()
    const normalised = normalizeEmail(email)
    const account = this.readAll().find((entry) => entry.email === normalised)
    if (!account) return null
    const candidate = await hashPassword(password, account.salt)
    return candidate === account.passwordHash ? clone(account) : null
  }

  async updateProfile(id: string, patch: ProfilePatch): Promise<CustomerAccount | null> {
    await this.ensureSeeded()
    const accounts = this.readAll()
    const index = accounts.findIndex((account) => account.id === id)
    if (index < 0) return null
    const current = accounts[index]
    const updated: CustomerAccount = {
      ...current,
      ...Object.fromEntries(
        Object.entries(patch).filter(([, value]) => value !== undefined),
      ),
    }
    accounts[index] = updated
    this.writeAll(accounts)
    return clone(updated)
  }
}

export const accountRepository = new LocalStorageAccountRepository()
