'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';

import { useCountdownDate } from 'src/hooks/use-countdown';

import { _socials } from 'src/_mock';
import { varAlpha } from 'src/theme/styles';
import { ComingSoonIllustration } from 'src/assets/illustrations';
import { TwitterIcon, FacebookIcon, LinkedinIcon, InstagramIcon } from 'src/assets/icons';

import {CONFIG} from "../../config-global";
// ----------------------------------------------------------------------


export const metadata = {
  title: `Начало - ${CONFIG.name}`,
  description: CONFIG.description,
};


export function ComingSoonView() {
  const countdown = useCountdownDate(new Date('2025-06-12 09:00'));

  return (
    <Container>
      <Typography variant="h3" sx={{ mb: 2, textAlign: 'center' }}>
        Съвсем скоро!
      </Typography>

      <Typography sx={{ color: 'text.secondary', textAlign: 'center' }}>
        Butilko ще ви предостави многообразие от бутилки, термоси и термо чаши!
      </Typography>

      <ComingSoonIllustration sx={{ my: { xs: 5, sm: 10 }, display: 'flex', mx: 'auto' }} />

      <Stack
        direction="row"
        justifyContent="center"
        divider={<Box sx={{ mx: { xs: 1, sm: 2.5 } }}>:</Box>}
        sx={{ typography: 'h2' }}
      >
        <TimeBlock label="days" value={countdown.days} />
        <TimeBlock label="hours" value={countdown.hours} />
        <TimeBlock label="minutes" value={countdown.minutes} />
        <TimeBlock label="seconds" value={countdown.seconds} />
      </Stack>

      {/*<TextField
        fullWidth
        placeholder="Enter your email"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Button variant="contained" size="large">
                Notify me
              </Button>
            </InputAdornment>
          ),
          sx: {
            pr: 0.5,
            [`&.${outlinedInputClasses.focused}`]: {
              boxShadow: (theme) => theme.customShadows.z20,
              transition: (theme) =>
                theme.transitions.create(['box-shadow'], {
                  duration: theme.transitions.duration.shorter,
                }),
              [`& .${outlinedInputClasses.notchedOutline}`]: {
                border: (theme) =>
                  `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.32)}`,
              },
            },
          },
        }}
        sx={{ my: 5 }}
      />*/}

      <Box gap={1} display="flex" justifyContent="center">
        {_socials.map((social) => (
          <IconButton key={social.label} color="inherit">
            {social.value === 'facebook' && <FacebookIcon />}
            {social.value === 'instagram' && <InstagramIcon />}
{/*
            {social.value === 'linkedin' && <LinkedinIcon />}
*/}
{/*
            {social.value === 'twitter' && <TwitterIcon />}
*/}
          </IconButton>
        ))}
      </Box>
    </Container>
  );
}

// ----------------------------------------------------------------------

function TimeBlock({ label, value }) {
  return (
    <div>
      <div> {value} </div>
      <Box sx={{ color: 'text.secondary', typography: 'body1' }}>{label}</Box>
    </div>
  );
}
