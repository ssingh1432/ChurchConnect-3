import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  role: text("role").default("visitor").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  firstName: true,
  lastName: true,
  role: true,
});

// Event model
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  location: text("location").notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  createdBy: integer("created_by").notNull(),
});

export const insertEventSchema = createInsertSchema(events).pick({
  title: true,
  description: true,
  category: true,
  startDate: true,
  endDate: true,
  location: true,
  imageUrl: true,
  createdBy: true,
});

// Ministry model
export const ministries = pgTable("ministries", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  schedule: text("schedule"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  createdBy: integer("created_by").notNull(),
});

export const insertMinistrySchema = createInsertSchema(ministries).pick({
  title: true,
  description: true,
  schedule: true,
  imageUrl: true,
  createdBy: true,
});

// Sermon model
export const sermons = pgTable("sermons", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  speaker: text("speaker").notNull(),
  date: timestamp("date").notNull(),
  description: text("description"),
  topic: text("topic"),
  videoUrl: text("video_url"),
  audioUrl: text("audio_url"),
  notesUrl: text("notes_url"),
  thumbnailUrl: text("thumbnail_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  createdBy: integer("created_by").notNull(),
});

export const insertSermonSchema = createInsertSchema(sermons).pick({
  title: true,
  speaker: true,
  date: true,
  description: true,
  topic: true,
  videoUrl: true,
  audioUrl: true,
  notesUrl: true,
  thumbnailUrl: true,
  createdBy: true,
});

// Blog post model
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url"),
  author: text("author").notNull(),
  isPublished: boolean("is_published").default(true).notNull(),
  publishDate: timestamp("publish_date").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  createdBy: integer("created_by").notNull(),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).pick({
  title: true,
  content: true,
  category: true,
  imageUrl: true,
  author: true,
  isPublished: true,
  publishDate: true,
  createdBy: true,
});

// Prayer request model
export const prayerRequests = pgTable("prayer_requests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  request: text("request").notNull(),
  isPrivate: boolean("is_private").default(false).notNull(),
  isAnswered: boolean("is_answered").default(false).notNull(),
  userId: integer("user_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPrayerRequestSchema = createInsertSchema(prayerRequests).pick({
  name: true,
  email: true,
  request: true,
  isPrivate: true,
  userId: true,
});

// Volunteer model
export const volunteers = pgTable("volunteers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  ministry: text("ministry").notNull(),
  availability: text("availability"),
  experience: text("experience"),
  isApproved: boolean("is_approved").default(false).notNull(),
  userId: integer("user_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertVolunteerSchema = createInsertSchema(volunteers).pick({
  name: true,
  email: true,
  phone: true,
  ministry: true,
  availability: true,
  experience: true,
  userId: true,
});

// Donation model
export const donations = pgTable("donations", {
  id: serial("id").primaryKey(),
  amount: integer("amount").notNull(),
  paymentMethod: text("payment_method").notNull(),
  frequency: text("frequency").default("one-time").notNull(),
  project: text("project").default("general").notNull(),
  name: text("name"),
  email: text("email"),
  userId: integer("user_id"),
  transactionId: text("transaction_id"),
  status: text("status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertDonationSchema = createInsertSchema(donations).pick({
  amount: true,
  paymentMethod: true,
  frequency: true,
  project: true,
  name: true,
  email: true,
  userId: true,
  transactionId: true,
});

// Site content model for editable content
export const siteContents = pgTable("site_contents", {
  id: serial("id").primaryKey(),
  section: text("section").notNull(),
  name: text("name").notNull(),
  content: text("content").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  updatedBy: integer("updated_by").notNull(),
});

export const insertSiteContentSchema = createInsertSchema(siteContents).pick({
  section: true,
  name: true,
  content: true,
  updatedBy: true,
});

// Media asset model
export const mediaAssets = pgTable("media_assets", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull(), // image, video, audio, document
  url: text("url").notNull(),
  publicId: text("public_id").notNull(), // Cloudinary public ID
  tags: text("tags").array(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
  uploadedBy: integer("uploaded_by").notNull(),
});

export const insertMediaAssetSchema = createInsertSchema(mediaAssets).pick({
  title: true,
  type: true,
  url: true,
  publicId: true,
  tags: true,
  uploadedBy: true,
});

// Export all types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;

export type Ministry = typeof ministries.$inferSelect;
export type InsertMinistry = z.infer<typeof insertMinistrySchema>;

export type Sermon = typeof sermons.$inferSelect;
export type InsertSermon = z.infer<typeof insertSermonSchema>;

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

export type PrayerRequest = typeof prayerRequests.$inferSelect;
export type InsertPrayerRequest = z.infer<typeof insertPrayerRequestSchema>;

export type Volunteer = typeof volunteers.$inferSelect;
export type InsertVolunteer = z.infer<typeof insertVolunteerSchema>;

export type Donation = typeof donations.$inferSelect;
export type InsertDonation = z.infer<typeof insertDonationSchema>;

export type SiteContent = typeof siteContents.$inferSelect;
export type InsertSiteContent = z.infer<typeof insertSiteContentSchema>;

export type MediaAsset = typeof mediaAssets.$inferSelect;
export type InsertMediaAsset = z.infer<typeof insertMediaAssetSchema>;
