import crypto from "node:crypto";

export const createSecurePass = (password: string): string => {
  let hash = crypto.createHmac("sha256", process.env.HMACKEY || "");
  return hash.update(password).digest("hex").toString();
};
