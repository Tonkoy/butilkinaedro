'use client';

import { Button, Typography, Container } from '@mui/material';
import { useRouter, useSearchParams } from 'src/routes/hooks';
import { ForbiddenIllustration } from 'src/assets/illustrations';

export default function Unauthorized() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/';

  const handleLoginRedirect = () => {
    router.replace(`/auth/login?returnTo=${returnTo}`);
  };

  return (
    <Container sx={{ textAlign: 'center', py: 10 }}>
      <Typography variant="h3" sx={{ mb: 2 }}>
        Unauthorized (401)
      </Typography>

      <Typography sx={{ mb: 4, color: 'text.secondary' }}>
        You must be logged in to access this page.
      </Typography>

      <ForbiddenIllustration sx={{ mb: 4, maxWidth: 360, mx: 'auto' }} />

      <Button variant="contained" onClick={handleLoginRedirect}>
        Go to Login
      </Button>
    </Container>
  );
}
