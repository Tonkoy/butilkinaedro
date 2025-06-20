import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

import { fPercent } from 'src/utils/format-number';

import { CONFIG } from 'src/config-global';
import { varAlpha, stylesMode } from 'src/theme/styles';

import { Image } from 'src/components/image';
import { Iconify } from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';
import { paths } from 'src/routes/paths';
// ----------------------------------------------------------------------

export const SKILLS = [...Array(3)].map((_, index) => ({
  label: ['Development', 'Design', 'Marketing'][index],
  value: [20, 40, 60][index],
}));

// ----------------------------------------------------------------------

export function AboutWhat({ sx, ...other }) {
  return (
    <Box component="section" sx={{ overflow: 'hidden', ...sx }} {...other}>
      <Container
        component={MotionViewport}
        sx={{
          py: { xs: 10, md: 15 },
          textAlign: { xs: 'center', md: 'unset' },
        }}
      >
        <Grid container columnSpacing={{ md: 3 }} alignItems="flex-start">
          <Grid
            container
            xs={12}
            md={6}
            lg={7}
            alignItems="center"
            sx={{
              pr: { md: 7 },
              display: { xs: 'none', md: 'flex' },
            }}
          >
            <Grid xs={6}>
              <m.div variants={varFade().inUp}>
                <Image
                  alt="Our office small"
                  src={`${CONFIG.assetsDir}/assets/images/about/what_small_3.webp`}
                  ratio="1/1"
                  sx={(theme) => ({
                    borderRadius: 3,
                    boxShadow: `-40px 40px 80px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.24)}`,
                    [stylesMode.dark]: {
                      boxShadow: `-40px 40px 80px ${varAlpha(theme.vars.palette.common.blackChannel, 0.24)}`,
                    },
                  })}
                />
              </m.div>
            </Grid>

            <Grid xs={6}>
              <m.div variants={varFade().inUp}>
                <Image
                  alt="Our office large"
                  src={`${CONFIG.assetsDir}/assets/images/about/what_small_4.webp`}
                  ratio="3/4"
                  sx={(theme) => ({
                    borderRadius: 10,
                    boxShadow: `-40px 40px 80px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.24)}`,
                    [stylesMode.dark]: {
                      boxShadow: `-40px 40px 80px ${varAlpha(theme.vars.palette.common.blackChannel, 0.24)}`,
                    },
                  })}
                />
              </m.div>
            </Grid>
          </Grid>

          <Grid xs={12} md={6} lg={5}>
            <m.div variants={varFade().inRight}>
              <Typography variant="h2" sx={{ mb: 3 }}>
                Какво ни прави различни
              </Typography>
            </m.div>

            <m.div variants={varFade().inRight}>
              <Typography
                sx={{color: 'text.secondary', [stylesMode.dark]: {color: 'common.white'}}}
              >
                🛠️ Умно проектирани:<br/>
                Всяка бутилка или чаша или термос , комбинират ергономичен дизайн, устойчиви материали и модерен стил.
                <br/>
                🌿 Екологичен ангажимент:<br/>
                Нашите продукти са направени от незамърсяващи и рециклируеми материали, които щадят природата и
                насърчават осъзнат избор.
               <br/>
                  👫 Създадени за активните хора:<br/>
                  Без значение дали сте в офиса, в планината или на път – Butilko е винаги с теб.
              </Typography>
            </m.div>

            {/*<Box gap={3} display="flex" flexDirection="column" sx={{ my: 5 }}>
              {SKILLS.map((progress, index) => (
                <Box component={m.div} key={progress.label} variants={varFade().inRight}>
                  <Box
                    display="flex"
                    alignItems="center"
                    sx={{ mb: 1, color: 'text.secondary', typography: 'body2' }}
                  >
                    <Typography variant="subtitle2" sx={{ flexGrow: 1, color: 'text.primary' }}>
                      {progress.label}
                    </Typography>
                    {fPercent(progress.value)}
                  </Box>

                  <LinearProgress
                    color={(index === 0 && 'primary') || (index === 1 && 'warning') || 'error'}
                    variant="determinate"
                    value={progress.value}
                  />
                </Box>
              ))}
            </Box>*/}

            <m.div variants={varFade().inRight} >
              <Button
                sx={{mt: 5}}
                href={paths.products.root}
                variant="outlined"
                color="inherit"
                size="large"
                endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
              >
                Виж продуктите
              </Button>
            </m.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
