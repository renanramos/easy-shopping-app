import { AuthConfig } from 'angular-oauth2-oidc';

const authConfig: AuthConfig = {
  issuer: 'https://embedded-keycloak.herokuapp.com/auth/realms/easy-shopping',
  redirectUri: `${window.location.origin}/`,
  clientId: 'easy-shopping',
  scope: 'profile email roles',
  responseType: 'code',
  disableAtHashCheck: true,
  showDebugInformation: false
}

export const environment = {
  production: true,
  apiUrl: 'https://easy-shopping-puc-minas.herokuapp.com/api',
  authConfig: authConfig
};
