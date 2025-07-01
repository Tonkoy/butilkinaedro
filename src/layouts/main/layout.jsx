'use client';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import {useTheme} from '@mui/material/styles';
import {usePathname} from 'src/routes/hooks';

import {useBoolean} from 'src/hooks/use-boolean';

import {Logo} from 'src/components/logo';

import {Main} from './main';
import {NavMobile} from './nav/mobile';
import {NavDesktop} from './nav/desktop';
import {Footer, HomeFooter} from './footer';
import {MenuButton} from '../components/menu-button';
import {LayoutSection} from '../core/layout-section';
import {HeaderSection} from '../core/header-section';
import {navData as mainNavData} from '../config-nav-main';
import {SignInButton} from '../components/sign-in-button';
import {SettingsButton} from '../components/settings-button';
import {useAuthContext} from "../../auth/hooks";
import Stack from "@mui/material/Stack";
import {useIsAdmin} from "../../utils/hooks";
import {useMemo} from "react";
import {_account} from "../config-nav-account";
import {AccountDrawer} from "../components/account-drawer";

// ----------------------------------------------------------------------

export function MainLayout({ sx, data, children, header }) {
  const theme = useTheme();

  const pathname = usePathname();

  const mobileNavOpen = useBoolean();

  const homePage = pathname === '/';

  const layoutQuery = 'md';

  const navData = data?.nav ?? mainNavData;

  const { authenticated } = useAuthContext();

  return (
    <LayoutSection
      /** **************************************
       * Header
       *************************************** */
      headerSection={
        <HeaderSection
          layoutQuery={layoutQuery}
          sx={header?.sx}
          slots={{
            topArea: (
              <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
                This is an info Alert.
              </Alert>
            ),
            leftArea: (
              <>
                {/* -- Nav mobile -- */}
                <MenuButton
                  onClick={mobileNavOpen.onTrue}
                  sx={{
                    mr: 1,
                    ml: -1,
                    [theme.breakpoints.up(layoutQuery)]: { display: 'none' },
                  }}
                />
                <NavMobile
                  data={navData}
                  open={mobileNavOpen.value}
                  onClose={mobileNavOpen.onFalse}
                />
                {/* -- Logo -- */}
                <Logo isSingle={false}/>
              </>
            ),
            rightArea: (
              <>
                {/* -- Nav desktop -- */}
                <NavDesktop
                  data={navData}
                  sx={{
                    display: 'none',
                    [theme.breakpoints.up(layoutQuery)]: { mr: 2.5, display: 'flex' },
                  }}
                />
                <Box display="flex" alignItems="center" gap={{ xs: 1, sm: 1.5 }}>
                  {/* -- Sign in button -- */}
                  {!authenticated && <SignInButton />}

                  {authenticated && <Stack
                    flexGrow={1}
                    direction="row"
                    alignItems="center"
                    justifyContent="flex-end"
                    spacing={{ xs: 0.5, sm: 1 }}
                  >
                    {/*<AccountPopover data={options} />*/}
                    {authenticated && <AccountDrawer data={_account}  />}
                  </Stack>}
                  {/* -- Settings button -- */}
                  {/*<SettingsButton />*/}
                </Box>
              </>
            ),
          }}
        />
      }
      /** **************************************
       * Footer
       *************************************** */
      footerSection={homePage ? <HomeFooter /> : <Footer layoutQuery={layoutQuery} />}
      /** **************************************
       * Style
       *************************************** */
      sx={sx}
    >
      <Main>{children}</Main>
    </LayoutSection>
  );
}
