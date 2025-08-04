
import { db } from '../db';
import { geositesTable, geositePhotosTable } from '../db/schema';
import { type Geosite } from '../schema';
import { eq } from 'drizzle-orm';

export const getGeositeById = async (id: number): Promise<Geosite | null> => {
  try {
    // Get the geosite record
    const results = await db.select()
      .from(geositesTable)
      .where(eq(geositesTable.id, id))
      .execute();

    if (results.length === 0) {
      return null;
    }

    const geosite = results[0];
    
    // Convert numeric fields back to numbers
    return {
      ...geosite,
      latitude: parseFloat(geosite.latitude),
      longitude: parseFloat(geosite.longitude)
    };
  } catch (error) {
    console.error('Failed to get geosite by id:', error);
    throw error;
  }
};
