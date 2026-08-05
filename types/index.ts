// Available opportunity categories
export type Category =
  | "Job"
  | "Internship"
  | "Scholarship"
  | "Online Course"
  | "Remote Work"
  | "Training Program"
  | "Volunteer";

// Work arrangement types
export type OpportunityType = "Remote" | "On-site" | "Hybrid";

// Admin moderation status for a submitted opportunity
export type OpportunityStatus = "PENDING" | "APPROVED" | "REJECTED";

// Main opportunity interface
export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  category: Category;
  location: string;
  country: string;
  countryCode: string;
  type: OpportunityType;
  deadline: string;
  description: string;
  requirements: string[];
  applyLink: string;
  tags: string[];
  featured?: boolean;    // Optional - highlighted on home page
  postedAt?: string;     // Optional - used for sorting by newest
  status?: OpportunityStatus;   // Optional - defaults to APPROVED for legacy/seed data
  submittedBy?: string;         // Optional - id of the user who submitted it
  rejectReason?: string;        // Optional - set by an admin on rejection
}
// Supported locales
export type Locale = "en" | "fa" | "ar" | "fr" | "es" | "de";
