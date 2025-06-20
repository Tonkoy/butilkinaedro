'use client';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useTabs } from 'src/hooks/use-tabs';
import { _userAbout, _userAddressBook } from 'src/_mock';
import { Iconify } from 'src/components/iconify';
import { AccountGeneral } from '../account-general';
import { AccountSocialLinks } from '../account-social-links';
import { AccountChangePassword } from '../account-change-password';
import Container from "@mui/material/Container";
import {useSettingsContext} from "../../../components/settings";
import {useTranslate} from "../../../locales";
import {AccountBillingAddress} from "../account-billing-address";
import {AccountBusinessData} from "../account-business-data";

// ----------------------------------------------------------------------

const TABS = [
  { value: 'general', icon: <Iconify icon="solar:user-id-bold" width={24} /> },
  { value: 'addresses', icon: <Iconify icon="solar:bill-list-bold" width={24} /> },
/*
  { value: 'notifications', icon: <Iconify icon="solar:bell-bing-bold" width={24} />},
*/
  { value: 'settings',  icon: <Iconify icon="solar:share-bold" width={24} /> },
  { value: 'companyData', labelKey: 'Security', icon: <Iconify icon="ic:round-vpn-key" width={24} /> },
];

// ----------------------------------------------------------------------

export function AccountView() {
  const tabs = useTabs('general');
  const settings = useSettingsContext();
  const {t: tCommon} = useTranslate('profile');

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'} sx={{ mb: 3 }}>
      <Tabs value={tabs.value} onChange={tabs.onChange} sx={{ mb: { xs: 3, md: 5 } }}>
        {TABS.map((tab) => (
          <Tab key={tab.value} label={tCommon(`menu.${tab.value}`)} icon={tab.icon} value={tab.value} />
        ))}
      </Tabs>

      {tabs.value === 'general' && <AccountGeneral />}

      {tabs.value === 'addresses' && (
        <AccountBillingAddress />
      )}

      {/*{tabs.value === 'notifications' && <AccountNotifications />}*/}

      {tabs.value === 'settings' && <AccountChangePassword />}

      {tabs.value === 'companyData' && <AccountBusinessData />}

    </Container>
  );
}
