
import { db } from '../db';
import { servicesTable } from '../db/schema';
import { type Service } from '../schema';
import { eq } from 'drizzle-orm';

export const getServices = async (type?: string): Promise<Service[]> => {
  try {
    const results = type
      ? await db.select().from(servicesTable).where(eq(servicesTable.type, type as any)).execute()
      : await db.select().from(servicesTable).execute();

    // Convert numeric fields back to numbers
    return results.map(service => ({
      ...service,
      rating: service.rating ? parseFloat(service.rating) : null
    }));
  } catch (error) {
    console.error('Failed to fetch services:', error);
    throw error;
  }
};
