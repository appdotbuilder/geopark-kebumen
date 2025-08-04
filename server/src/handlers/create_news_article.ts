
import { db } from '../db';
import { newsArticlesTable } from '../db/schema';
import { type CreateNewsArticleInput, type NewsArticle } from '../schema';

export const createNewsArticle = async (input: CreateNewsArticleInput): Promise<NewsArticle> => {
  try {
    // Insert news article record
    const result = await db.insert(newsArticlesTable)
      .values({
        title: input.title,
        content: input.content,
        excerpt: input.excerpt,
        featured_image: input.featured_image,
        author: input.author,
        category: input.category,
        is_published: input.is_published,
        published_at: input.is_published ? new Date() : null
      })
      .returning()
      .execute();

    const article = result[0];
    return {
      ...article,
      // Convert all dates to proper Date objects
      created_at: new Date(article.created_at),
      updated_at: new Date(article.updated_at),
      published_at: article.published_at ? new Date(article.published_at) : null
    };
  } catch (error) {
    console.error('News article creation failed:', error);
    throw error;
  }
};
