
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { geositesTable } from '../db/schema';
import { type CreateGeositeInput } from '../schema';
import { getGeositeById } from '../handlers/get_geosite_by_id';

// Test geosite data
const testGeosite: CreateGeositeInput = {
  name: 'Test Geosite',
  description: 'A beautiful geological formation for testing',
  history: 'Ancient geological history',
  geological_value: 'High scientific value',
  latitude: -7.250445,
  longitude: 112.768845,
  address: 'Jl. Test Geosite No. 123, Malang, East Java'
};

describe('getGeositeById', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return geosite when found', async () => {
    // Create a test geosite
    const insertResult = await db.insert(geositesTable)
      .values({
        name: testGeosite.name,
        description: testGeosite.description,
        history: testGeosite.history,
        geological_value: testGeosite.geological_value,
        latitude: testGeosite.latitude.toString(),
        longitude: testGeosite.longitude.toString(),
        address: testGeosite.address
      })
      .returning()
      .execute();

    const createdGeosite = insertResult[0];
    
    // Test the handler
    const result = await getGeositeById(createdGeosite.id);

    expect(result).not.toBeNull();
    expect(result!.id).toEqual(createdGeosite.id);
    expect(result!.name).toEqual('Test Geosite');
    expect(result!.description).toEqual(testGeosite.description);
    expect(result!.history).toEqual(testGeosite.history);
    expect(result!.geological_value).toEqual(testGeosite.geological_value);
    expect(result!.latitude).toEqual(-7.250445);
    expect(result!.longitude).toEqual(112.768845);
    expect(result!.address).toEqual(testGeosite.address);
    expect(result!.created_at).toBeInstanceOf(Date);
    expect(result!.updated_at).toBeInstanceOf(Date);

    // Verify numeric conversion
    expect(typeof result!.latitude).toBe('number');
    expect(typeof result!.longitude).toBe('number');
  });

  it('should return null when geosite not found', async () => {
    const result = await getGeositeById(999);
    expect(result).toBeNull();
  });

  it('should handle geosites with null optional fields', async () => {
    // Create geosite with minimal required fields
    const minimalGeosite = await db.insert(geositesTable)
      .values({
        name: 'Minimal Geosite',
        description: 'Simple description',
        history: null,
        geological_value: null,
        latitude: '0.0',
        longitude: '0.0',
        address: 'Basic address'
      })
      .returning()
      .execute();

    const result = await getGeositeById(minimalGeosite[0].id);

    expect(result).not.toBeNull();
    expect(result!.name).toEqual('Minimal Geosite');
    expect(result!.history).toBeNull();
    expect(result!.geological_value).toBeNull();
    expect(result!.latitude).toEqual(0.0);
    expect(result!.longitude).toEqual(0.0);
  });

  it('should handle coordinate precision correctly', async () => {
    // Test with high precision coordinates
    const preciseCoords = await db.insert(geositesTable)
      .values({
        name: 'Precise Location',
        description: 'High precision coordinates',
        history: null,
        geological_value: null,
        latitude: '-7.25044567',
        longitude: '112.76884523',
        address: 'Precise address'
      })
      .returning()
      .execute();

    const result = await getGeositeById(preciseCoords[0].id);

    expect(result).not.toBeNull();
    expect(result!.latitude).toBeCloseTo(-7.25044567, 8);
    expect(result!.longitude).toBeCloseTo(112.76884523, 8);
  });
});
