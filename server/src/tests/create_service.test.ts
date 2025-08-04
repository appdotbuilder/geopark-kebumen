
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { servicesTable } from '../db/schema';
import { type CreateServiceInput } from '../schema';
import { createService } from '../handlers/create_service';
import { eq } from 'drizzle-orm';

// Test inputs for different service types
const guideServiceInput: CreateServiceInput = {
  name: 'Professional Guide Service',
  type: 'guide',
  description: 'Experienced geological tour guide',
  contact_info: 'john@guide.com | +1234567890',
  price_range: '$50-100/day',
  rating: 4.5
};

const accommodationServiceInput: CreateServiceInput = {
  name: 'Mountain Lodge',
  type: 'accommodation',
  description: 'Cozy lodge near geological sites',
  contact_info: 'lodge@mountain.com | +1234567891',
  price_range: '$80-150/night',
  rating: null
};

describe('createService', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a guide service with rating', async () => {
    const result = await createService(guideServiceInput);

    // Basic field validation
    expect(result.name).toEqual('Professional Guide Service');
    expect(result.type).toEqual('guide');
    expect(result.description).toEqual(guideServiceInput.description);
    expect(result.contact_info).toEqual(guideServiceInput.contact_info);
    expect(result.price_range).toEqual('$50-100/day');
    expect(result.rating).toEqual(4.5);
    expect(typeof result.rating).toEqual('number');
    expect(result.is_active).toEqual(true);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should create an accommodation service without rating', async () => {
    const result = await createService(accommodationServiceInput);

    // Validate service with null rating
    expect(result.name).toEqual('Mountain Lodge');
    expect(result.type).toEqual('accommodation');
    expect(result.description).toEqual(accommodationServiceInput.description);
    expect(result.contact_info).toEqual(accommodationServiceInput.contact_info);
    expect(result.price_range).toEqual('$80-150/night');
    expect(result.rating).toBeNull();
    expect(result.is_active).toEqual(true);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save service to database', async () => {
    const result = await createService(guideServiceInput);

    // Query using proper drizzle syntax
    const services = await db.select()
      .from(servicesTable)
      .where(eq(servicesTable.id, result.id))
      .execute();

    expect(services).toHaveLength(1);
    expect(services[0].name).toEqual('Professional Guide Service');
    expect(services[0].type).toEqual('guide');
    expect(services[0].description).toEqual(guideServiceInput.description);
    expect(services[0].contact_info).toEqual(guideServiceInput.contact_info);
    expect(services[0].price_range).toEqual('$50-100/day');
    expect(parseFloat(services[0].rating!)).toEqual(4.5);
    expect(services[0].is_active).toEqual(true);
    expect(services[0].created_at).toBeInstanceOf(Date);
    expect(services[0].updated_at).toBeInstanceOf(Date);
  });

  it('should create services of all service types', async () => {
    const transportService: CreateServiceInput = {
      name: 'Geo Transport',
      type: 'transport',
      description: 'Transportation to geological sites',
      contact_info: 'transport@geo.com | +1234567892',
      price_range: '$30-60/trip',
      rating: 3.8
    };

    const culinaryService: CreateServiceInput = {
      name: 'Rock Cafe',
      type: 'culinary',
      description: 'Local cuisine and refreshments',
      contact_info: 'cafe@rock.com | +1234567893',
      price_range: '$15-30/meal',
      rating: 4.2
    };

    // Create services of each type
    const guide = await createService(guideServiceInput);
    const accommodation = await createService(accommodationServiceInput);
    const transport = await createService(transportService);
    const culinary = await createService(culinaryService);

    // Verify all service types were created correctly
    expect(guide.type).toEqual('guide');
    expect(accommodation.type).toEqual('accommodation');
    expect(transport.type).toEqual('transport');
    expect(culinary.type).toEqual('culinary');

    // Verify ratings are handled correctly
    expect(guide.rating).toEqual(4.5);
    expect(accommodation.rating).toBeNull();
    expect(transport.rating).toEqual(3.8);
    expect(culinary.rating).toEqual(4.2);
  });

  it('should handle service without price range', async () => {
    const serviceWithoutPrice: CreateServiceInput = {
      name: 'Free Guide Service',
      type: 'guide',
      description: 'Volunteer geological guide',
      contact_info: 'volunteer@guide.com | +1234567894',
      price_range: null,
      rating: 4.0
    };

    const result = await createService(serviceWithoutPrice);

    expect(result.name).toEqual('Free Guide Service');
    expect(result.price_range).toBeNull();
    expect(result.rating).toEqual(4.0);
    expect(result.is_active).toEqual(true);
  });
});
