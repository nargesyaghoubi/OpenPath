import { describe, it, expect } from "vitest";
import { isExpired, isExpiringSoon, isRTL, getDaysRemaining } from "@/lib/utils";

function daysFromNow(days: number): string {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split("T")[0];
}

describe("deadline helpers", () => {
    it("treats a past date as expired", () => {
        expect(isExpired(daysFromNow(-5))).toBe(true);
    });

    it("treats a future date as not expired", () => {
        expect(isExpired(daysFromNow(5))).toBe(false);
    });

    it("flags a deadline within the threshold as expiring soon", () => {
        expect(isExpiringSoon(daysFromNow(3), 14)).toBe(true);
    });

    it("does not flag a far-future deadline as expiring soon", () => {
        expect(isExpiringSoon(daysFromNow(60), 14)).toBe(false);
    });

    it("does not flag an already-expired deadline as expiring soon", () => {
        expect(isExpiringSoon(daysFromNow(-1), 14)).toBe(false);
    });

    it("computes days remaining", () => {
        expect(getDaysRemaining(daysFromNow(10))).toBeGreaterThanOrEqual(9);
    });
});

describe("isRTL", () => {
    it("returns true for Farsi and Arabic", () => {
        expect(isRTL("fa")).toBe(true);
        expect(isRTL("ar")).toBe(true);
    });

    it("returns false for other locales", () => {
        expect(isRTL("en")).toBe(false);
        expect(isRTL("de")).toBe(false);
    });
});
