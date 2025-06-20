'use client';

// core (MUI)
import {
  frFR as frFRCore,
  viVN as viVNCore,
  zhCN as zhCNCore,
  arSA as arSACore,
  bgBG as bgBGCore,
} from '@mui/material/locale';
// date pickers (MUI)
import {
  enUS as enUSDate,
  bgBG as bgBGDate,
} from '@mui/x-date-pickers/locales';
// data grid (MUI)
import {
  enUS as enUSDataGrid,
  frFR as frFRDataGrid,
  viVN as viVNDataGrid,
  zhCN as zhCNDataGrid,
  arSD as arSDDataGrid,
  bgBG as bgBGDataGrid,
} from '@mui/x-data-grid/locales';

// ----------------------------------------------------------------------

export const allLangs = [
  {
    value: 'en',
    label: 'English',
    countryCode: 'GB',
    adapterLocale: 'en',
    numberFormat: { code: 'en-US', currency: 'USD' },
    systemValue: {
      components: { ...enUSDate.components, ...enUSDataGrid.components },
    },
  },
  {
    value: 'bg',
    label: 'Bulgaria',
    countryCode: 'BG',
    adapterLocale: 'bg-bg',
    numberFormat: { code: 'bg', currency: 'BGN' },
    systemValue: {
      components: { ...bgBGCore.components, ...bgBGDataGrid.components },
    },
  },
];

/**
 * Country code:
 * https://flagcdn.com/en/codes.json
 *
 * Number format code:
 * https://gist.github.com/raushankrjha/d1c7e35cf87e69aa8b4208a8171a8416
 */
