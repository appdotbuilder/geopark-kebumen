
import { db } from '../db';
import { contactFeedbackTable } from '../db/schema';
import { type CreateContactFeedbackInput, type ContactFeedback } from '../schema';

export const submitContactFeedback = async (input: CreateContactFeedbackInput): Promise<ContactFeedback> => {
  try {
    // Insert contact feedback record
    const result = await db.insert(contactFeedbackTable)
      .values({
        name: input.name,
        email: input.email,
        phone: input.phone,
        subject: input.subject,
        message: input.message,
        type: input.type
        // status defaults to 'pending' in schema
        // created_at and updated_at are auto-generated
      })
      .returning()
      .execute();

    const contactFeedback = result[0];
    return contactFeedback;
  } catch (error) {
    console.error('Contact feedback submission failed:', error);
    throw error;
  }
};
