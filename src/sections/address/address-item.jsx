import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import { Label } from 'src/components/label';
import {useTranslate} from "../../locales";

// ----------------------------------------------------------------------

export function AddressItem({ address, action, sx, ...other }) {
  const {t: tCommon} = useTranslate('common')

  return (
    <Paper
      sx={{
        gap: 2,
        display: 'flex',
        position: 'relative',
        alignItems: { md: 'flex-end' },
        flexDirection: { xs: 'column', md: 'row' },
        ...sx,
      }}
      {...other}
    >
      <Stack flexGrow={1} spacing={1}>
        <Stack direction="row" alignItems="center">
          <Typography variant="subtitle2">
            {address.addressName}
            <Box component="span" sx={{ ml: 0.5, typography: 'body2', color: 'text.secondary' }}>
              ({address.addressType === "Address" ? tCommon("text.address") : tCommon("text.office")})
            </Box>
          </Typography>

          {address.primary && (
            <Label color="info" sx={{ ml: 1 }}>
              {tCommon("text.default")}
            </Label>
          )}
        </Stack>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {address.address}, {address.city}
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {address.name}, {address.phoneNumber}
        </Typography>
      </Stack>

      {action && action}
    </Paper>
  );
}
