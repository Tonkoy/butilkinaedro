import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { Iconify } from 'src/components/iconify';
import {useTranslate} from "../../locales";

// ----------------------------------------------------------------------

export const chipProps = {
  size: 'small',
  variant: 'soft',
};

export function FiltersResult({ totalResults, onReset, sx, children }) {
  const {t: tCommon} = useTranslate('common');

  return (
    <Box sx={sx}>
      <Box sx={{ mb: 1.5, typography: 'body2' }}>
        <strong>{totalResults}</strong>
        <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
          {tCommon('text.resultsFound')}
        </Box>
      </Box>

      <Box flexGrow={1} gap={1} display="flex" flexWrap="wrap" alignItems="center">
        {children}

        <Button
          color="error"
          onClick={onReset}
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
        >
          {tCommon('buttons.clear')}
        </Button>
      </Box>
    </Box>
  );
}
