import bcrypt from "bcryptjs";

export const hashIt = async (credential: string, saltRound: number = 10) => {
  return bcrypt.hash(credential, saltRound);
}

export const compareIt = async (credential: string, hashedCredential: string) => {
  return bcrypt.compare(credential, hashedCredential);
}