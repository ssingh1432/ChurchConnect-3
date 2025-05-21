import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  authenticate, isAdmin, register, login, getCurrentUser, JwtPayload 
} from "./auth";
import { 
  uploadMiddleware, uploadToCloudinary, deleteFromCloudinary 
} from "./cloudinary";
import { 
  insertEventSchema, insertMinistrySchema, insertSermonSchema, 
  insertBlogPostSchema, insertPrayerRequestSchema, insertVolunteerSchema,
  insertDonationSchema, insertSiteContentSchema
} from "@shared/schema";

// Extended Request type with user
type AuthRequest = Request & { user?: JwtPayload };

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post('/api/auth/register', register);
  app.post('/api/auth/login', login);
  app.get('/api/auth/me', authenticate, getCurrentUser);

  // User routes
  app.get('/api/users', authenticate, isAdmin, async (req: Request, res: Response) => {
    try {
      const users = await storage.getAllUsers();
      // Remove passwords from response
      const sanitizedUsers = users.map(({ password, ...user }) => user);
      res.json(sanitizedUsers);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving users' });
    }
  });

  app.patch('/api/users/:id/role', authenticate, isAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { role } = req.body;
      
      if (role !== 'admin' && role !== 'visitor') {
        res.status(400).json({ message: 'Invalid role' });
        return;
      }
      
      const updatedUser = await storage.updateUserRole(parseInt(id), role);
      
      if (!updatedUser) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      
      // Remove password from response
      const { password, ...userWithoutPassword } = updatedUser;
      
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: 'Error updating user role' });
    }
  });

  // Event routes
  app.get('/api/events', async (req: Request, res: Response) => {
    try {
      const events = await storage.getAllEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving events' });
    }
  });

  app.get('/api/events/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const event = await storage.getEvent(parseInt(id));
      
      if (!event) {
        res.status(404).json({ message: 'Event not found' });
        return;
      }
      
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving event' });
    }
  });

  app.post('/api/events', authenticate, isAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: 'Authentication required' });
        return;
      }
      
      const eventData = insertEventSchema.parse({
        ...req.body,
        createdBy: userId
      });
      
      const event = await storage.createEvent(eventData);
      res.status(201).json(event);
    } catch (error) {
      res.status(500).json({ message: 'Error creating event' });
    }
  });

  app.patch('/api/events/:id', authenticate, isAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updatedEvent = await storage.updateEvent(parseInt(id), req.body);
      
      if (!updatedEvent) {
        res.status(404).json({ message: 'Event not found' });
        return;
      }
      
      res.json(updatedEvent);
    } catch (error) {
      res.status(500).json({ message: 'Error updating event' });
    }
  });

  app.delete('/api/events/:id', authenticate, isAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteEvent(parseInt(id));
      
      if (!success) {
        res.status(404).json({ message: 'Event not found' });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting event' });
    }
  });

  // Ministry routes
  app.get('/api/ministries', async (req: Request, res: Response) => {
    try {
      const ministries = await storage.getAllMinistries();
      res.json(ministries);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving ministries' });
    }
  });

  app.get('/api/ministries/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const ministry = await storage.getMinistry(parseInt(id));
      
      if (!ministry) {
        res.status(404).json({ message: 'Ministry not found' });
        return;
      }
      
      res.json(ministry);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving ministry' });
    }
  });

  app.post('/api/ministries', authenticate, isAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: 'Authentication required' });
        return;
      }
      
      const ministryData = insertMinistrySchema.parse({
        ...req.body,
        createdBy: userId
      });
      
      const ministry = await storage.createMinistry(ministryData);
      res.status(201).json(ministry);
    } catch (error) {
      res.status(500).json({ message: 'Error creating ministry' });
    }
  });

  app.patch('/api/ministries/:id', authenticate, isAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updatedMinistry = await storage.updateMinistry(parseInt(id), req.body);
      
      if (!updatedMinistry) {
        res.status(404).json({ message: 'Ministry not found' });
        return;
      }
      
      res.json(updatedMinistry);
    } catch (error) {
      res.status(500).json({ message: 'Error updating ministry' });
    }
  });

  app.delete('/api/ministries/:id', authenticate, isAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteMinistry(parseInt(id));
      
      if (!success) {
        res.status(404).json({ message: 'Ministry not found' });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting ministry' });
    }
  });

  // Sermon routes
  app.get('/api/sermons', async (req: Request, res: Response) => {
    try {
      const sermons = await storage.getAllSermons();
      res.json(sermons);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving sermons' });
    }
  });

  app.get('/api/sermons/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const sermon = await storage.getSermon(parseInt(id));
      
      if (!sermon) {
        res.status(404).json({ message: 'Sermon not found' });
        return;
      }
      
      res.json(sermon);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving sermon' });
    }
  });

  app.post('/api/sermons', authenticate, isAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: 'Authentication required' });
        return;
      }
      
      const sermonData = insertSermonSchema.parse({
        ...req.body,
        createdBy: userId
      });
      
      const sermon = await storage.createSermon(sermonData);
      res.status(201).json(sermon);
    } catch (error) {
      res.status(500).json({ message: 'Error creating sermon' });
    }
  });

  app.patch('/api/sermons/:id', authenticate, isAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updatedSermon = await storage.updateSermon(parseInt(id), req.body);
      
      if (!updatedSermon) {
        res.status(404).json({ message: 'Sermon not found' });
        return;
      }
      
      res.json(updatedSermon);
    } catch (error) {
      res.status(500).json({ message: 'Error updating sermon' });
    }
  });

  app.delete('/api/sermons/:id', authenticate, isAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteSermon(parseInt(id));
      
      if (!success) {
        res.status(404).json({ message: 'Sermon not found' });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting sermon' });
    }
  });

  // Blog post routes
  app.get('/api/blog-posts', async (req: Request, res: Response) => {
    try {
      const blogPosts = await storage.getAllBlogPosts();
      res.json(blogPosts);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving blog posts' });
    }
  });

  app.get('/api/blog-posts/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const blogPost = await storage.getBlogPost(parseInt(id));
      
      if (!blogPost) {
        res.status(404).json({ message: 'Blog post not found' });
        return;
      }
      
      res.json(blogPost);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving blog post' });
    }
  });

  app.post('/api/blog-posts', authenticate, isAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: 'Authentication required' });
        return;
      }
      
      const blogPostData = insertBlogPostSchema.parse({
        ...req.body,
        createdBy: userId
      });
      
      const blogPost = await storage.createBlogPost(blogPostData);
      res.status(201).json(blogPost);
    } catch (error) {
      res.status(500).json({ message: 'Error creating blog post' });
    }
  });

  app.patch('/api/blog-posts/:id', authenticate, isAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updatedBlogPost = await storage.updateBlogPost(parseInt(id), req.body);
      
      if (!updatedBlogPost) {
        res.status(404).json({ message: 'Blog post not found' });
        return;
      }
      
      res.json(updatedBlogPost);
    } catch (error) {
      res.status(500).json({ message: 'Error updating blog post' });
    }
  });

  app.delete('/api/blog-posts/:id', authenticate, isAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteBlogPost(parseInt(id));
      
      if (!success) {
        res.status(404).json({ message: 'Blog post not found' });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting blog post' });
    }
  });

  // Prayer request routes
  app.get('/api/prayer-requests', authenticate, isAdmin, async (req: Request, res: Response) => {
    try {
      const prayerRequests = await storage.getAllPrayerRequests();
      res.json(prayerRequests);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving prayer requests' });
    }
  });

  app.get('/api/prayer-requests/me', authenticate, async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: 'Authentication required' });
        return;
      }
      
      const prayerRequests = await storage.getPrayerRequestsByUser(userId);
      res.json(prayerRequests);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving prayer requests' });
    }
  });

  app.post('/api/prayer-requests', async (req: AuthRequest, res: Response) => {
    try {
      // For prayer requests, allow both authenticated and unauthenticated users
      const userId = req.user?.id || undefined;
      
      const prayerRequestData = insertPrayerRequestSchema.parse({
        ...req.body,
        userId
      });
      
      const prayerRequest = await storage.createPrayerRequest(prayerRequestData);
      res.status(201).json(prayerRequest);
    } catch (error) {
      res.status(500).json({ message: 'Error creating prayer request' });
    }
  });

  app.patch('/api/prayer-requests/:id/answer', authenticate, isAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { isAnswered } = req.body;
      
      const updatedPrayerRequest = await storage.updatePrayerRequest(parseInt(id), !!isAnswered);
      
      if (!updatedPrayerRequest) {
        res.status(404).json({ message: 'Prayer request not found' });
        return;
      }
      
      res.json(updatedPrayerRequest);
    } catch (error) {
      res.status(500).json({ message: 'Error updating prayer request' });
    }
  });

  // Volunteer routes
  app.get('/api/volunteers', authenticate, isAdmin, async (req: Request, res: Response) => {
    try {
      const volunteers = await storage.getAllVolunteers();
      res.json(volunteers);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving volunteers' });
    }
  });

  app.get('/api/volunteers/me', authenticate, async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: 'Authentication required' });
        return;
      }
      
      const volunteers = await storage.getVolunteersByUser(userId);
      res.json(volunteers);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving volunteers' });
    }
  });

  app.post('/api/volunteers', async (req: AuthRequest, res: Response) => {
    try {
      // For volunteer registrations, allow both authenticated and unauthenticated users
      const userId = req.user?.id || undefined;
      
      const volunteerData = insertVolunteerSchema.parse({
        ...req.body,
        userId
      });
      
      const volunteer = await storage.createVolunteer(volunteerData);
      res.status(201).json(volunteer);
    } catch (error) {
      res.status(500).json({ message: 'Error creating volunteer registration' });
    }
  });

  app.patch('/api/volunteers/:id/approve', authenticate, isAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { isApproved } = req.body;
      
      const updatedVolunteer = await storage.updateVolunteer(parseInt(id), !!isApproved);
      
      if (!updatedVolunteer) {
        res.status(404).json({ message: 'Volunteer registration not found' });
        return;
      }
      
      res.json(updatedVolunteer);
    } catch (error) {
      res.status(500).json({ message: 'Error updating volunteer registration' });
    }
  });

  // Donation routes
  app.get('/api/donations', authenticate, isAdmin, async (req: Request, res: Response) => {
    try {
      const donations = await storage.getAllDonations();
      res.json(donations);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving donations' });
    }
  });

  app.get('/api/donations/me', authenticate, async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: 'Authentication required' });
        return;
      }
      
      const donations = await storage.getDonationsByUser(userId);
      res.json(donations);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving donations' });
    }
  });

  app.post('/api/donations', async (req: AuthRequest, res: Response) => {
    try {
      // For donations, allow both authenticated and unauthenticated users
      const userId = req.user?.id || undefined;
      
      const donationData = insertDonationSchema.parse({
        ...req.body,
        userId
      });
      
      const donation = await storage.createDonation(donationData);
      res.status(201).json(donation);
    } catch (error) {
      res.status(500).json({ message: 'Error processing donation' });
    }
  });

  app.patch('/api/donations/:id/status', authenticate, isAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!['pending', 'completed', 'failed', 'refunded'].includes(status)) {
        res.status(400).json({ message: 'Invalid status' });
        return;
      }
      
      const updatedDonation = await storage.updateDonationStatus(parseInt(id), status);
      
      if (!updatedDonation) {
        res.status(404).json({ message: 'Donation not found' });
        return;
      }
      
      res.json(updatedDonation);
    } catch (error) {
      res.status(500).json({ message: 'Error updating donation status' });
    }
  });

  // Site content routes
  app.get('/api/site-contents', async (req: Request, res: Response) => {
    try {
      const siteContents = await storage.getAllSiteContents();
      res.json(siteContents);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving site contents' });
    }
  });

  app.get('/api/site-contents/:section', async (req: Request, res: Response) => {
    try {
      const { section } = req.params;
      const siteContents = await storage.getSiteContentsBySection(section);
      res.json(siteContents);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving site contents' });
    }
  });

  app.get('/api/site-contents/:section/:name', async (req: Request, res: Response) => {
    try {
      const { section, name } = req.params;
      const siteContent = await storage.getSiteContent(section, name);
      
      if (!siteContent) {
        res.status(404).json({ message: 'Site content not found' });
        return;
      }
      
      res.json(siteContent);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving site content' });
    }
  });

  app.post('/api/site-contents', authenticate, isAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: 'Authentication required' });
        return;
      }
      
      const siteContentData = insertSiteContentSchema.parse({
        ...req.body,
        updatedBy: userId
      });
      
      const siteContent = await storage.createOrUpdateSiteContent(siteContentData);
      res.status(201).json(siteContent);
    } catch (error) {
      res.status(500).json({ message: 'Error creating/updating site content' });
    }
  });

  // Media asset routes
  app.get('/api/media-assets', async (req: Request, res: Response) => {
    try {
      const mediaAssets = await storage.getAllMediaAssets();
      res.json(mediaAssets);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving media assets' });
    }
  });

  app.get('/api/media-assets/:type', async (req: Request, res: Response) => {
    try {
      const { type } = req.params;
      const mediaAssets = await storage.getMediaAssetsByType(type);
      res.json(mediaAssets);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving media assets' });
    }
  });

  app.post('/api/media-assets', authenticate, isAdmin, uploadMiddleware, uploadToCloudinary);

  app.delete('/api/media-assets/:id', authenticate, isAdmin, deleteFromCloudinary);

  const httpServer = createServer(app);
  return httpServer;
}
