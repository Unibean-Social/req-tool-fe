export interface User {
  id: string;
  email: string;
  userNname: string;
  /** JWT có thể là string hoặc string[] — luôn chuẩn hóa thành mảng khi decode. */
  role: string[];
  avatarUrl?: string;
}

export interface DecodedToken extends User {
  nbf?: number;
  exp?: number;
  iat?: number;
}
