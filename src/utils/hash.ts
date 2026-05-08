import bcrypt from "bcryptjs";

export const hashIt = async (password: string, saltRound: number = 10) => {
  return bcrypt.hash(password, saltRound);
}

export const compareIt = async (password: string, hashedPassword: string) => {
  return bcrypt.compare(password, hashedPassword);
}