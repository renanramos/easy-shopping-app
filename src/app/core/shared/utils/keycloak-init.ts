import { KeycloakService } from 'keycloak-angular';
import { environment } from 'src/environments/environment';

export function keycloakInitializer(keycloak: KeycloakService): () => Promise<any> {

  return (): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      const { keycloakConfig } = environment;
      try {
        await keycloak.init({
          config: {
            url: 'http://localhost:8083/auth',
            realm: 'easy-shopping',
            clientId: 'easy-shopping'
          },
          initOptions: {
            onLoad: "check-sso",
            checkLoginIframe: false,
            silentCheckSsoRedirectUri: `${window.location.origin}/assets/silent-check-sso.html`,
          }
        });
        resolve(value => console.log(value));
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  };
}