import type { RFQFormData, RFQSubmissionResponse, RFQ } from '@/types/rfq';
import { createOrderHistoryEntry } from './orderHistory';

/**
 * Submit RFQ (Request for Quote)
 *
 * This is a MOCK implementation. In production, this would:
 * 1. Upload attachments to AWS S3
 * 2. Submit RFQ data to backend API (PostgreSQL database)
 * 3. Send email notifications to user and sales team (SendGrid)
 * 4. Return RFQ reference number and confirmation
 *
 * @param data - Complete RFQ form data
 * @param userId - User ID if logged in (optional)
 * @returns Promise with submission response
 */
export async function submitRFQ(data: RFQFormData, userId?: string): Promise<RFQSubmissionResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  try {
    // Generate reference number
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    const referenceNumber = `RFQ-${year}-${random}`;

    // In production, this would:
    // 1. Upload files to S3 and get URLs
    const uploadedAttachments = data.attachments.map((att) => ({
      ...att,
      url: `https://s3.metalpro.ro/rfq-attachments/${referenceNumber}/${att.name}`,
    }));

    // 2. Create RFQ record in database
    const rfq: RFQ = {
      id: `rfq_${Date.now()}`,
      referenceNumber,
      status: 'submitted',
      company: data.company,
      deliveryAddress: data.deliveryAddress,
      cartSnapshot: data.cartSnapshot,
      desiredDeliveryDate: data.desiredDeliveryDate,
      incoterm: data.incoterm,
      paymentTermsPreference: data.paymentTermsPreference,
      specialRequirements: data.specialRequirements,
      notes: data.notes,
      attachments: uploadedAttachments,
      disclaimerAccepted: data.disclaimerAccepted,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      submittedAt: new Date().toISOString(),
    };

    // 3. Send email notifications (SendGrid)
    // - To user: Confirmation email with RFQ details
    // - To sales team: New RFQ notification
    await sendRFQNotifications(rfq);

    // 4. Save to order history if user is logged in
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
        // Don't fail the whole RFQ submission if history save fails
      }
    }

    // 5. Log for analytics
    console.log('RFQ Submitted:', {
      referenceNumber,
      company: data.company.legalName,
      totalItems: data.cartSnapshot.lines.length,
      totalValue: data.cartSnapshot.totals.grandTotal,
      userId: userId || 'guest',
    });

    return {
      success: true,
      rfq,
      referenceNumber,
      message: 'Cererea de ofertă a fost trimisă cu succes',
    };
  } catch (error) {
    console.error('Error submitting RFQ:', error);

    return {
      success: false,
      message: 'Eroare la trimiterea cererii de ofertă',
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
  console.log('✅ To sales team: sales@metalpro.ro');

  // In production:
  // await sendEmail({
  //   to: rfq.company.contact.email,
  //   template: 'rfq-confirmation',
  //   data: { rfq },
  // });
  //
  // await sendEmail({
  //   to: 'sales@metalpro.ro',
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
