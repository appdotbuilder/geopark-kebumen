
import { db } from '../db';
import { newsArticlesTable } from '../db/schema';
import { type NewsArticle } from '../schema';
import { eq, desc } from 'drizzle-orm';

export const getNewsArticles = async (published?: boolean): Promise<NewsArticle[]> => {
  try {
    // Build base query with order by
    const baseQuery = db.select()
      .from(newsArticlesTable)
      .orderBy(desc(newsArticlesTable.created_at));

    // Execute query with optional filter
    const results = published !== undefined
      ? await baseQuery.where(eq(newsArticlesTable.is_published, published)).execute()
      : await baseQuery.execute();

    // Return results (no numeric fields to convert in news articles)
    return results;
  } catch (error) {
    console.error('Failed to fetch news articles:', error);
    throw error;
  }
};
