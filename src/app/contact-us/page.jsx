import { CONFIG } from 'src/config-global';

import { ContactView } from 'src/sections/contact/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Контакти - ${CONFIG.appName}` };

export default function Page() {
  return <ContactView />;
}
