
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';

import { CONFIG } from 'src/config-global';
import { varAlpha, bgGradient } from 'src/theme/styles';

import { varFade, AnimateText, MotionContainer, animateTextClasses } from 'src/components/animate';

// ----------------------------------------------------------------------

export function FaqsHero({ sx, ...other }) {
  const theme = useTheme();

  return (
    <Box
      component="section"
      sx={{
        ...bgGradient({
          color: `0deg, ${varAlpha(theme.vars.palette.grey['900Channel'], 0.8)}, ${varAlpha(theme.vars.palette.grey['900Channel'], 0.8)}`,
          imgUrl: `${CONFIG.assetsDir}/assets/images/faqs/hero.webp`,
        }),
        height: { md: 560 },
        py: { xs: 10, md: 0 },
        overflow: 'hidden',
        position: 'relative',
        ...sx,
      }}
      {...other}
    >
      <Container component={MotionContainer}>
        <Box
          sx={{
            bottom: { md: 80 },
            position: { md: 'absolute' },
            textAlign: { xs: 'center', md: 'unset' },
          }}
        >
          <AnimateText
            component="h1"
            variant="h1"
            text={['Как', 'можем да Ви помогнем ?']}
            variants={varFade({ distance: 24 }).inRight}
            sx={{
              color: 'common.white',
              [`& .${animateTextClasses.line}[data-index="0"]`]: {
                [`& .${animateTextClasses.word}[data-index="0"]`]: { color: 'primary.main' },
              },
            }}
          />
        </Box>
      </Container>
    </Box>
  );
}
