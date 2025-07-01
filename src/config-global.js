import { paths } from 'src/routes/paths';
import { getTenantConfig, getCurrentTenant } from './config-tenants';
import packageJson from '../package.json';

// ----------------------------------------------------------------------

const currentTenant = getCurrentTenant();
const tenantConfig = getTenantConfig(currentTenant);


export const CONFIG = {
  name: tenantConfig.name,
  description: tenantConfig.description,
  appName: tenantConfig.appName,
  domain: tenantConfig.domain,
  dbName: tenantConfig.dbName,
  primaryColor: tenantConfig.primaryColor,
  appVersion: packageJson.version,
  serverUrl: process.env.NEXT_PUBLIC_SERVER_URL ?? '',
  assetsDir: process.env.NEXT_PUBLIC_ASSETS_DIR ?? '',
  isStaticExport: JSON.parse(`${process.env.BUILD_STATIC_EXPORT}`),
  // Tenant info
  currentTenant,
  tenantConfig,
  /**
   * Auth
   * @method jwt | amplify  | supabase | auth0
   */
  auth: {
    method: 'jwt',
    skip: false,
    redirectPath: paths.dashboard.root,
  },
  /**
   * Mapbox
   */
  mapboxApiKey: process.env.NEXT_PUBLIC_MAPBOX_API_KEY ?? '',
  orders: {
    orderID: currentTenant === 'butilkinaedro' ? 'BTNE' :
      currentTenant === 'ranicinaedro' ? 'RNCE' : 'ORDR',
  }
};
