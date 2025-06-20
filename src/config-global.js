import { paths } from 'src/routes/paths';

import packageJson from '../package.json';

// ----------------------------------------------------------------------

export const CONFIG = {
  name: 'BUTILKO - Бутилки, термоси и термо чаши на едро и дребно',
  description: 'Бутилки, термоси и термо чаши на едро и дребно',
  appName: 'Лазерно гравиране на бутилки, чаши',
  appVersion: packageJson.version,
  serverUrl: process.env.NEXT_PUBLIC_SERVER_URL ?? '',
  assetsDir: process.env.NEXT_PUBLIC_ASSETS_DIR ?? '',
  isStaticExport: JSON.parse(`${process.env.BUILD_STATIC_EXPORT}`),
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
    orderID: 'BPLT',
  }
};
