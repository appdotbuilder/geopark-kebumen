
import { db } from '../db';
import { geositesTable } from '../db/schema';
import { type Geosite } from '../schema';

export const getGeosites = async (): Promise<Geosite[]> => {
  try {
    const results = await db.select()
      .from(geositesTable)
      .execute();

    // Convert numeric fields back to numbers
    return results.map(geosite => ({
      ...geosite,
      latitude: parseFloat(geosite.latitude),
      longitude: parseFloat(geosite.longitude)
    }));
  } catch (error) {
    console.error('Failed to fetch geosites:', error);
    throw error;
  }
};
