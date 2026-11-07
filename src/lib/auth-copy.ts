export const badgeText = "Built for Nigerian POST-UTME candidates";

export const DEMO_CREDENTIALS = {
  student: { email: "demo@praise.ng", password: "Demo123!" },
  admin: { email: "admin@praise.ng", password: "Admin123!" }
};

export const PASSWORD_RULES = [
  "At least 8 characters",
  "At least one letter",
  "At least one number"
];

export function validatePassword(password: string): string | null {
  if (password.length < 8) return "Password must be at least 8 characters long.";
  if (!/[A-Za-z]/.test(password)) return "Password must contain at least one letter.";
  if (!/[0-9]/.test(password)) return "Password must contain at least one number.";
  return null;
}

export function validateEmail(email: string): string | null {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) return "Enter a valid email address.";
  return null;
}

export function validateUsername(username: string): string | null {
  if (!/^[a-zA-Z0-9_]{3,20}$/.test(username.trim()))
    return "Username must be 3–20 characters using letters, numbers or underscores.";
  return null;
}
