
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { eventsTable, eventRegistrationsTable } from '../db/schema';
import { type CreateEventRegistrationInput, type CreateEventInput } from '../schema';
import { registerForEvent } from '../handlers/register_for_event';
import { eq, and, count } from 'drizzle-orm';

// Create future dates for testing
const futureStartDate = new Date();
futureStartDate.setDate(futureStartDate.getDate() + 30); // 30 days from now

const futureEndDate = new Date();
futureEndDate.setDate(futureEndDate.getDate() + 31); // 31 days from now

const futureDeadline = new Date();
futureDeadline.setDate(futureDeadline.getDate() + 25); // 25 days from now

// Test event data with future dates
const testEvent: CreateEventInput = {
  title: 'Geological Survey Workshop',
  description: 'Learn about geological formations',
  start_date: futureStartDate,
  end_date: futureEndDate,
  location: 'Bandung Geological Museum',
  max_participants: 2,
  registration_deadline: futureDeadline
};

// Test registration input
const testRegistrationInput: CreateEventRegistrationInput = {
  event_id: 1,
  participant_name: 'John Doe',
  participant_email: 'john.doe@example.com',
  participant_phone: '+62812345678'
};

describe('registerForEvent', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should register a participant for an event', async () => {
    // Create test event first
    const eventResult = await db.insert(eventsTable)
      .values(testEvent)
      .returning()
      .execute();

    const registrationInput = {
      ...testRegistrationInput,
      event_id: eventResult[0].id
    };

    const result = await registerForEvent(registrationInput);

    // Verify registration fields
    expect(result.event_id).toEqual(eventResult[0].id);
    expect(result.participant_name).toEqual('John Doe');
    expect(result.participant_email).toEqual('john.doe@example.com');
    expect(result.participant_phone).toEqual('+62812345678');
    expect(result.status).toEqual('pending');
    expect(result.id).toBeDefined();
    expect(result.registration_date).toBeInstanceOf(Date);
  });

  it('should save registration to database', async () => {
    // Create test event
    const eventResult = await db.insert(eventsTable)
      .values(testEvent)
      .returning()
      .execute();

    const registrationInput = {
      ...testRegistrationInput,
      event_id: eventResult[0].id
    };

    const result = await registerForEvent(registrationInput);

    // Query database to verify registration was saved
    const registrations = await db.select()
      .from(eventRegistrationsTable)
      .where(eq(eventRegistrationsTable.id, result.id))
      .execute();

    expect(registrations).toHaveLength(1);
    expect(registrations[0].participant_name).toEqual('John Doe');
    expect(registrations[0].participant_email).toEqual('john.doe@example.com');
    expect(registrations[0].status).toEqual('pending');
  });

  it('should reject registration for non-existent event', async () => {
    const registrationInput = {
      ...testRegistrationInput,
      event_id: 999 // Non-existent event ID
    };

    await expect(registerForEvent(registrationInput))
      .rejects.toThrow(/event not found or not active/i);
  });

  it('should reject registration for inactive event', async () => {
    // Create inactive event - need to insert with is_active = false explicitly
    const eventResult = await db.insert(eventsTable)
      .values({
        ...testEvent,
        is_active: false
      })
      .returning()
      .execute();

    const registrationInput = {
      ...testRegistrationInput,
      event_id: eventResult[0].id
    };

    await expect(registerForEvent(registrationInput))
      .rejects.toThrow(/event not found or not active/i);
  });

  it('should reject registration after deadline', async () => {
    // Create event with past registration deadline
    const pastDeadline = new Date();
    pastDeadline.setDate(pastDeadline.getDate() - 1); // Yesterday

    const pastDeadlineEvent = {
      ...testEvent,
      registration_deadline: pastDeadline
    };

    const eventResult = await db.insert(eventsTable)
      .values(pastDeadlineEvent)
      .returning()
      .execute();

    const registrationInput = {
      ...testRegistrationInput,
      event_id: eventResult[0].id
    };

    await expect(registerForEvent(registrationInput))
      .rejects.toThrow(/registration deadline has passed/i);
  });

  it('should reject registration when event is full', async () => {
    // Create event with max_participants = 1
    const limitedEvent = {
      ...testEvent,
      max_participants: 1
    };

    const eventResult = await db.insert(eventsTable)
      .values(limitedEvent)
      .returning()
      .execute();

    // Register first participant as confirmed
    await db.insert(eventRegistrationsTable)
      .values({
        event_id: eventResult[0].id,
        participant_name: 'First Participant',
        participant_email: 'first@example.com',
        participant_phone: '+628111111111',
        status: 'confirmed'
      })
      .execute();

    const registrationInput = {
      ...testRegistrationInput,
      event_id: eventResult[0].id
    };

    await expect(registerForEvent(registrationInput))
      .rejects.toThrow(/event has reached maximum participants/i);
  });

  it('should allow registration when event has capacity', async () => {
    // Create event with max_participants = 2
    const eventResult = await db.insert(eventsTable)
      .values(testEvent) // max_participants = 2
      .returning()
      .execute();

    // Register first participant
    await db.insert(eventRegistrationsTable)
      .values({
        event_id: eventResult[0].id,
        participant_name: 'First Participant',
        participant_email: 'first@example.com',
        participant_phone: '+628111111111',
        status: 'confirmed'
      })
      .execute();

    const registrationInput = {
      ...testRegistrationInput,
      event_id: eventResult[0].id
    };

    // Second registration should succeed
    const result = await registerForEvent(registrationInput);
    expect(result.participant_name).toEqual('John Doe');
    expect(result.status).toEqual('pending');
  });

  it('should allow registration when event has no participant limit', async () => {
    // Create event without max_participants
    const unlimitedEvent = {
      ...testEvent,
      max_participants: null
    };

    const eventResult = await db.insert(eventsTable)
      .values(unlimitedEvent)
      .returning()
      .execute();

    const registrationInput = {
      ...testRegistrationInput,
      event_id: eventResult[0].id
    };

    const result = await registerForEvent(registrationInput);
    expect(result.participant_name).toEqual('John Doe');
    expect(result.status).toEqual('pending');
  });

  it('should count only confirmed registrations for capacity check', async () => {
    // Create event with max_participants = 1
    const limitedEvent = {
      ...testEvent,
      max_participants: 1
    };

    const eventResult = await db.insert(eventsTable)
      .values(limitedEvent)
      .returning()
      .execute();

    // Register participant with pending status (shouldn't count toward limit)
    await db.insert(eventRegistrationsTable)
      .values({
        event_id: eventResult[0].id,
        participant_name: 'Pending Participant',
        participant_email: 'pending@example.com',
        participant_phone: '+628222222222',
        status: 'pending'
      })
      .execute();

    const registrationInput = {
      ...testRegistrationInput,
      event_id: eventResult[0].id
    };

    // Registration should succeed because only confirmed registrations count
    const result = await registerForEvent(registrationInput);
    expect(result.participant_name).toEqual('John Doe');
    expect(result.status).toEqual('pending');
  });
});
