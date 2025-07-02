// src/components/logo/logo.jsx - Just change logo source
'use client';

import { useId, forwardRef } from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { RouterLink } from 'src/routes/components';
import { logoClasses } from './classes';
import { CONFIG } from "../../config-global";

export const Logo = forwardRef(
  (
    { width, href = '/', height, isSingle = true, disableLink = false, className, sx, ...other },
    ref
  ) => {
    const theme = useTheme();
    const gradientId = useId();

    // Use tenant-specific logos
    const singleLogo = (
      <Box
        alt="Single logo"
        component="img"
        src={`${CONFIG.tenantConfig.logos.single}`}
        width="100%"
        height="100%"
      />
    );

    const fullLogo = (
      <Box
        alt="Full logo"
        component="img"
        src={`${CONFIG.tenantConfig.logos.full}`}
        width="100%"
        height="100%"
      />
    );

    // Rest of your existing code stays the same...
    const baseSize = {
      width: width ?? CONFIG.tenantConfig.logos.singleLogo.width,
      height: height ?? CONFIG.tenantConfig.logos.singleLogo.height,
      ...(!isSingle && {
        width: width ?? CONFIG.tenantConfig.logos.fullLogo.width,
        height: height ?? CONFIG.tenantConfig.logos.fullLogo.height,
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
