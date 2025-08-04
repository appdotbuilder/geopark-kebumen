
import { serial, text, pgTable, timestamp, numeric, integer, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const serviceTypeEnum = pgEnum('service_type', ['guide', 'accommodation', 'transport', 'culinary']);
export const mediaTypeEnum = pgEnum('media_type', ['image', 'video']);
export const contactTypeEnum = pgEnum('contact_type', ['contact', 'feedback', 'complaint']);
export const statusEnum = pgEnum('status', ['pending', 'responded', 'closed']);
export const registrationStatusEnum = pgEnum('registration_status', ['pending', 'confirmed', 'cancelled']);
export const articleCategoryEnum = pgEnum('article_category', ['news', 'article', 'announcement']);

// Geosites table
export const geositesTable = pgTable('geosites', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  history: text('history'),
  geological_value: text('geological_value'),
  latitude: numeric('latitude', { precision: 10, scale: 8 }).notNull(),
  longitude: numeric('longitude', { precision: 11, scale: 8 }).notNull(),
  address: text('address').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Geosite photos table
export const geositePhotosTable = pgTable('geosite_photos', {
  id: serial('id').primaryKey(),
  geosite_id: integer('geosite_id').notNull(),
  photo_url: text('photo_url').notNull(),
  caption: text('caption'),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Events table
export const eventsTable = pgTable('events', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  start_date: timestamp('start_date').notNull(),
  end_date: timestamp('end_date').notNull(),
  location: text('location').notNull(),
  max_participants: integer('max_participants'),
  registration_deadline: timestamp('registration_deadline'),
  is_active: boolean('is_active').default(true).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Event registrations table
export const eventRegistrationsTable = pgTable('event_registrations', {
  id: serial('id').primaryKey(),
  event_id: integer('event_id').notNull(),
  participant_name: text('participant_name').notNull(),
  participant_email: text('participant_email').notNull(),
  participant_phone: text('participant_phone').notNull(),
  registration_date: timestamp('registration_date').defaultNow().notNull(),
  status: registrationStatusEnum('status').default('pending').notNull()
});

// Services table
export const servicesTable = pgTable('services', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  type: serviceTypeEnum('type').notNull(),
  description: text('description').notNull(),
  contact_info: text('contact_info').notNull(),
  price_range: text('price_range'),
  rating: numeric('rating', { precision: 3, scale: 2 }),
  is_active: boolean('is_active').default(true).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Media gallery table
export const mediaGalleryTable = pgTable('media_gallery', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  media_url: text('media_url').notNull(),
  media_type: mediaTypeEnum('media_type').notNull(),
  description: text('description'),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Contact feedback table
export const contactFeedbackTable = pgTable('contact_feedback', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  type: contactTypeEnum('type').notNull(),
  status: statusEnum('status').default('pending').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// News articles table
export const newsArticlesTable = pgTable('news_articles', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  excerpt: text('excerpt'),
  featured_image: text('featured_image'),
  author: text('author').notNull(),
  category: articleCategoryEnum('category').notNull(),
  is_published: boolean('is_published').default(false).notNull(),
  published_at: timestamp('published_at'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Relations
export const geositesRelations = relations(geositesTable, ({ many }) => ({
  photos: many(geositePhotosTable)
}));

export const geositePhotosRelations = relations(geositePhotosTable, ({ one }) => ({
  geosite: one(geositesTable, {
    fields: [geositePhotosTable.geosite_id],
    references: [geositesTable.id]
  })
}));

export const eventsRelations = relations(eventsTable, ({ many }) => ({
  registrations: many(eventRegistrationsTable)
}));

export const eventRegistrationsRelations = relations(eventRegistrationsTable, ({ one }) => ({
  event: one(eventsTable, {
    fields: [eventRegistrationsTable.event_id],
    references: [eventsTable.id]
  })
}));

// TypeScript types for the table schemas
export type Geosite = typeof geositesTable.$inferSelect;
export type NewGeosite = typeof geositesTable.$inferInsert;

export type GeositePhoto = typeof geositePhotosTable.$inferSelect;
export type NewGeositePhoto = typeof geositePhotosTable.$inferInsert;

export type Event = typeof eventsTable.$inferSelect;
export type NewEvent = typeof eventsTable.$inferInsert;

export type EventRegistration = typeof eventRegistrationsTable.$inferSelect;
export type NewEventRegistration = typeof eventRegistrationsTable.$inferInsert;

export type Service = typeof servicesTable.$inferSelect;
export type NewService = typeof servicesTable.$inferInsert;

export type MediaGallery = typeof mediaGalleryTable.$inferSelect;
export type NewMediaGallery = typeof mediaGalleryTable.$inferInsert;

export type ContactFeedback = typeof contactFeedbackTable.$inferSelect;
export type NewContactFeedback = typeof contactFeedbackTable.$inferInsert;

export type NewsArticle = typeof newsArticlesTable.$inferSelect;
export type NewNewsArticle = typeof newsArticlesTable.$inferInsert;

// Export all tables and relations for proper query building
export const tables = {
  geosites: geositesTable,
  geositePhotos: geositePhotosTable,
  events: eventsTable,
  eventRegistrations: eventRegistrationsTable,
  services: servicesTable,
  mediaGallery: mediaGalleryTable,
  contactFeedback: contactFeedbackTable,
  newsArticles: newsArticlesTable
};
