/**
 * Saved Addresses API
 *
 * Mock implementation using localStorage
 */

import type { SavedAddress, AddressType } from '@/types/user';

const STORAGE_KEY = 'metalpro_addresses';

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Get all addresses from localStorage
 */
function getAddresses(): SavedAddress[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Save addresses to localStorage
 */
function saveAddresses(addresses: SavedAddress[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
}

/**
 * Get addresses for a specific user
 */
export async function getUserAddresses(userId: string): Promise<SavedAddress[]> {
  await delay(300);
  const addresses = getAddresses();
  return addresses.filter((addr) => addr.userId === userId);
}

/**
 * Get default address for a user by type
 */
export async function getDefaultAddress(
  userId: string,
  type: AddressType
): Promise<SavedAddress | null> {
  await delay(200);
  const addresses = await getUserAddresses(userId);
  return addresses.find((addr) => addr.type === type && addr.isDefault) || null;
}

/**
 * Create new address
 */
export async function createAddress(
  userId: string,
  data: Omit<SavedAddress, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<SavedAddress> {
  await delay(400);

  const newAddress: SavedAddress = {
    id: `addr_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    userId,
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const addresses = getAddresses();

  // If this is set as default, unset other defaults of same type
  if (newAddress.isDefault) {
    addresses.forEach((addr) => {
      if (addr.userId === userId && addr.type === newAddress.type && addr.isDefault) {
        addr.isDefault = false;
        addr.updatedAt = new Date().toISOString();
      }
    });
  }

  addresses.push(newAddress);
  saveAddresses(addresses);

  return newAddress;
}

/**
 * Update address
 */
export async function updateAddress(
  addressId: string,
  updates: Partial<Omit<SavedAddress, 'id' | 'userId' | 'createdAt'>>
): Promise<SavedAddress> {
  await delay(400);

  const addresses = getAddresses();
  const index = addresses.findIndex((addr) => addr.id === addressId);

  if (index === -1) {
    throw new Error('Address not found');
  }

  const address = addresses[index];
  const updatedAddress = {
    ...address,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  // If setting as default, unset other defaults
  if (updates.isDefault && !address.isDefault) {
    addresses.forEach((addr) => {
      if (addr.userId === address.userId && addr.type === address.type && addr.id !== addressId) {
        addr.isDefault = false;
        addr.updatedAt = new Date().toISOString();
      }
    });
  }

  addresses[index] = updatedAddress;
  saveAddresses(addresses);

  return updatedAddress;
}

/**
 * Delete address
 */
export async function deleteAddress(addressId: string): Promise<void> {
  await delay(300);

  const addresses = getAddresses();
  const filtered = addresses.filter((addr) => addr.id !== addressId);
  saveAddresses(filtered);
}

/**
 * Set address as default
 */
export async function setDefaultAddress(addressId: string): Promise<SavedAddress> {
  return updateAddress(addressId, { isDefault: true });
}
