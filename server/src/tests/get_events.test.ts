
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { eventsTable } from '../db/schema';
import { getEvents } from '../handlers/get_events';

describe('getEvents', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return all active events', async () => {
    // Create test events - one active, one inactive
    await db.insert(eventsTable)
      .values([
        {
          title: 'Active Event',
          description: 'This is an active event',
          start_date: new Date('2024-06-01'),
          end_date: new Date('2024-06-02'),
          location: 'Test Location 1',
          is_active: true
        },
        {
          title: 'Geology Workshop',
          description: 'Learn about local geology',
          start_date: new Date('2024-07-01'),
          end_date: new Date('2024-07-01'),
          location: 'Geosite Museum',
          max_participants: 20,
          registration_deadline: new Date('2024-06-25'),
          is_active: true
        },
        {
          title: 'Inactive Event',
          description: 'This event is not active',
          start_date: new Date('2024-08-01'),
          end_date: new Date('2024-08-02'),
          location: 'Test Location 2',
          is_active: false
        }
      ])
      .execute();

    const result = await getEvents();

    // Should only return active events
    expect(result).toHaveLength(2);
    
    // Verify event details
    const activeEvent = result.find(e => e.title === 'Active Event');
    expect(activeEvent).toBeDefined();
    expect(activeEvent!.description).toEqual('This is an active event');
    expect(activeEvent!.location).toEqual('Test Location 1');
    expect(activeEvent!.is_active).toBe(true);
    expect(activeEvent!.id).toBeDefined();
    expect(activeEvent!.created_at).toBeInstanceOf(Date);
    expect(activeEvent!.updated_at).toBeInstanceOf(Date);

    const workshopEvent = result.find(e => e.title === 'Geology Workshop');
    expect(workshopEvent).toBeDefined();
    expect(workshopEvent!.max_participants).toEqual(20);
    expect(workshopEvent!.registration_deadline).toBeInstanceOf(Date);

    // Verify no inactive events are returned
    const inactiveEvent = result.find(e => e.title === 'Inactive Event');
    expect(inactiveEvent).toBeUndefined();
  });

  it('should return empty array when no active events exist', async () => {
    // Create only inactive events
    await db.insert(eventsTable)
      .values({
        title: 'Inactive Event',
        description: 'This event is not active',
        start_date: new Date('2024-08-01'),
        end_date: new Date('2024-08-02'),
        location: 'Test Location',
        is_active: false
      })
      .execute();

    const result = await getEvents();

    expect(result).toHaveLength(0);
    expect(Array.isArray(result)).toBe(true);
  });

  it('should handle events with all optional fields', async () => {
    // Create event with all optional fields populated
    await db.insert(eventsTable)
      .values({
        title: 'Complete Event',
        description: 'Event with all fields',
        start_date: new Date('2024-09-01'),
        end_date: new Date('2024-09-03'),
        location: 'Complete Location',
        max_participants: 50,
        registration_deadline: new Date('2024-08-25'),
        is_active: true
      })
      .execute();

    const result = await getEvents();

    expect(result).toHaveLength(1);
    const event = result[0];
    expect(event.title).toEqual('Complete Event');
    expect(event.max_participants).toEqual(50);
    expect(event.registration_deadline).toBeInstanceOf(Date);
    expect(event.start_date).toBeInstanceOf(Date);
    expect(event.end_date).toBeInstanceOf(Date);
  });
});
