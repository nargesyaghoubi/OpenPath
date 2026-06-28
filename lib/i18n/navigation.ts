// Navigation utilities with built-in locale support
// Use these instead of Next.js defaults to keep locale in URLs

import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
