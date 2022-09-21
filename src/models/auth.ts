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

export interface DecodedToken {
  azp: string
  family_name: string
  given_name: string
  iss: string
  name: string
  preferred_username: string
  realm_access: {
    roles: string[]
  }
  resource_access: {
    'system-dashboard': {
      roles: string[]
    }
  }
  session_state: string
}
