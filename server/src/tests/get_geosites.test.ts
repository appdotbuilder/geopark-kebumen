
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { geositesTable } from '../db/schema';
import { type CreateGeositeInput } from '../schema';
import { getGeosites } from '../handlers/get_geosites';

const testGeosite1: CreateGeositeInput = {
  name: 'Mount Merapi',
  description: 'Active volcano in Central Java',
  history: 'Historical eruptions documented since 1006 AD',
  geological_value: 'Stratovolcano with significant geological importance',
  latitude: -7.5407,
  longitude: 110.4458,
  address: 'Sleman Regency, Special Region of Yogyakarta'
};

const testGeosite2: CreateGeositeInput = {
  name: 'Borobudur Temple',
  description: '9th-century Mahayana Buddhist temple',
  history: null,
  geological_value: null,
  latitude: -7.6079,
  longitude: 110.2038,
  address: 'Magelang Regency, Central Java'
};

describe('getGeosites', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no geosites exist', async () => {
    const result = await getGeosites();
    expect(result).toEqual([]);
  });

  it('should return all geosites', async () => {
    // Create test geosites
    await db.insert(geositesTable)
      .values([
        {
          name: testGeosite1.name,
          description: testGeosite1.description,
          history: testGeosite1.history,
          geological_value: testGeosite1.geological_value,
          latitude: testGeosite1.latitude.toString(),
          longitude: testGeosite1.longitude.toString(),
          address: testGeosite1.address
        },
        {
          name: testGeosite2.name,
          description: testGeosite2.description,
          history: testGeosite2.history,
          geological_value: testGeosite2.geological_value,
          latitude: testGeosite2.latitude.toString(),
          longitude: testGeosite2.longitude.toString(),
          address: testGeosite2.address
        }
      ])
      .execute();

    const result = await getGeosites();

    expect(result).toHaveLength(2);

    // Verify first geosite
    const merapi = result.find(g => g.name === 'Mount Merapi');
    expect(merapi).toBeDefined();
    expect(merapi!.description).toEqual(testGeosite1.description);
    expect(merapi!.history).toEqual(testGeosite1.history);
    expect(merapi!.geological_value).toEqual(testGeosite1.geological_value);
    expect(merapi!.latitude).toEqual(-7.5407);
    expect(merapi!.longitude).toEqual(110.4458);
    expect(merapi!.address).toEqual(testGeosite1.address);
    expect(merapi!.id).toBeDefined();
    expect(merapi!.created_at).toBeInstanceOf(Date);
    expect(merapi!.updated_at).toBeInstanceOf(Date);

    // Verify second geosite
    const borobudur = result.find(g => g.name === 'Borobudur Temple');
    expect(borobudur).toBeDefined();
    expect(borobudur!.description).toEqual(testGeosite2.description);
    expect(borobudur!.history).toBeNull();
    expect(borobudur!.geological_value).toBeNull();
    expect(borobudur!.latitude).toEqual(-7.6079);
    expect(borobudur!.longitude).toEqual(110.2038);
    expect(borobudur!.address).toEqual(testGeosite2.address);
  });

  it('should convert numeric coordinates correctly', async () => {
    await db.insert(geositesTable)
      .values({
        name: 'Test Site',
        description: 'Test description',
        history: null,
        geological_value: null,
        latitude: '12.345678',
        longitude: '98.765432',
        address: 'Test address'
      })
      .execute();

    const result = await getGeosites();

    expect(result).toHaveLength(1);
    expect(typeof result[0].latitude).toBe('number');
    expect(typeof result[0].longitude).toBe('number');
    expect(result[0].latitude).toEqual(12.345678);
    expect(result[0].longitude).toEqual(98.765432);
  });
});
