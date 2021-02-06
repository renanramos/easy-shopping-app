// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { AuthConfig } from 'angular-oauth2-oidc';

const authConfig: AuthConfig = {
  issuer: 'http://localhost:8083/auth/realms/easy-shopping',
  redirectUri: `${window.location.origin}/`,
  clientId: 'easy-shopping',
  scope: 'profile email roles',
  responseType: 'code',
  disableAtHashCheck: true,
  showDebugInformation: false,
};

export const environment = {
  production: false,
  apiUrl: 'http://localhost:8081/api',
  authConfig: authConfig
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
