
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { mediaGalleryTable } from '../db/schema';
import { getMediaGallery } from '../handlers/get_media_gallery';

describe('getMediaGallery', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no media items exist', async () => {
    const result = await getMediaGallery();
    expect(result).toEqual([]);
  });

  it('should return all media items', async () => {
    // Create test media items
    await db.insert(mediaGalleryTable)
      .values([
        {
          title: 'Sunset at Geosite',
          media_url: 'https://example.com/sunset.jpg',
          media_type: 'image',
          description: 'Beautiful sunset view'
        },
        {
          title: 'Cave Exploration Video',
          media_url: 'https://example.com/cave.mp4',
          media_type: 'video',
          description: null
        }
      ])
      .execute();

    const result = await getMediaGallery();

    expect(result).toHaveLength(2);
    
    // Check that all expected fields are present
    result.forEach(item => {
      expect(item.id).toBeDefined();
      expect(item.title).toBeDefined();
      expect(item.media_url).toBeDefined();
      expect(item.media_type).toMatch(/^(image|video)$/);
      expect(item.created_at).toBeInstanceOf(Date);
    });

    // Check specific item data
    const imageItem = result.find(item => item.media_type === 'image');
    expect(imageItem?.title).toEqual('Sunset at Geosite');
    expect(imageItem?.media_url).toEqual('https://example.com/sunset.jpg');
    expect(imageItem?.description).toEqual('Beautiful sunset view');

    const videoItem = result.find(item => item.media_type === 'video');
    expect(videoItem?.title).toEqual('Cave Exploration Video');
    expect(videoItem?.media_url).toEqual('https://example.com/cave.mp4');
    expect(videoItem?.description).toBeNull();
  });

  it('should return items ordered by created_at descending', async () => {
    // Create items with slight time difference
    await db.insert(mediaGalleryTable)
      .values({
        title: 'First Item',
        media_url: 'https://example.com/first.jpg',
        media_type: 'image',
        description: 'First created item'
      })
      .execute();

    // Small delay to ensure different timestamps
    await new Promise(resolve => setTimeout(resolve, 10));

    await db.insert(mediaGalleryTable)
      .values({
        title: 'Second Item',
        media_url: 'https://example.com/second.jpg',
        media_type: 'image',
        description: 'Second created item'
      })
      .execute();

    const result = await getMediaGallery();

    expect(result).toHaveLength(2);
    // Most recent item should be first (descending order)
    expect(result[0].title).toEqual('Second Item');
    expect(result[1].title).toEqual('First Item');
    expect(result[0].created_at >= result[1].created_at).toBe(true);
  });
});
