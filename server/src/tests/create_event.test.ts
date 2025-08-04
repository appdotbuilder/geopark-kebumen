
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { eventsTable } from '../db/schema';
import { type CreateEventInput } from '../schema';
import { createEvent } from '../handlers/create_event';
import { eq } from 'drizzle-orm';

// Test input
const testInput: CreateEventInput = {
  title: 'Geological Survey of Mount Bromo',
  description: 'An educational field trip to explore the geological formations and volcanic activity of Mount Bromo.',
  start_date: new Date('2024-06-15T08:00:00Z'),
  end_date: new Date('2024-06-15T17:00:00Z'),
  location: 'Mount Bromo, East Java',
  max_participants: 25,
  registration_deadline: new Date('2024-06-10T23:59:59Z')
};

describe('createEvent', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create an event', async () => {
    const result = await createEvent(testInput);

    // Basic field validation
    expect(result.title).toEqual('Geological Survey of Mount Bromo');
    expect(result.description).toEqual(testInput.description);
    expect(result.start_date).toEqual(testInput.start_date);
    expect(result.end_date).toEqual(testInput.end_date);
    expect(result.location).toEqual('Mount Bromo, East Java');
    expect(result.max_participants).toEqual(25);
    expect(result.registration_deadline).toEqual(testInput.registration_deadline);
    expect(result.is_active).toEqual(true); // Default value
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save event to database', async () => {
    const result = await createEvent(testInput);

    // Query using proper drizzle syntax
    const events = await db.select()
      .from(eventsTable)
      .where(eq(eventsTable.id, result.id))
      .execute();

    expect(events).toHaveLength(1);
    expect(events[0].title).toEqual('Geological Survey of Mount Bromo');
    expect(events[0].description).toEqual(testInput.description);
    expect(events[0].location).toEqual('Mount Bromo, East Java');
    expect(events[0].max_participants).toEqual(25);
    expect(events[0].is_active).toEqual(true);
    expect(events[0].created_at).toBeInstanceOf(Date);
    expect(events[0].updated_at).toBeInstanceOf(Date);
  });

  it('should handle event with null max_participants', async () => {
    const inputWithNullMax: CreateEventInput = {
      ...testInput,
      max_participants: null
    };

    const result = await createEvent(inputWithNullMax);

    expect(result.max_participants).toBeNull();
    expect(result.title).toEqual(testInput.title);
    expect(result.is_active).toEqual(true);
  });

  it('should handle event with null registration_deadline', async () => {
    const inputWithNullDeadline: CreateEventInput = {
      ...testInput,
      registration_deadline: null
    };

    const result = await createEvent(inputWithNullDeadline);

    expect(result.registration_deadline).toBeNull();
    expect(result.title).toEqual(testInput.title);
    expect(result.is_active).toEqual(true);
  });
});
