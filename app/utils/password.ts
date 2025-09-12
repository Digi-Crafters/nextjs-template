import { hash, compare } from "bcryptjs";

/**
 * Hashes a plain text password using bcryptjs.
 * @param password - The plain text password to hash.
 * @returns A promise that resolves to the hashed password.
 */
export const hashPassword = (password: string): Promise<string> => {
    return hash(password, 10);
};

/**
 * Verifies a plain text password against a hashed password.
 * @param password - The plain text password to verify.
 * @param hashed - The hashed password to compare against.
 * @returns A promise that resolves to a boolean indicating if the password matches.
 */
export const verifyPassword = (
    password: string,
    hashed: string
): Promise<boolean> => {
    return compare(password, hashed);
};