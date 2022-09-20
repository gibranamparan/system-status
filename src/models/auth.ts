export interface AuthResponse {
  token: string | null
  message: string | null
}

export interface UserInfo {
  sub: string
  email_verified: boolean
  name: string
  preferred_username: string
  given_name: string
  family_name: string
}
