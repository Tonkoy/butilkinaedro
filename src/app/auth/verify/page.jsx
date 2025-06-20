import { CONFIG } from 'src/config-global';

import { VerifyView } from 'src/auth/view/jwt/verify-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Верифицирай регистрацията си - ${CONFIG.appName}` };

export default function Page() {
  return <VerifyView />;
}
