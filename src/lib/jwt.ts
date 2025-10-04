// // src/lib/jwt.ts
// import jwt from "jsonwebtoken";

// /** JWT helpers
//  * important: tokens are signed with JWT_SECRET; use HttpOnly cookie for transport
//  * nota bene: token contains minimal user info (id + email + status)
//  */

// const SECRET = process.env.JWT_SECRET || "devsecret";
// const EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// export function signToken(payload: Record<string, any>) {
//   return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
// }

// export function verifyToken(token: string) {
//   try {
//     return jwt.verify(token, SECRET) as Record<string, any>;
//   } catch (err) {
//     return null;
//   }
// }
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;
const EXPIRES_IN = "1d"; // or whatever you had

export function signToken(payload: Record<string, any>) {
  // jwt.sign(payload, secret, options)
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET);
  } catch (_err) {
    return null;
  }
}
