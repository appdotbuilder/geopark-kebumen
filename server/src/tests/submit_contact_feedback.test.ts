
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { contactFeedbackTable } from '../db/schema';
import { type CreateContactFeedbackInput } from '../schema';
import { submitContactFeedback } from '../handlers/submit_contact_feedback';
import { eq } from 'drizzle-orm';

// Test inputs for different contact feedback types
const contactInput: CreateContactFeedbackInput = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1234567890',
  subject: 'General Inquiry',
  message: 'I would like to know more about your geosite tours.',
  type: 'contact'
};

const feedbackInput: CreateContactFeedbackInput = {
  name: 'Jane Smith',
  email: 'jane.smith@example.com',
  phone: null,
  subject: 'Website Feedback',
  message: 'The website is very informative and easy to navigate.',
  type: 'feedback'
};

const complaintInput: CreateContactFeedbackInput = {
  name: 'Bob Wilson',
  email: 'bob.wilson@example.com',
  phone: '+9876543210',
  subject: 'Service Complaint',
  message: 'The tour guide was not knowledgeable about the geological features.',
  type: 'complaint'
};

describe('submitContactFeedback', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should submit a contact inquiry', async () => {
    const result = await submitContactFeedback(contactInput);

    // Basic field validation
    expect(result.name).toEqual('John Doe');
    expect(result.email).toEqual('john.doe@example.com');
    expect(result.phone).toEqual('+1234567890');
    expect(result.subject).toEqual('General Inquiry');
    expect(result.message).toEqual(contactInput.message);
    expect(result.type).toEqual('contact');
    expect(result.status).toEqual('pending');
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should submit feedback with null phone number', async () => {
    const result = await submitContactFeedback(feedbackInput);

    expect(result.name).toEqual('Jane Smith');
    expect(result.email).toEqual('jane.smith@example.com');
    expect(result.phone).toBeNull();
    expect(result.subject).toEqual('Website Feedback');
    expect(result.message).toEqual(feedbackInput.message);
    expect(result.type).toEqual('feedback');
    expect(result.status).toEqual('pending');
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should submit a complaint', async () => {
    const result = await submitContactFeedback(complaintInput);

    expect(result.name).toEqual('Bob Wilson');
    expect(result.email).toEqual('bob.wilson@example.com');
    expect(result.phone).toEqual('+9876543210');
    expect(result.subject).toEqual('Service Complaint');
    expect(result.message).toEqual(complaintInput.message);
    expect(result.type).toEqual('complaint');
    expect(result.status).toEqual('pending');
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save contact feedback to database', async () => {
    const result = await submitContactFeedback(contactInput);

    // Query database to verify record was saved
    const contactFeedbacks = await db.select()
      .from(contactFeedbackTable)
      .where(eq(contactFeedbackTable.id, result.id))
      .execute();

    expect(contactFeedbacks).toHaveLength(1);
    const saved = contactFeedbacks[0];
    expect(saved.name).toEqual('John Doe');
    expect(saved.email).toEqual('john.doe@example.com');
    expect(saved.phone).toEqual('+1234567890');
    expect(saved.subject).toEqual('General Inquiry');
    expect(saved.message).toEqual(contactInput.message);
    expect(saved.type).toEqual('contact');
    expect(saved.status).toEqual('pending');
    expect(saved.created_at).toBeInstanceOf(Date);
    expect(saved.updated_at).toBeInstanceOf(Date);
  });

  it('should handle all contact feedback types correctly', async () => {
    // Submit one of each type
    const contactResult = await submitContactFeedback(contactInput);
    const feedbackResult = await submitContactFeedback(feedbackInput);
    const complaintResult = await submitContactFeedback(complaintInput);

    // Verify all records were created with correct types
    const allFeedback = await db.select()
      .from(contactFeedbackTable)
      .execute();

    expect(allFeedback).toHaveLength(3);

    const contactRecord = allFeedback.find(f => f.id === contactResult.id);
    const feedbackRecord = allFeedback.find(f => f.id === feedbackResult.id);
    const complaintRecord = allFeedback.find(f => f.id === complaintResult.id);

    expect(contactRecord?.type).toEqual('contact');
    expect(feedbackRecord?.type).toEqual('feedback');
    expect(complaintRecord?.type).toEqual('complaint');

    // All should have default pending status
    expect(contactRecord?.status).toEqual('pending');
    expect(feedbackRecord?.status).toEqual('pending');
    expect(complaintRecord?.status).toEqual('pending');
  });
});
