import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { useTranslate } from "../../locales";

// ----------------------------------------------------------------------

export function SignUpTerms({ sx, ...other }) {
  const {t: tAuth} = useTranslate('auth')

  return (
    <Box
      component="span"
      sx={{
        mt: 3,
        display: 'block',
        textAlign: 'center',
        typography: 'caption',
        color: 'text.secondary',
        ...sx,
      }}
      {...other}
    >
      {tAuth('terms.agreementPrefix')}
      <Link underline="always" color="text.primary">
        {tAuth('terms.termsOfService')}
      </Link>
      {tAuth('terms.and')}
      <Link underline="always" color="text.primary">
        {tAuth('terms.privacyPolicy')}
      </Link>
      .
    </Box>
  );
}
