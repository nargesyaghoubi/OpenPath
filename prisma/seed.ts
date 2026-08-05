// Database seed script. Run: npm run db:seed

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { opportunities } from "../data/opportunities";

const prisma = new PrismaClient();

async function main() {
    const demoPassword = await bcrypt.hash("user123", 12);
    const adminPassword = await bcrypt.hash("admin123", 12);

    const demoUser = await prisma.user.upsert({
        where: { email: "user@example.com" },
        update: {},
        create: {
            name: "Demo User",
            email: "user@example.com",
            passwordHash: demoPassword,
            role: "user",
        },
    });

    await prisma.user.upsert({
        where: { email: "admin@example.com" },
        update: {},
        create: {
            name: "Admin User",
            email: "admin@example.com",
            passwordHash: adminPassword,
            role: "admin",
        },
    });

    // Existing mock opportunities are seeded as APPROVED, owned by the demo user
    for (const opp of opportunities) {
        await prisma.opportunity.upsert({
            where: { id: opp.id },
            update: {},
            create: {
                id: opp.id,
                title: opp.title,
                organization: opp.organization,
                category: opp.category,
                location: opp.location,
                country: opp.country,
                countryCode: opp.countryCode,
                type: opp.type,
                deadline: opp.deadline,
                description: opp.description,
                requirements: opp.requirements,
                applyLink: opp.applyLink,
                tags: opp.tags,
                featured: opp.featured ?? false,
                status: "APPROVED",
                submittedBy: demoUser.id,
                postedAt: opp.postedAt ? new Date(opp.postedAt) : new Date(),
            },
        });
    }

    console.log(`Seeded 2 users and ${opportunities.length} opportunities.`);
    console.log("Demo login:  user@example.com / user123");
    console.log("Admin login: admin@example.com / admin123");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });