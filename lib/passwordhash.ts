import bcrypt from "bcrypt";

// Define a function to hash a password
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

// Define a function to compare a password with its hash
export async function comparePasswords(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
}
