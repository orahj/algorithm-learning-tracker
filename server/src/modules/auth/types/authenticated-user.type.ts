export type AuthenticatedUser = {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  plan?: string;
  subscriptionStatus?: string;
};
