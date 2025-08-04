
import { db } from '../db';
import { geositesTable } from '../db/schema';
import { type CreateGeositeInput, type Geosite } from '../schema';

export const createGeosite = async (input: CreateGeositeInput): Promise<Geosite> => {
  try {
    // Insert geosite record
    const result = await db.insert(geositesTable)
      .values({
        name: input.name,
        description: input.description,
        history: input.history,
        geological_value: input.geological_value,
        latitude: input.latitude.toString(), // Convert number to string for numeric column
        longitude: input.longitude.toString(), // Convert number to string for numeric column
        address: input.address
      })
      .returning()
      .execute();

    // Convert numeric fields back to numbers before returning
    const geosite = result[0];
    return {
      ...geosite,
      latitude: parseFloat(geosite.latitude), // Convert string back to number
      longitude: parseFloat(geosite.longitude) // Convert string back to number
    };
  } catch (error) {
    console.error('Geosite creation failed:', error);
    throw error;
  }
};
