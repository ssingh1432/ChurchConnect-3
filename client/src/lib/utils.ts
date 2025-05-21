import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'MMMM d, yyyy');
}

export function formatTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'h:mm a');
}

export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'MMMM d, yyyy h:mm a');
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const paymentMethods = [
  { id: 'paypal', name: 'PayPal', icon: 'fab fa-paypal' },
  { id: 'google_pay', name: 'Google Pay', icon: 'fab fa-google' },
  { id: 'esewa', name: 'Esewa', icon: 'fas fa-money-bill-wave' },
  { id: 'bank_transfer', name: 'Bank Transfer', icon: 'fas fa-university' }
];

export const donationFrequencies = [
  { id: 'one-time', name: 'One Time' },
  { id: 'weekly', name: 'Weekly' },
  { id: 'monthly', name: 'Monthly' },
  { id: 'quarterly', name: 'Quarterly' },
  { id: 'yearly', name: 'Yearly' }
];

export const donationProjects = [
  { id: 'general', name: 'General Fund' },
  { id: 'building', name: 'Building Fund' },
  { id: 'missions', name: 'Missions' },
  { id: 'youth', name: 'Youth Ministry' },
  { id: 'community', name: 'Community Outreach' }
];

export const volunteerMinistries = [
  { id: 'worship', name: 'Worship Team' },
  { id: 'children', name: 'Children\'s Ministry' },
  { id: 'youth', name: 'Youth Ministry' },
  { id: 'hospitality', name: 'Hospitality' },
  { id: 'media', name: 'Media & Technology' },
  { id: 'missions', name: 'Missions' },
  { id: 'prayer', name: 'Prayer Team' },
  { id: 'outreach', name: 'Community Outreach' }
];

export const availabilityOptions = [
  { id: 'weekdays', name: 'Weekdays' },
  { id: 'weekends', name: 'Weekends' },
  { id: 'evenings', name: 'Evenings' },
  { id: 'mornings', name: 'Mornings' },
  { id: 'flexible', name: 'Flexible' }
];

export const eventCategories = [
  { id: 'worship', name: 'Worship Service' },
  { id: 'bible_study', name: 'Bible Study' },
  { id: 'youth', name: 'Youth Event' },
  { id: 'children', name: 'Children\'s Event' },
  { id: 'fellowship', name: 'Fellowship' },
  { id: 'missions', name: 'Missions' },
  { id: 'community', name: 'Community Outreach' },
  { id: 'special', name: 'Special Event' }
];

export const sermonTopics = [
  { id: 'faith', name: 'Faith' },
  { id: 'love', name: 'Love' },
  { id: 'hope', name: 'Hope' },
  { id: 'prayer', name: 'Prayer' },
  { id: 'worship', name: 'Worship' },
  { id: 'discipleship', name: 'Discipleship' },
  { id: 'family', name: 'Family' },
  { id: 'community', name: 'Community' },
  { id: 'mission', name: 'Mission' },
  { id: 'salvation', name: 'Salvation' }
];

export const blogCategories = [
  { id: 'devotional', name: 'Devotional' },
  { id: 'testimony', name: 'Testimony' },
  { id: 'news', name: 'Church News' },
  { id: 'event_recap', name: 'Event Recap' },
  { id: 'teaching', name: 'Teaching' },
  { id: 'missions', name: 'Missions' },
  { id: 'community', name: 'Community' }
];
