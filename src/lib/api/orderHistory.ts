/**
 * Order History (RFQ History) API
 *
 * Mock implementation using localStorage
 */

import type { OrderHistoryItem, RFQStatus } from '@/types/user';

const STORAGE_KEY = 'metalpro_order_history';

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Get all order history items from localStorage
 */
function getOrderHistory(): OrderHistoryItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Save order history to localStorage
 */
function saveOrderHistory(items: OrderHistoryItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

/**
 * Get order history for a specific user
 */
export async function getUserOrderHistory(userId: string): Promise<OrderHistoryItem[]> {
  await delay(300);
  const history = getOrderHistory();
  return history
    .filter((item) => item.userId === userId)
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
}

/**
 * Get single order by ID
 */
export async function getOrder(orderId: string): Promise<OrderHistoryItem | null> {
  await delay(200);
  const history = getOrderHistory();
  return history.find((item) => item.id === orderId) || null;
}

/**
 * Create new order history entry (when RFQ is submitted)
 */
export async function createOrderHistoryEntry(
  userId: string,
  rfqData: {
    companyInfo: any;
    deliveryInfo: any;
    cartItems: any[];
    specialRequirements?: string;
  }
): Promise<OrderHistoryItem> {
  await delay(400);

  console.log('📝 Creating order history entry for user:', userId);
  console.log('📦 RFQ Data:', rfqData);

  const newOrder: OrderHistoryItem = {
    id: `order_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    userId,
    status: 'submitted',
    rfqData,
    submittedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const history = getOrderHistory();
  console.log('📚 Current history count:', history.length);

  history.push(newOrder);
  saveOrderHistory(history);

  console.log('✅ Order saved! New history count:', history.length);
  console.log('💾 Saved to localStorage key:', STORAGE_KEY);

  return newOrder;
}

/**
 * Update order status
 */
export async function updateOrderStatus(
  orderId: string,
  status: RFQStatus
): Promise<OrderHistoryItem> {
  await delay(300);

  const history = getOrderHistory();
  const index = history.findIndex((item) => item.id === orderId);

  if (index === -1) {
    throw new Error('Order not found');
  }

  const updatedOrder = {
    ...history[index],
    status,
    updatedAt: new Date().toISOString(),
  };

  history[index] = updatedOrder;
  saveOrderHistory(history);

  return updatedOrder;
}

/**
 * Add quote details to order (when sales team provides quote)
 */
export async function addQuoteToOrder(
  orderId: string,
  quote: {
    totalPrice: number;
    currency: string;
    validUntil: string;
    notes?: string;
  }
): Promise<OrderHistoryItem> {
  await delay(300);

  const history = getOrderHistory();
  const index = history.findIndex((item) => item.id === orderId);

  if (index === -1) {
    throw new Error('Order not found');
  }

  const updatedOrder = {
    ...history[index],
    status: 'quoted' as RFQStatus,
    quote,
    updatedAt: new Date().toISOString(),
  };

  history[index] = updatedOrder;
  saveOrderHistory(history);

  return updatedOrder;
}

/**
 * Get order statistics for user
 */
export async function getOrderStatistics(userId: string): Promise<{
  total: number;
  byStatus: Record<RFQStatus, number>;
}> {
  await delay(200);

  const history = await getUserOrderHistory(userId);

  const byStatus: Record<RFQStatus, number> = {
    submitted: 0,
    acknowledged: 0,
    in_progress: 0,
    quoted: 0,
    completed: 0,
    cancelled: 0,
  };

  history.forEach((item) => {
    byStatus[item.status]++;
  });

  return {
    total: history.length,
    byStatus,
  };
}
