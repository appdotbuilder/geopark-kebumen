
import { db } from '../db';
import { eventsTable } from '../db/schema';
import { type Event } from '../schema';
import { eq } from 'drizzle-orm';

export const getEvents = async (): Promise<Event[]> => {
  try {
    // Get all active events from the database
    const results = await db.select()
      .from(eventsTable)
      .where(eq(eventsTable.is_active, true))
      .execute();

    // Convert numeric fields back to numbers before returning
    return results.map(event => ({
      ...event,
      // No numeric fields to convert in events table - all are integers, text, or timestamps
    }));
  } catch (error) {
    console.error('Failed to fetch events:', error);
    throw error;
  }
};
