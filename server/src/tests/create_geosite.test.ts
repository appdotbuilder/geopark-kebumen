
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { geositesTable } from '../db/schema';
import { type CreateGeositeInput } from '../schema';
import { createGeosite } from '../handlers/create_geosite';
import { eq } from 'drizzle-orm';

// Test input with all required fields
const testInput: CreateGeositeInput = {
  name: 'Mount Bromo',
  description: 'An active volcano and popular tourist destination in East Java',
  history: 'Mount Bromo has been active for centuries and holds significant cultural importance',
  geological_value: 'Active stratovolcano with unique geological formations',
  latitude: -7.942492,
  longitude: 112.953011,
  address: 'Bromo Tengger Semeru National Park, East Java, Indonesia'
};

describe('createGeosite', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a geosite', async () => {
    const result = await createGeosite(testInput);

    // Basic field validation
    expect(result.name).toEqual('Mount Bromo');
    expect(result.description).toEqual(testInput.description);
    expect(result.history).toEqual(testInput.history);
    expect(result.geological_value).toEqual(testInput.geological_value);
    expect(result.latitude).toEqual(-7.942492);
    expect(result.longitude).toEqual(112.953011);
    expect(result.address).toEqual(testInput.address);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save geosite to database', async () => {
    const result = await createGeosite(testInput);

    // Query database to verify the record was saved
    const geosites = await db.select()
      .from(geositesTable)
      .where(eq(geositesTable.id, result.id))
      .execute();

    expect(geosites).toHaveLength(1);
    expect(geosites[0].name).toEqual('Mount Bromo');
    expect(geosites[0].description).toEqual(testInput.description);
    expect(geosites[0].history).toEqual(testInput.history);
    expect(geosites[0].geological_value).toEqual(testInput.geological_value);
    expect(parseFloat(geosites[0].latitude)).toEqual(-7.942492);
    expect(parseFloat(geosites[0].longitude)).toEqual(112.953011);
    expect(geosites[0].address).toEqual(testInput.address);
    expect(geosites[0].created_at).toBeInstanceOf(Date);
    expect(geosites[0].updated_at).toBeInstanceOf(Date);
  });

  it('should handle nullable fields correctly', async () => {
    const inputWithNulls: CreateGeositeInput = {
      name: 'Simple Geosite',
      description: 'A basic geosite description',
      history: null,
      geological_value: null,
      latitude: -6.200000,
      longitude: 106.816666,
      address: 'Jakarta, Indonesia'
    };

    const result = await createGeosite(inputWithNulls);

    expect(result.name).toEqual('Simple Geosite');
    expect(result.description).toEqual('A basic geosite description');
    expect(result.history).toBeNull();
    expect(result.geological_value).toBeNull();
    expect(result.latitude).toEqual(-6.200000);
    expect(result.longitude).toEqual(106.816666);
    expect(result.address).toEqual('Jakarta, Indonesia');
  });

  it('should correctly convert numeric coordinates', async () => {
    const result = await createGeosite(testInput);

    // Verify types are correct after conversion
    expect(typeof result.latitude).toBe('number');
    expect(typeof result.longitude).toBe('number');
    expect(result.latitude).toEqual(-7.942492);
    expect(result.longitude).toEqual(112.953011);
  });
});
