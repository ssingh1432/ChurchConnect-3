import { 
  User, InsertUser, Event, InsertEvent, Ministry, InsertMinistry, 
  Sermon, InsertSermon, BlogPost, InsertBlogPost, PrayerRequest, 
  InsertPrayerRequest, Volunteer, InsertVolunteer, Donation, 
  InsertDonation, SiteContent, InsertSiteContent, MediaAsset, 
  InsertMediaAsset
} from "@shared/schema";
import bcrypt from "bcrypt";

// Define storage interface
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserRole(id: number, role: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;

  // Event methods
  getEvent(id: number): Promise<Event | undefined>;
  getAllEvents(): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event | undefined>;
  deleteEvent(id: number): Promise<boolean>;

  // Ministry methods
  getMinistry(id: number): Promise<Ministry | undefined>;
  getAllMinistries(): Promise<Ministry[]>;
  createMinistry(ministry: InsertMinistry): Promise<Ministry>;
  updateMinistry(id: number, ministry: Partial<InsertMinistry>): Promise<Ministry | undefined>;
  deleteMinistry(id: number): Promise<boolean>;

  // Sermon methods
  getSermon(id: number): Promise<Sermon | undefined>;
  getAllSermons(): Promise<Sermon[]>;
  createSermon(sermon: InsertSermon): Promise<Sermon>;
  updateSermon(id: number, sermon: Partial<InsertSermon>): Promise<Sermon | undefined>;
  deleteSermon(id: number): Promise<boolean>;

  // Blog post methods
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  getAllBlogPosts(): Promise<BlogPost[]>;
  createBlogPost(blogPost: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, blogPost: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;

  // Prayer request methods
  getPrayerRequest(id: number): Promise<PrayerRequest | undefined>;
  getAllPrayerRequests(): Promise<PrayerRequest[]>;
  getPrayerRequestsByUser(userId: number): Promise<PrayerRequest[]>;
  createPrayerRequest(prayerRequest: InsertPrayerRequest): Promise<PrayerRequest>;
  updatePrayerRequest(id: number, isAnswered: boolean): Promise<PrayerRequest | undefined>;
  deletePrayerRequest(id: number): Promise<boolean>;

  // Volunteer methods
  getVolunteer(id: number): Promise<Volunteer | undefined>;
  getAllVolunteers(): Promise<Volunteer[]>;
  getVolunteersByUser(userId: number): Promise<Volunteer[]>;
  createVolunteer(volunteer: InsertVolunteer): Promise<Volunteer>;
  updateVolunteer(id: number, isApproved: boolean): Promise<Volunteer | undefined>;
  deleteVolunteer(id: number): Promise<boolean>;

  // Donation methods
  getDonation(id: number): Promise<Donation | undefined>;
  getAllDonations(): Promise<Donation[]>;
  getDonationsByUser(userId: number): Promise<Donation[]>;
  createDonation(donation: InsertDonation): Promise<Donation>;
  updateDonationStatus(id: number, status: string): Promise<Donation | undefined>;

  // Site content methods
  getSiteContent(section: string, name: string): Promise<SiteContent | undefined>;
  getAllSiteContents(): Promise<SiteContent[]>;
  getSiteContentsBySection(section: string): Promise<SiteContent[]>;
  createOrUpdateSiteContent(content: InsertSiteContent): Promise<SiteContent>;

  // Media asset methods
  getMediaAsset(id: number): Promise<MediaAsset | undefined>;
  getAllMediaAssets(): Promise<MediaAsset[]>;
  getMediaAssetsByType(type: string): Promise<MediaAsset[]>;
  createMediaAsset(mediaAsset: InsertMediaAsset): Promise<MediaAsset>;
  deleteMediaAsset(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private events: Map<number, Event>;
  private ministries: Map<number, Ministry>;
  private sermons: Map<number, Sermon>;
  private blogPosts: Map<number, BlogPost>;
  private prayerRequests: Map<number, PrayerRequest>;
  private volunteers: Map<number, Volunteer>;
  private donations: Map<number, Donation>;
  private siteContents: Map<string, SiteContent>; // key: `${section}:${name}`
  private mediaAssets: Map<number, MediaAsset>;
  
  private userId: number;
  private eventId: number;
  private ministryId: number;
  private sermonId: number;
  private blogPostId: number;
  private prayerRequestId: number;
  private volunteerId: number;
  private donationId: number;
  private siteContentId: number;
  private mediaAssetId: number;

  constructor() {
    this.users = new Map();
    this.events = new Map();
    this.ministries = new Map();
    this.sermons = new Map();
    this.blogPosts = new Map();
    this.prayerRequests = new Map();
    this.volunteers = new Map();
    this.donations = new Map();
    this.siteContents = new Map();
    this.mediaAssets = new Map();

    this.userId = 1;
    this.eventId = 1;
    this.ministryId = 1;
    this.sermonId = 1;
    this.blogPostId = 1;
    this.prayerRequestId = 1;
    this.volunteerId = 1;
    this.donationId = 1;
    this.siteContentId = 1;
    this.mediaAssetId = 1;

    // Seed default admin user
    this.seedAdminUser();
    // Seed sample data
    this.seedSampleData();
  }

  private async seedAdminUser() {
    const hashedPassword = await bcrypt.hash("adminpassword", 10);
    const adminUser: User = {
      id: this.userId++,
      username: "admin",
      email: "shahidsingh1432@gmail.com",
      password: hashedPassword,
      firstName: "Admin",
      lastName: "User",
      role: "admin",
      createdAt: new Date(),
    };
    this.users.set(adminUser.id, adminUser);
  }

  private seedSampleData() {
    // Sample site content
    const homeHero: SiteContent = {
      id: this.siteContentId++,
      section: "home",
      name: "hero",
      content: JSON.stringify({
        title: "Welcome to Grace Community Church",
        subtitle: "A place to find faith, family, and community.",
        image: "https://images.unsplash.com/photo-1514896856000-91cb6de818e0"
      }),
      updatedAt: new Date(),
      updatedBy: 1
    };
    this.siteContents.set(`${homeHero.section}:${homeHero.name}`, homeHero);

    const serviceTimesContent: SiteContent = {
      id: this.siteContentId++,
      section: "services",
      name: "times",
      content: JSON.stringify({
        sunday: "9:00 AM & 11:00 AM",
        youth: "Fridays at 6:30 PM",
        bibleStudy: "Wednesdays at 7:00 PM"
      }),
      updatedAt: new Date(),
      updatedBy: 1
    };
    this.siteContents.set(`${serviceTimesContent.section}:${serviceTimesContent.name}`, serviceTimesContent);

    const contactInfo: SiteContent = {
      id: this.siteContentId++,
      section: "contact",
      name: "info",
      content: JSON.stringify({
        address: "123 Church Street, Cityville, State 12345",
        phone: "(123) 456-7890",
        email: "info@gracechurch.org",
        officeHours: "Mon-Fri, 9 AM - 5 PM"
      }),
      updatedAt: new Date(),
      updatedBy: 1
    };
    this.siteContents.set(`${contactInfo.section}:${contactInfo.name}`, contactInfo);

    // Sample media assets
    const heroImage: MediaAsset = {
      id: this.mediaAssetId++,
      title: "Church Exterior",
      type: "image",
      url: "https://images.unsplash.com/photo-1514896856000-91cb6de818e0",
      publicId: "church-exterior",
      tags: ["church", "building", "exterior"],
      uploadedAt: new Date(),
      uploadedBy: 1
    };
    this.mediaAssets.set(heroImage.id, heroImage);
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  async updateUserRole(id: number, role: string): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, role };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Event methods
  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async getAllEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = this.eventId++;
    const event: Event = { ...insertEvent, id, createdAt: new Date() };
    this.events.set(id, event);
    return event;
  }

  async updateEvent(id: number, eventUpdate: Partial<InsertEvent>): Promise<Event | undefined> {
    const event = this.events.get(id);
    if (!event) return undefined;
    
    const updatedEvent = { ...event, ...eventUpdate };
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }

  async deleteEvent(id: number): Promise<boolean> {
    return this.events.delete(id);
  }

  // Ministry methods
  async getMinistry(id: number): Promise<Ministry | undefined> {
    return this.ministries.get(id);
  }

  async getAllMinistries(): Promise<Ministry[]> {
    return Array.from(this.ministries.values());
  }

  async createMinistry(insertMinistry: InsertMinistry): Promise<Ministry> {
    const id = this.ministryId++;
    const ministry: Ministry = { ...insertMinistry, id, createdAt: new Date() };
    this.ministries.set(id, ministry);
    return ministry;
  }

  async updateMinistry(id: number, ministryUpdate: Partial<InsertMinistry>): Promise<Ministry | undefined> {
    const ministry = this.ministries.get(id);
    if (!ministry) return undefined;
    
    const updatedMinistry = { ...ministry, ...ministryUpdate };
    this.ministries.set(id, updatedMinistry);
    return updatedMinistry;
  }

  async deleteMinistry(id: number): Promise<boolean> {
    return this.ministries.delete(id);
  }

  // Sermon methods
  async getSermon(id: number): Promise<Sermon | undefined> {
    return this.sermons.get(id);
  }

  async getAllSermons(): Promise<Sermon[]> {
    return Array.from(this.sermons.values());
  }

  async createSermon(insertSermon: InsertSermon): Promise<Sermon> {
    const id = this.sermonId++;
    const sermon: Sermon = { ...insertSermon, id, createdAt: new Date() };
    this.sermons.set(id, sermon);
    return sermon;
  }

  async updateSermon(id: number, sermonUpdate: Partial<InsertSermon>): Promise<Sermon | undefined> {
    const sermon = this.sermons.get(id);
    if (!sermon) return undefined;
    
    const updatedSermon = { ...sermon, ...sermonUpdate };
    this.sermons.set(id, updatedSermon);
    return updatedSermon;
  }

  async deleteSermon(id: number): Promise<boolean> {
    return this.sermons.delete(id);
  }

  // Blog post methods
  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async getAllBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values());
  }

  async createBlogPost(insertBlogPost: InsertBlogPost): Promise<BlogPost> {
    const id = this.blogPostId++;
    const blogPost: BlogPost = { ...insertBlogPost, id, createdAt: new Date() };
    this.blogPosts.set(id, blogPost);
    return blogPost;
  }

  async updateBlogPost(id: number, blogPostUpdate: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const blogPost = this.blogPosts.get(id);
    if (!blogPost) return undefined;
    
    const updatedBlogPost = { ...blogPost, ...blogPostUpdate };
    this.blogPosts.set(id, updatedBlogPost);
    return updatedBlogPost;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    return this.blogPosts.delete(id);
  }

  // Prayer request methods
  async getPrayerRequest(id: number): Promise<PrayerRequest | undefined> {
    return this.prayerRequests.get(id);
  }

  async getAllPrayerRequests(): Promise<PrayerRequest[]> {
    return Array.from(this.prayerRequests.values());
  }

  async getPrayerRequestsByUser(userId: number): Promise<PrayerRequest[]> {
    return Array.from(this.prayerRequests.values()).filter(
      (request) => request.userId === userId
    );
  }

  async createPrayerRequest(insertPrayerRequest: InsertPrayerRequest): Promise<PrayerRequest> {
    const id = this.prayerRequestId++;
    const prayerRequest: PrayerRequest = { 
      ...insertPrayerRequest, 
      id, 
      isAnswered: false,
      createdAt: new Date() 
    };
    this.prayerRequests.set(id, prayerRequest);
    return prayerRequest;
  }

  async updatePrayerRequest(id: number, isAnswered: boolean): Promise<PrayerRequest | undefined> {
    const prayerRequest = this.prayerRequests.get(id);
    if (!prayerRequest) return undefined;
    
    const updatedPrayerRequest = { ...prayerRequest, isAnswered };
    this.prayerRequests.set(id, updatedPrayerRequest);
    return updatedPrayerRequest;
  }

  async deletePrayerRequest(id: number): Promise<boolean> {
    return this.prayerRequests.delete(id);
  }

  // Volunteer methods
  async getVolunteer(id: number): Promise<Volunteer | undefined> {
    return this.volunteers.get(id);
  }

  async getAllVolunteers(): Promise<Volunteer[]> {
    return Array.from(this.volunteers.values());
  }

  async getVolunteersByUser(userId: number): Promise<Volunteer[]> {
    return Array.from(this.volunteers.values()).filter(
      (volunteer) => volunteer.userId === userId
    );
  }

  async createVolunteer(insertVolunteer: InsertVolunteer): Promise<Volunteer> {
    const id = this.volunteerId++;
    const volunteer: Volunteer = { 
      ...insertVolunteer, 
      id, 
      isApproved: false,
      createdAt: new Date() 
    };
    this.volunteers.set(id, volunteer);
    return volunteer;
  }

  async updateVolunteer(id: number, isApproved: boolean): Promise<Volunteer | undefined> {
    const volunteer = this.volunteers.get(id);
    if (!volunteer) return undefined;
    
    const updatedVolunteer = { ...volunteer, isApproved };
    this.volunteers.set(id, updatedVolunteer);
    return updatedVolunteer;
  }

  async deleteVolunteer(id: number): Promise<boolean> {
    return this.volunteers.delete(id);
  }

  // Donation methods
  async getDonation(id: number): Promise<Donation | undefined> {
    return this.donations.get(id);
  }

  async getAllDonations(): Promise<Donation[]> {
    return Array.from(this.donations.values());
  }

  async getDonationsByUser(userId: number): Promise<Donation[]> {
    return Array.from(this.donations.values()).filter(
      (donation) => donation.userId === userId
    );
  }

  async createDonation(insertDonation: InsertDonation): Promise<Donation> {
    const id = this.donationId++;
    const donation: Donation = { 
      ...insertDonation, 
      id, 
      status: "completed", // For simplicity in the demo
      createdAt: new Date() 
    };
    this.donations.set(id, donation);
    return donation;
  }

  async updateDonationStatus(id: number, status: string): Promise<Donation | undefined> {
    const donation = this.donations.get(id);
    if (!donation) return undefined;
    
    const updatedDonation = { ...donation, status };
    this.donations.set(id, updatedDonation);
    return updatedDonation;
  }

  // Site content methods
  async getSiteContent(section: string, name: string): Promise<SiteContent | undefined> {
    return this.siteContents.get(`${section}:${name}`);
  }

  async getAllSiteContents(): Promise<SiteContent[]> {
    return Array.from(this.siteContents.values());
  }

  async getSiteContentsBySection(section: string): Promise<SiteContent[]> {
    return Array.from(this.siteContents.values()).filter(
      (content) => content.section === section
    );
  }

  async createOrUpdateSiteContent(insertContent: InsertSiteContent): Promise<SiteContent> {
    const key = `${insertContent.section}:${insertContent.name}`;
    const existingContent = this.siteContents.get(key);
    
    if (existingContent) {
      const updatedContent = { 
        ...existingContent, 
        content: insertContent.content,
        updatedAt: new Date(),
        updatedBy: insertContent.updatedBy
      };
      this.siteContents.set(key, updatedContent);
      return updatedContent;
    } else {
      const id = this.siteContentId++;
      const newContent: SiteContent = { 
        ...insertContent, 
        id, 
        updatedAt: new Date() 
      };
      this.siteContents.set(key, newContent);
      return newContent;
    }
  }

  // Media asset methods
  async getMediaAsset(id: number): Promise<MediaAsset | undefined> {
    return this.mediaAssets.get(id);
  }

  async getAllMediaAssets(): Promise<MediaAsset[]> {
    return Array.from(this.mediaAssets.values());
  }

  async getMediaAssetsByType(type: string): Promise<MediaAsset[]> {
    return Array.from(this.mediaAssets.values()).filter(
      (asset) => asset.type === type
    );
  }

  async createMediaAsset(insertMediaAsset: InsertMediaAsset): Promise<MediaAsset> {
    const id = this.mediaAssetId++;
    const mediaAsset: MediaAsset = { 
      ...insertMediaAsset, 
      id, 
      uploadedAt: new Date() 
    };
    this.mediaAssets.set(id, mediaAsset);
    return mediaAsset;
  }

  async deleteMediaAsset(id: number): Promise<boolean> {
    return this.mediaAssets.delete(id);
  }
}

export const storage = new MemStorage();
