import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import {useTranslate} from "../../locales";

// ----------------------------------------------------------------------

export function FormResendCode({ value, disabled, onResendCode, sx, ...other }) {
  const { t: tAuth } = useTranslate('auth');
  return (
    <Box
      sx={{
        mt: 3,
        typography: 'body2',
        alignSelf: 'center',
        ...sx,
      }}
      {...other}
    >
      {tAuth('verify.dontHaveACode')}
      <Link
        variant="subtitle2"
        onClick={onResendCode}
        sx={{
          cursor: 'pointer',
          ...(disabled && {
            color: 'text.disabled',
            pointerEvents: 'none',
          }),
        }}
      >
        {tAuth('verify.resendCode')}
        {disabled && value && value > 0 && `(${value}s)`}
      </Link>
    </Box>
  );
}
