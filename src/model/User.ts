// User.ts
export interface User {
  userId: number;
  profileImage: string; // base64 string
  imageMIME: string;
  userName: string;
  phoneNo: string;
  password: string; // hashed password
}
