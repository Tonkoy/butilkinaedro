'use client';

import { useId, forwardRef } from 'react';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';

import { logoClasses } from './classes';
import {CONFIG} from "../../config-global";

// ----------------------------------------------------------------------

/*
* OR using local (public folder)
*
const singleLogo = (
<Box
  alt="Single logo"
  component="img"
  src={`${CONFIG.assetsDir}/logo/logo-single.svg`}
  width="100%"
  height="100%"
/>
);

const fullLogo = (
<Box
  alt="Full logo"
  component="img"
  src={`${CONFIG.assetsDir}/logo/logo-full.svg`}
  width="100%"
  height="100%"
/>
);
*
*/
export const Logo = forwardRef(
  (
    { width, href = '/', height, isSingle = true, disableLink = false, className, sx, ...other },
    ref
  ) => {
    const theme = useTheme();

    const gradientId = useId();

    const TEXT_PRIMARY = theme.vars.palette.text.primary;
    const PRIMARY_LIGHT = theme.vars.palette.primary.light;
    const PRIMARY_MAIN = theme.vars.palette.primary.main;
    const PRIMARY_DARKER = theme.vars.palette.primary.dark;

    const singleLogo = (
      <Box
        alt="Single logo"
        component="img"
        src={`${CONFIG.assetsDir}/logo/butilkinaedro_logo_v3.svg`}
        width="100%"
        height="100%"
      />
    );

    const fullLogo = (
      <Box
        alt="Full logo"
        component="img"
        src={`${CONFIG.assetsDir}/logo/butilkinaedro_logo_v4.svg`}
        width="100%"
        height="100%"
      />
    );

    const baseSize = {
      width: width ?? 250,
      height: height ?? 100,
      ...(!isSingle && {
        width: width ?? 102,
        height: height ?? 36,
      }),
    };

    return (
      <Box
        ref={ref}
        component={RouterLink}
        href={href}
        className={logoClasses.root.concat(className ? ` ${className}` : '')}
        aria-label="Logo"
        sx={{
          ...baseSize,
          flexShrink: 0,
          display: 'inline-flex',
          verticalAlign: 'middle',
          ...(disableLink && {pointerEvents: 'none'}),
          ...sx,
        }}
        {...other}
      >
        {isSingle ? singleLogo : fullLogo}
      </Box>
    );
  }
);
