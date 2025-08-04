
import { db } from '../db';
import { eventsTable, eventRegistrationsTable } from '../db/schema';
import { type CreateEventRegistrationInput, type EventRegistration } from '../schema';
import { eq, and, count } from 'drizzle-orm';

export const registerForEvent = async (input: CreateEventRegistrationInput): Promise<EventRegistration> => {
  try {
    // First, verify the event exists and is active
    const events = await db.select()
      .from(eventsTable)
      .where(and(
        eq(eventsTable.id, input.event_id),
        eq(eventsTable.is_active, true)
      ))
      .execute();

    if (events.length === 0) {
      throw new Error('Event not found or not active');
    }

    const event = events[0];

    // Check if registration deadline has passed
    if (event.registration_deadline && new Date() > event.registration_deadline) {
      throw new Error('Registration deadline has passed');
    }

    // Check if event has reached max participants
    if (event.max_participants) {
      const registrationCount = await db.select({ count: count() })
        .from(eventRegistrationsTable)
        .where(and(
          eq(eventRegistrationsTable.event_id, input.event_id),
          eq(eventRegistrationsTable.status, 'confirmed')
        ))
        .execute();

      if (registrationCount[0].count >= event.max_participants) {
        throw new Error('Event has reached maximum participants');
      }
    }

    // Create the registration
    const result = await db.insert(eventRegistrationsTable)
      .values({
        event_id: input.event_id,
        participant_name: input.participant_name,
        participant_email: input.participant_email,
        participant_phone: input.participant_phone
      })
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Event registration failed:', error);
    throw error;
  }
};
