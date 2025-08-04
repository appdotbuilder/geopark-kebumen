
import { z } from 'zod';

// Geosite schema
export const geositeSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  history: z.string().nullable(),
  geological_value: z.string().nullable(),
  latitude: z.number(),
  longitude: z.number(),
  address: z.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Geosite = z.infer<typeof geositeSchema>;

// Geosite photo schema
export const geositePhotoSchema = z.object({
  id: z.number(),
  geosite_id: z.number(),
  photo_url: z.string(),
  caption: z.string().nullable(),
  created_at: z.coerce.date()
});

export type GeositePhoto = z.infer<typeof geositePhotoSchema>;

// Event schema
export const eventSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  start_date: z.coerce.date(),
  end_date: z.coerce.date(),
  location: z.string(),
  max_participants: z.number().int().nullable(),
  registration_deadline: z.coerce.date().nullable(),
  is_active: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Event = z.infer<typeof eventSchema>;

// Event registration schema
export const eventRegistrationSchema = z.object({
  id: z.number(),
  event_id: z.number(),
  participant_name: z.string(),
  participant_email: z.string().email(),
  participant_phone: z.string(),
  registration_date: z.coerce.date(),
  status: z.enum(['pending', 'confirmed', 'cancelled'])
});

export type EventRegistration = z.infer<typeof eventRegistrationSchema>;

// Service schema (guide, accommodation, transport, culinary)
export const serviceSchema = z.object({
  id: z.number(),
  name: z.string(),
  type: z.enum(['guide', 'accommodation', 'transport', 'culinary']),
  description: z.string(),
  contact_info: z.string(),
  price_range: z.string().nullable(),
  rating: z.number().nullable(),
  is_active: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Service = z.infer<typeof serviceSchema>;

// Media gallery schema
export const mediaGallerySchema = z.object({
  id: z.number(),
  title: z.string(),
  media_url: z.string(),
  media_type: z.enum(['image', 'video']),
  description: z.string().nullable(),
  created_at: z.coerce.date()
});

export type MediaGallery = z.infer<typeof mediaGallerySchema>;

// Contact/Feedback schema
export const contactFeedbackSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().nullable(),
  subject: z.string(),
  message: z.string(),
  type: z.enum(['contact', 'feedback', 'complaint']),
  status: z.enum(['pending', 'responded', 'closed']),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type ContactFeedback = z.infer<typeof contactFeedbackSchema>;

// News/Article schema
export const newsArticleSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  excerpt: z.string().nullable(),
  featured_image: z.string().nullable(),
  author: z.string(),
  category: z.enum(['news', 'article', 'announcement']),
  is_published: z.boolean(),
  published_at: z.coerce.date().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type NewsArticle = z.infer<typeof newsArticleSchema>;

// Input schemas for creating records
export const createGeositeInputSchema = z.object({
  name: z.string(),
  description: z.string(),
  history: z.string().nullable(),
  geological_value: z.string().nullable(),
  latitude: z.number(),
  longitude: z.number(),
  address: z.string()
});

export type CreateGeositeInput = z.infer<typeof createGeositeInputSchema>;

export const createEventInputSchema = z.object({
  title: z.string(),
  description: z.string(),
  start_date: z.coerce.date(),
  end_date: z.coerce.date(),
  location: z.string(),
  max_participants: z.number().int().nullable(),
  registration_deadline: z.coerce.date().nullable()
});

export type CreateEventInput = z.infer<typeof createEventInputSchema>;

export const createEventRegistrationInputSchema = z.object({
  event_id: z.number(),
  participant_name: z.string(),
  participant_email: z.string().email(),
  participant_phone: z.string()
});

export type CreateEventRegistrationInput = z.infer<typeof createEventRegistrationInputSchema>;

export const createServiceInputSchema = z.object({
  name: z.string(),
  type: z.enum(['guide', 'accommodation', 'transport', 'culinary']),
  description: z.string(),
  contact_info: z.string(),
  price_range: z.string().nullable(),
  rating: z.number().nullable()
});

export type CreateServiceInput = z.infer<typeof createServiceInputSchema>;

export const createContactFeedbackInputSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string().nullable(),
  subject: z.string(),
  message: z.string(),
  type: z.enum(['contact', 'feedback', 'complaint'])
});

export type CreateContactFeedbackInput = z.infer<typeof createContactFeedbackInputSchema>;

export const createNewsArticleInputSchema = z.object({
  title: z.string(),
  content: z.string(),
  excerpt: z.string().nullable(),
  featured_image: z.string().nullable(),
  author: z.string(),
  category: z.enum(['news', 'article', 'announcement']),
  is_published: z.boolean()
});

export type CreateNewsArticleInput = z.infer<typeof createNewsArticleInputSchema>;
