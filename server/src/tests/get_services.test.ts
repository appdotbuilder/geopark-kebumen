
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { servicesTable } from '../db/schema';
import { getServices } from '../handlers/get_services';

describe('getServices', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no services exist', async () => {
    const result = await getServices();
    expect(result).toEqual([]);
  });

  it('should return all services when no type filter is provided', async () => {
    // Create test services
    await db.insert(servicesTable).values([
      {
        name: 'Mountain Guide Service',
        type: 'guide',
        description: 'Professional mountain guiding',
        contact_info: 'guide@example.com',
        price_range: '$100-200',
        rating: '4.5'
      },
      {
        name: 'Cozy Inn',
        type: 'accommodation',
        description: 'Comfortable accommodation',
        contact_info: 'inn@example.com',
        price_range: '$50-100',
        rating: '4.2'
      },
      {
        name: 'Local Transport',
        type: 'transport',
        description: 'Reliable transportation',
        contact_info: 'transport@example.com',
        price_range: null,
        rating: null
      }
    ]).execute();

    const result = await getServices();

    expect(result).toHaveLength(3);
    expect(result[0].name).toEqual('Mountain Guide Service');
    expect(result[0].type).toEqual('guide');
    expect(result[0].rating).toEqual(4.5);
    expect(typeof result[0].rating).toEqual('number');
    
    expect(result[1].name).toEqual('Cozy Inn');
    expect(result[1].type).toEqual('accommodation');
    expect(result[1].rating).toEqual(4.2);
    expect(typeof result[1].rating).toEqual('number');

    expect(result[2].name).toEqual('Local Transport');
    expect(result[2].type).toEqual('transport');
    expect(result[2].rating).toBeNull();
  });

  it('should filter services by type when type is provided', async () => {
    // Create test services of different types
    await db.insert(servicesTable).values([
      {
        name: 'Mountain Guide',
        type: 'guide',
        description: 'Professional guiding',
        contact_info: 'guide@example.com',
        rating: '4.8'
      },
      {
        name: 'Hotel Paradise',
        type: 'accommodation',
        description: 'Luxury hotel',
        contact_info: 'hotel@example.com',
        rating: '4.3'
      },
      {
        name: 'Expert Guide',
        type: 'guide',
        description: 'Expert geological guide',
        contact_info: 'expert@example.com',
        rating: '4.9'
      }
    ]).execute();

    const result = await getServices('guide');

    expect(result).toHaveLength(2);
    expect(result[0].type).toEqual('guide');
    expect(result[1].type).toEqual('guide');
    expect(result[0].name).toEqual('Mountain Guide');
    expect(result[1].name).toEqual('Expert Guide');
    expect(result[0].rating).toEqual(4.8);
    expect(result[1].rating).toEqual(4.9);
  });

  it('should return empty array when filtering by non-existent type', async () => {
    // Create test service
    await db.insert(servicesTable).values({
      name: 'Test Service',
      type: 'guide',
      description: 'Test description',
      contact_info: 'test@example.com'
    }).execute();

    const result = await getServices('culinary');

    expect(result).toEqual([]);
  });

  it('should handle services with all fields populated', async () => {
    await db.insert(servicesTable).values({
      name: 'Premium Restaurant',
      type: 'culinary',
      description: 'Fine dining experience',
      contact_info: 'restaurant@example.com',
      price_range: '$200-300',
      rating: '4.7',
      is_active: true
    }).execute();

    const result = await getServices('culinary');

    expect(result).toHaveLength(1);
    const service = result[0];
    expect(service.name).toEqual('Premium Restaurant');
    expect(service.type).toEqual('culinary');
    expect(service.description).toEqual('Fine dining experience');
    expect(service.contact_info).toEqual('restaurant@example.com');
    expect(service.price_range).toEqual('$200-300');
    expect(service.rating).toEqual(4.7);
    expect(typeof service.rating).toEqual('number');
    expect(service.is_active).toEqual(true);
    expect(service.id).toBeDefined();
    expect(service.created_at).toBeInstanceOf(Date);
    expect(service.updated_at).toBeInstanceOf(Date);
  });
});
