
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { newsArticlesTable } from '../db/schema';
import { getNewsArticles } from '../handlers/get_news_articles';

describe('getNewsArticles', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no articles exist', async () => {
    const result = await getNewsArticles();
    expect(result).toEqual([]);
  });

  it('should fetch all articles when no filter applied', async () => {
    // Create test articles
    await db.insert(newsArticlesTable).values([
      {
        title: 'Published Article',
        content: 'Content for published article',
        author: 'Test Author',
        category: 'news',
        is_published: true
      },
      {
        title: 'Draft Article',
        content: 'Content for draft article',
        author: 'Test Author',
        category: 'article',
        is_published: false
      }
    ]).execute();

    const result = await getNewsArticles();

    expect(result).toHaveLength(2);
    expect(result[0].title).toBeDefined();
    expect(result[0].content).toBeDefined();
    expect(result[0].author).toEqual('Test Author');
    expect(result[0].category).toBeDefined();
    expect(result[0].created_at).toBeInstanceOf(Date);
  });

  it('should filter by published status when specified', async () => {
    // Create test articles
    await db.insert(newsArticlesTable).values([
      {
        title: 'Published Article 1',
        content: 'Content 1',
        author: 'Author 1',
        category: 'news',
        is_published: true
      },
      {
        title: 'Published Article 2',
        content: 'Content 2',
        author: 'Author 2',
        category: 'article',
        is_published: true
      },
      {
        title: 'Draft Article',
        content: 'Draft content',
        author: 'Author 3',
        category: 'announcement',
        is_published: false
      }
    ]).execute();

    // Test published articles only
    const publishedResult = await getNewsArticles(true);
    expect(publishedResult).toHaveLength(2);
    publishedResult.forEach(article => {
      expect(article.is_published).toBe(true);
    });

    // Test draft articles only
    const draftResult = await getNewsArticles(false);
    expect(draftResult).toHaveLength(1);
    expect(draftResult[0].is_published).toBe(false);
    expect(draftResult[0].title).toEqual('Draft Article');
  });

  it('should return articles ordered by created_at descending', async () => {
    // Create articles with slight delay to ensure different timestamps
    await db.insert(newsArticlesTable).values({
      title: 'First Article',
      content: 'First content',
      author: 'Author',
      category: 'news',
      is_published: true
    }).execute();

    // Small delay to ensure different timestamps
    await new Promise(resolve => setTimeout(resolve, 10));

    await db.insert(newsArticlesTable).values({
      title: 'Second Article',
      content: 'Second content',
      author: 'Author',
      category: 'article',
      is_published: true
    }).execute();

    const result = await getNewsArticles();

    expect(result).toHaveLength(2);
    // Should be ordered by created_at descending (newest first)
    expect(result[0].title).toEqual('Second Article');
    expect(result[1].title).toEqual('First Article');
    expect(result[0].created_at >= result[1].created_at).toBe(true);
  });

  it('should include all article fields in response', async () => {
    await db.insert(newsArticlesTable).values({
      title: 'Complete Article',
      content: 'Full article content',
      excerpt: 'Article excerpt',
      featured_image: 'https://example.com/image.jpg',
      author: 'Test Author',
      category: 'news',
      is_published: true,
      published_at: new Date()
    }).execute();

    const result = await getNewsArticles();

    expect(result).toHaveLength(1);
    const article = result[0];
    
    expect(article.id).toBeDefined();
    expect(article.title).toEqual('Complete Article');
    expect(article.content).toEqual('Full article content');
    expect(article.excerpt).toEqual('Article excerpt');
    expect(article.featured_image).toEqual('https://example.com/image.jpg');
    expect(article.author).toEqual('Test Author');
    expect(article.category).toEqual('news');
    expect(article.is_published).toBe(true);
    expect(article.published_at).toBeInstanceOf(Date);
    expect(article.created_at).toBeInstanceOf(Date);
    expect(article.updated_at).toBeInstanceOf(Date);
  });
});
