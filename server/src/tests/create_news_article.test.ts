
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { newsArticlesTable } from '../db/schema';
import { type CreateNewsArticleInput } from '../schema';
import { createNewsArticle } from '../handlers/create_news_article';
import { eq } from 'drizzle-orm';

// Test input for published article
const testInput: CreateNewsArticleInput = {
  title: 'Test News Article',
  content: 'This is a test news article content',
  excerpt: 'Test excerpt',
  featured_image: 'https://example.com/image.jpg',
  author: 'Test Author',
  category: 'news',
  is_published: true
};

// Test input for unpublished article
const unpublishedInput: CreateNewsArticleInput = {
  title: 'Draft Article',
  content: 'This is a draft article content',
  excerpt: null,
  featured_image: null,
  author: 'Draft Author',
  category: 'article',
  is_published: false
};

describe('createNewsArticle', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a published news article', async () => {
    const result = await createNewsArticle(testInput);

    // Basic field validation
    expect(result.title).toEqual('Test News Article');
    expect(result.content).toEqual(testInput.content);
    expect(result.excerpt).toEqual(testInput.excerpt);
    expect(result.featured_image).toEqual(testInput.featured_image);
    expect(result.author).toEqual('Test Author');
    expect(result.category).toEqual('news');
    expect(result.is_published).toBe(true);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
    expect(result.published_at).toBeInstanceOf(Date);
  });

  it('should create an unpublished news article', async () => {
    const result = await createNewsArticle(unpublishedInput);

    // Basic field validation
    expect(result.title).toEqual('Draft Article');
    expect(result.content).toEqual(unpublishedInput.content);
    expect(result.excerpt).toBeNull();
    expect(result.featured_image).toBeNull();
    expect(result.author).toEqual('Draft Author');
    expect(result.category).toEqual('article');
    expect(result.is_published).toBe(false);
    expect(result.published_at).toBeNull();
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save news article to database', async () => {
    const result = await createNewsArticle(testInput);

    // Query using proper drizzle syntax
    const articles = await db.select()
      .from(newsArticlesTable)
      .where(eq(newsArticlesTable.id, result.id))
      .execute();

    expect(articles).toHaveLength(1);
    expect(articles[0].title).toEqual('Test News Article');
    expect(articles[0].content).toEqual(testInput.content);
    expect(articles[0].author).toEqual('Test Author');
    expect(articles[0].category).toEqual('news');
    expect(articles[0].is_published).toBe(true);
    expect(articles[0].created_at).toBeInstanceOf(Date);
    expect(articles[0].updated_at).toBeInstanceOf(Date);
    expect(articles[0].published_at).toBeInstanceOf(Date);
  });

  it('should handle all article categories', async () => {
    const newsInput = { ...testInput, category: 'news' as const };
    const articleInput = { ...testInput, category: 'article' as const };
    const announcementInput = { ...testInput, category: 'announcement' as const };

    const newsResult = await createNewsArticle(newsInput);
    const articleResult = await createNewsArticle(articleInput);
    const announcementResult = await createNewsArticle(announcementInput);

    expect(newsResult.category).toEqual('news');
    expect(articleResult.category).toEqual('article');
    expect(announcementResult.category).toEqual('announcement');
  });
});
