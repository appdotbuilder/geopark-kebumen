
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import schemas
import {
  createGeositeInputSchema,
  createEventInputSchema,
  createEventRegistrationInputSchema,
  createServiceInputSchema,
  createContactFeedbackInputSchema,
  createNewsArticleInputSchema
} from './schema';

// Import handlers
import { getGeosites } from './handlers/get_geosites';
import { getGeositeById } from './handlers/get_geosite_by_id';
import { createGeosite } from './handlers/create_geosite';
import { getEvents } from './handlers/get_events';
import { createEvent } from './handlers/create_event';
import { registerForEvent } from './handlers/register_for_event';
import { getServices } from './handlers/get_services';
import { createService } from './handlers/create_service';
import { getMediaGallery } from './handlers/get_media_gallery';
import { submitContactFeedback } from './handlers/submit_contact_feedback';
import { getNewsArticles } from './handlers/get_news_articles';
import { createNewsArticle } from './handlers/create_news_article';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),
  
  // Geosite routes
  getGeosites: publicProcedure
    .query(() => getGeosites()),
  
  getGeositeById: publicProcedure
    .input(z.number())
    .query(({ input }) => getGeositeById(input)),
  
  createGeosite: publicProcedure
    .input(createGeositeInputSchema)
    .mutation(({ input }) => createGeosite(input)),
  
  // Event routes
  getEvents: publicProcedure
    .query(() => getEvents()),
  
  createEvent: publicProcedure
    .input(createEventInputSchema)
    .mutation(({ input }) => createEvent(input)),
  
  registerForEvent: publicProcedure
    .input(createEventRegistrationInputSchema)
    .mutation(({ input }) => registerForEvent(input)),
  
  // Service routes
  getServices: publicProcedure
    .input(z.string().optional())
    .query(({ input }) => getServices(input)),
  
  createService: publicProcedure
    .input(createServiceInputSchema)
    .mutation(({ input }) => createService(input)),
  
  // Media gallery routes
  getMediaGallery: publicProcedure
    .query(() => getMediaGallery()),
  
  // Contact/Feedback routes
  submitContactFeedback: publicProcedure
    .input(createContactFeedbackInputSchema)
    .mutation(({ input }) => submitContactFeedback(input)),
  
  // News/Article routes
  getNewsArticles: publicProcedure
    .input(z.boolean().optional())
    .query(({ input }) => getNewsArticles(input)),
  
  createNewsArticle: publicProcedure
    .input(createNewsArticleInputSchema)
    .mutation(({ input }) => createNewsArticle(input))
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();
