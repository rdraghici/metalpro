import type { RFQFormData, RFQSubmissionResponse, RFQ } from '@/types/rfq';
import { createOrderHistoryEntry } from './orderHistory';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Get auth token from localStorage
 */
function getAuthToken(): string | null {
  return localStorage.getItem('token');
}

/**
 * Submit RFQ (Request for Quote)
 *
 * Submits RFQ to backend API which will:
 * 1. Store RFQ in PostgreSQL database
 * 2. Generate unique reference number
 * 3. Send email notifications (future)
 *
 * @param data - Complete RFQ form data
 * @param userId - User ID if logged in (optional)
 * @param language - Language for emails/PDFs ('ro' or 'en')
 * @returns Promise with submission response
 */
export async function submitRFQ(data: RFQFormData, userId?: string, language: 'ro' | 'en' = 'ro'): Promise<RFQSubmissionResponse> {
  try {
    // Normalize language code (handle variants like 'en-US', 'en-GB', etc.)
    const normalizedLanguage: 'ro' | 'en' = language?.startsWith('en') ? 'en' : language?.startsWith('ro') ? 'ro' : 'ro';

    console.log('🌍 RFQ Language Debug:', {
      originalLanguage: language,
      normalizedLanguage
    });

    // Get auth token (optional - RFQ can be submitted by guests)
    const token = getAuthToken();

    // Prepare items for backend
    const items = data.cartSnapshot.lines.map((line) => {
      // Debug: log product info to verify title is being captured
      console.log('📦 Cart line product:', {
        productId: line.productId,
        hasProduct: !!line.product,
        title: line.product?.title,
        sku: line.product?.sku,
      });

      return {
        productId: line.productId,
        productSku: line.product?.sku || `SKU-${line.productId}`,
        productName: line.product?.title || `Product ${line.productId}`,
        quantity: line.quantity,
        unit: line.unit,
        specs: line.specs,
        grossPrice: line.indicativeSubtotal || 0,
      };
    });

    // Calculate estimated total
    const estimatedTotal = data.cartSnapshot.totals.grandTotal;

    // Prepare request payload
    const payload = {
      companyName: data.company.legalName,
      contactPerson: data.company.contact?.name || data.company.legalName || 'N/A',
      email: data.company.contact?.email || data.email,
      phone: data.company.contact?.phone || data.phone,
      taxId: data.company.taxId,
      registrationNumber: data.company.registrationNumber,
      shippingAddress: data.deliveryAddress,
      billingAddress: data.company.billingAddress,
      incoterm: data.incoterm,
      deliveryDate: data.desiredDeliveryDate,
      notes: [data.notes, data.specialRequirements].filter(Boolean).join('\n\n'),
      items,
      estimatedTotal,
      language: normalizedLanguage, // Language for emails/PDFs (normalized)
    };

    // Submit to backend
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add authorization header only if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/api/rfq`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Eroare la trimiterea cererii' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    const result = await response.json();

    // Save to order history if user is logged in
    if (userId) {
      try {
        await createOrderHistoryEntry(userId, {
          companyInfo: data.company,
          deliveryInfo: {
            deliveryAddress: data.deliveryAddress,
            desiredDeliveryDate: data.desiredDeliveryDate,
            incoterm: data.incoterm,
          },
          cartItems: data.cartSnapshot.lines,
          specialRequirements: data.specialRequirements,
        });
        console.log('✅ Order saved to history for user:', userId);
      } catch (error) {
        console.error('Failed to save order to history:', error);
      }
    }

    // Log for analytics
    console.log('RFQ Submitted:', {
      referenceNumber: result.data.rfq.referenceNumber,
      company: data.company.legalName,
      totalItems: items.length,
      totalValue: estimatedTotal,
      userId: userId || 'guest',
    });

    // Convert backend response to frontend RFQ format
    const rfq: RFQ = {
      id: result.data.rfq.id,
      referenceNumber: result.data.rfq.referenceNumber,
      status: result.data.rfq.status.toLowerCase(),
      company: data.company,
      deliveryAddress: data.deliveryAddress,
      cartSnapshot: data.cartSnapshot,
      desiredDeliveryDate: data.desiredDeliveryDate,
      incoterm: data.incoterm,
      paymentTermsPreference: data.paymentTermsPreference,
      specialRequirements: data.specialRequirements,
      notes: data.notes,
      attachments: data.attachments,
      disclaimerAccepted: data.disclaimerAccepted,
      createdAt: result.data.rfq.submittedAt,
      updatedAt: result.data.rfq.submittedAt,
      submittedAt: result.data.rfq.submittedAt,
    };

    return {
      success: true,
      rfq,
      referenceNumber: result.data.rfq.referenceNumber,
      message: result.message || 'Cererea de ofertă a fost trimisă cu succes',
    };
  } catch (error) {
    console.error('Error submitting RFQ:', error);

    return {
      success: false,
      message: error instanceof Error ? error.message : 'Eroare la trimiterea cererii de ofertă',
      errors: [error instanceof Error ? error.message : 'Eroare necunoscută'],
    };
  }
}

/**
 * Send email notifications for new RFQ
 * This is a mock - in production would use SendGrid or similar
 */
async function sendRFQNotifications(rfq: RFQ): Promise<void> {
  // Simulate email sending delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  console.log('📧 Email notifications sent:');
  console.log(`✅ To customer: ${rfq.company.contact.email}`);
  console.log('✅ To sales team: sales@metal-direct.ro');

  // In production:
  // await sendEmail({
  //   to: rfq.company.contact.email,
  //   template: 'rfq-confirmation',
  //   data: { rfq },
  // });
  //
  // await sendEmail({
  //   to: 'sales@metal-direct.ro',
  //   template: 'new-rfq-notification',
  //   data: { rfq },
  // });
}

/**
 * Get RFQ by reference number
 * Mock implementation - in production would fetch from database
 */
export async function getRFQByReference(referenceNumber: string): Promise<RFQ | null> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Mock data - in production, fetch from database
  // return await fetch(`/api/rfq/${referenceNumber}`).then(res => res.json());

  return null; // Not implemented in mock
}

/**
 * Get all RFQs for a user (for logged-in users)
 * Mock implementation
 */
export async function getUserRFQs(userId: string): Promise<RFQ[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Mock - in production would query database
  return [];
}
