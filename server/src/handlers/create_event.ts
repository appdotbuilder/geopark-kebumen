
import { db } from '../db';
import { eventsTable } from '../db/schema';
import { type CreateEventInput, type Event } from '../schema';

export const createEvent = async (input: CreateEventInput): Promise<Event> => {
  try {
    // Insert event record
    const result = await db.insert(eventsTable)
      .values({
        title: input.title,
        description: input.description,
        start_date: input.start_date,
        end_date: input.end_date,
        location: input.location,
        max_participants: input.max_participants,
        registration_deadline: input.registration_deadline
      })
      .returning()
      .execute();

    // Return the created event
    const event = result[0];
    return event;
  } catch (error) {
    console.error('Event creation failed:', error);
    throw error;
  }
};
