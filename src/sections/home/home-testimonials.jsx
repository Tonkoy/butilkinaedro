import { useState } from 'react';
import { m } from 'framer-motion';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { fToNow } from 'src/utils/format-time';
import { varFade, MotionViewport, AnimateCountUp } from 'src/components/animate';
import {
  Carousel,
  useCarousel,
  CarouselDotButtons,
  carouselBreakpoints,
  CarouselArrowBasicButtons,
} from 'src/components/carousel';
import { SectionTitle } from './components/section-title';
import { FloatLine, FloatTriangleDownIcon } from './components/svg-elements';

import { _testimonials } from '../../_mock';

export function HomeTestimonials({ sx, ...other }) {
  const carousel = useCarousel({
    align: 'start',
    slidesToShow: { xs: 1, sm: 2, md: 3, lg: 4 },
    breakpoints: {
      [carouselBreakpoints.sm]: { slideSpacing: '24px' },
      [carouselBreakpoints.md]: { slideSpacing: '40px' },
      [carouselBreakpoints.lg]: { slideSpacing: '64px' },
    },
  });

  return (
    <Box component="section" sx={{ py: 10, position: 'relative', ...sx }} {...other}>
      <MotionViewport>
        <FloatLine vertical sx={{ top: 0, left: 80 }} />

        <Container>
          <SectionTitle
            caption="Отзиви"
            title="Какво казват"
            txtGradient="нашите клиенти"
            sx={{ mb: { xs: 5, md: 8 }, textAlign: 'center' }}
          />

          <Stack sx={{ position: 'relative', py: { xs: 5, md: 8 } }}>
            <Carousel carousel={carousel}>
              {_testimonials.map((item, index) => (
                <Stack key={index} component={m.div} variants={varFade().in}>
                  <Stack spacing={1} sx={{ typography: 'subtitle2' }}>
                    <Rating
                      size="small"
                      name="read-only"
                      value={item.ratingNumber}
                      precision={0.5}
                      readOnly
                    />
                  </Stack>

                  <Typography sx={{ mt: 2, mb: 3 }}>{item.content}</Typography>

                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar alt={item.name} src={item.avatarUrl} sx={{ width: 48, height: 48 }} />
                    <Stack sx={{ typography: 'subtitle1' }}>
                      <Box component="span">{item.name}</Box>
                      <Box component="span" sx={{ typography: 'body2', color: 'text.disabled' }}>
                        {fToNow(new Date(item.postedDate))}
                      </Box>
                    </Stack>
                  </Stack>
                </Stack>
              ))}
            </Carousel>

            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mt: { xs: 5, md: 8 } }}
            >
              <CarouselDotButtons
                variant="rounded"
                scrollSnaps={carousel.dots.scrollSnaps}
                selectedIndex={carousel.dots.selectedIndex}
                onClickDot={carousel.dots.onClickDot}
              />

              <CarouselArrowBasicButtons {...carousel.arrows} options={carousel.options} />
            </Stack>
          </Stack>
        </Container>
      </MotionViewport>
    </Box>
  );
}
