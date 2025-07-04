'use client';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/config-global';

import { Logo } from 'src/components/logo';

import { Section } from './section';
import { Main, Content } from './main';
import { HeaderSection } from '../core/header-section';
import { LayoutSection } from '../core/layout-section';
import { SettingsButton } from '../components/settings-button';
import {useTranslate} from "../../locales";

// ----------------------------------------------------------------------

export function AuthSplitLayout({ sx, section, children, header }) {
  const layoutQuery = 'md';
  const {t: tCommon} = useTranslate('common')

  return (
    <LayoutSection
      headerSection={
        /** **************************************
         * Header
         *************************************** */
        <HeaderSection
          disableElevation
          layoutQuery={layoutQuery}
          slotProps={{ container: { maxWidth: false } }}
          sx={{ position: { [layoutQuery]: 'fixed' }, ...header?.sx }}
          slots={{
            topArea: (
              <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
                This is an info Alert.
              </Alert>
            ),
            leftArea: (
              <>
                {/* -- Logo -- */}
                <Logo />
              </>
            ),
            rightArea: (
              <Box display="flex" alignItems="center" gap={{ xs: 1, sm: 1.5 }}>
                {/* -- Help link -- */}
                <Link
                  href={paths.faqs}
                  component={RouterLink}
                  color="inherit"
                  sx={{ typography: 'subtitle2' }}
                >
                  {tCommon('text.needHelp')}
                </Link>
                {/* -- Settings button -- */}
                <SettingsButton />
              </Box>
            ),
          }}
        />
      }
      /** **************************************
       * Footer
       *************************************** */
      footerSection={null}
      /** **************************************
       * Style
       *************************************** */
      cssVars={{ '--layout-auth-content-width': '420px' }}
      sx={sx}
    >
      <Main layoutQuery={layoutQuery}>
        <Section
          title={section?.title}
          layoutQuery={layoutQuery}
          imgUrl={section?.imgUrl}
          method={CONFIG.auth.method}
          subtitle={section?.subtitle}
          methods={[
            {
              label: 'Jwt',
              path: paths.auth.jwt.signIn,
              icon: `${CONFIG.assetsDir}/assets/icons/platforms/ic-jwt.svg`,
            },
            {
              label: 'Amplify',
              path: paths.auth.amplify.signIn,
              icon: `${CONFIG.assetsDir}/assets/icons/platforms/ic-amplify.svg`,
            },
            {
              label: 'Auth0',
              path: paths.auth.auth0.signIn,
              icon: `${CONFIG.assetsDir}/assets/icons/platforms/ic-auth0.svg`,
            },
            {
              label: 'Supabase',
              path: paths.auth.supabase.signIn,
              icon: `${CONFIG.assetsDir}/assets/icons/platforms/ic-supabase.svg`,
            },
          ]}
        />
        <Content layoutQuery={layoutQuery}>{children}</Content>
      </Main>
    </LayoutSection>
  );
}
