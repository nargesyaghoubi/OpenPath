
export type Category =
    | "Job"
    | "Internship"
    | "Scholarship"
    | "Online Course"
    | "Remote Work"
    | "Training Program"
    | "Volunteer Work"

export type OpportunityType = "Remote" | "On-site" | "Hybrid"

export interface Opportunity {
    id: string
    title: string
    organization: string
    category: Category
    location: string
    type: OpportunityType
    deadline: string
    description: string
    requirements: string[]
    applyLink: string
    tags: string[]
    featured?: boolean   // optional
    createdAt?: string   // optional
}

export interface User {
    id: string
    name: string
    email: string
    role: "user" | "admin"
}