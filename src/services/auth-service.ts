import { AxiosInstance } from 'axios'
import { useAxios } from '@vueuse/integrations/useAxios'
import { useCookies } from '@vueuse/integrations/useCookies'
import { AuthResponse, UserInfo } from '@/models/auth'
import jwt_decode from 'jwt-decode'
const { set: setUserCookies, get: getCookie, remove: removeCookie } = useCookies()

export default class AuthService {
  private readonly client: AxiosInstance

  constructor(client: AxiosInstance) {
    this.client = client
  }

  public async login(username: string, password: string): Promise<AuthResponse> {
    const errorMsg = 'Something went wrong. Please try again, if persists, contact technical support.'
    const params = new URLSearchParams()
    params.append('username', username)
    params.append('password', password)
    params.append('grant_type', 'password')
    params.append('client_id', 'system-dashboard')
    const res = await useAxios(`/protocol/openid-connect/token`, { data: params, method: 'POST' }, this.client)
    const result = {
      token: null,
      message: null,
    } as AuthResponse
    if (res?.response.value?.status === 200) {
      // Authenticatation was successful
      const expiresIn = res?.response.value?.data.expires_in
      const newToken = res?.response.value?.data.access_token

      // get resource access to check if user is allowed to access the dashboard
      const decodedToken = jwt_decode<any | undefined>(newToken)
      console.log(decodedToken)
      const hasAccessToClient = !!decodedToken?.resource_access['system-dashboard']

      // User is authenticated but dont have access to dashboard
      if (!hasAccessToClient) {
        result.message = "You don't have permissions to access the dashboard."
        return result
      }
      // User is authenticated and has access to dashboard
      const expireDate = new Date(new Date().getTime() + expiresIn * 1000)
      setUserCookies('access_token', newToken, { expires: expireDate })
      result.token = newToken
      return result
    } else if (res?.error.value?.response?.status ?? 0 > 0) {
      // authorization failed
      result.message = res?.error.value?.response?.data?.error_description || errorMsg
      return result
    } else {
      // other unknown error
      result.message = errorMsg
      console.error(res)
      return result
    }
  }

  public async getUserInfo(): Promise<UserInfo | null> {
    const token = getCookie<string>('access_token')
    if (!token) return null
    const userInfoResponse = await useAxios(
      `/protocol/openid-connect/userinfo`,
      { headers: { Authorization: `Bearer ${token}` } },
      this.client,
    )
    if (userInfoResponse.response.value?.status === 200) {
      return userInfoResponse.response.value.data
    }
    return null
  }

  public async logout() {
    removeCookie('access_token')
  }
}
