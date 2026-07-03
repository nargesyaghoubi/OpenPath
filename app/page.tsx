import type { Metadata } from "next";
import { redirect } from "next/navigation";

// Metadata for the root route
export const metadata: Metadata = {
    title: "OpenPath",
    description: "Opportunity finder platform for youth",
};

export default function RootPage() {
    // Redirect users to the default locale (English)
    redirect("/en");
<<<<<<< HEAD
}
=======
}
>>>>>>> 007741b7cd2adb02e71b54f1dd91e62a49e03949
