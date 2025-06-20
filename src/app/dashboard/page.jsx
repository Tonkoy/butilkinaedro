import { CONFIG } from 'src/config-global';

import { OverviewEcommerceView } from 'src/sections/overview/e-commerce/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <OverviewEcommerceView />;
}
