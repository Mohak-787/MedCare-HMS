import bcrypt from "bcryptjs";

export const hash = async (password: string, saltRound: number = 10) => {
  return bcrypt.hash(password, saltRound);
}

export const compare = async (password: string, hashedPassword: string) => {
  return bcrypt.compare(password, hashedPassword);
}