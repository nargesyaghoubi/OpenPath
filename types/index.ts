export interface Opportunity {
    id: string
    title: string
    organization: string
    category: string
    location: string
    type: string
    deadline: string
    description: string
    requirements: string[]
    applyLink: string
    tags: string[]
    featured?: boolean   // features is optional 
    createdAt?: string   // createdAt is optional 
  }
  
  export type Category =
    | "Job"
    | "Internship"
    | "Scholarship"
    | "Online Course"
    | "Remote Work"
    | "Training Program"
    | "Volunteer Work"
  
  export type OpportunityType = "Remote" | "On-site" | "Hybrid"
  
  export interface User {
    id: string
    name: string
    email: string
    role: "user" | "admin"
  }