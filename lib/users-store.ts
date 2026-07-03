// Shared in-memory user store used by authentication and registration.
// Demo only: users reset on server restart and passwords are stored in plain text.

export interface StoredUser {
    id: string;
    name: string;
    email: string;
    password: string;
    role: "user" | "admin";
}
// Store users on globalThis so all server bundles share the same data in development.
declare global {
    var __openpathUsers: StoredUser[] | undefined;
}

function getUsers(): StoredUser[] {
    if (!globalThis.__openpathUsers) {
        globalThis.__openpathUsers = [
            { id: "1", name: "Demo User", email: "user@example.com", password: "user123", role: "user" },
            { id: "2", name: "Admin User", email: "admin@example.com", password: "admin123", role: "admin" },
        ];
    }
    return globalThis.__openpathUsers;
}

// Find a user by email address.
export function findUserByEmail(email: string): StoredUser | undefined {
    const normalized = email.trim().toLowerCase();
    // Initialize the demo user store on first access.
    return getUsers().find((u) => u.email.toLowerCase() === normalized);
}

export function addUser(input: { name: string; email: string; password: string }): StoredUser {
    const users = getUsers();
    const newUser: StoredUser = {
        id: (users.length + 1).toString(),
        name: input.name,
        email: input.email.trim().toLowerCase(),
        password: input.password,
        role: "user",
    };
    users.push(newUser);
    return newUser;
}
