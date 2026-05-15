/**
 * Đăng nhập qua **GitHub OAuth** (`fetchGithub` + `hooks/useGithub`) — không còn
 * endpoint email/password trên client. `logout` chỉ đồng bộ tên với `useAuth`.
 */
export const fetchAuth = {
  logout: async (): Promise<void> => {
    return;
  },
};
