
import { db } from '../db';
import { mediaGalleryTable } from '../db/schema';
import { type MediaGallery } from '../schema';
import { desc } from 'drizzle-orm';

export const getMediaGallery = async (): Promise<MediaGallery[]> => {
  try {
    const results = await db.select()
      .from(mediaGalleryTable)
      .orderBy(desc(mediaGalleryTable.created_at))
      .execute();

    return results;
  } catch (error) {
    console.error('Failed to fetch media gallery:', error);
    throw error;
  }
};
