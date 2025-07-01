import { useState } from 'react';
import { m } from 'framer-motion';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Accordion, { accordionClasses } from '@mui/material/Accordion';
import AccordionDetails, { accordionDetailsClasses } from '@mui/material/AccordionDetails';
import AccordionSummary, { accordionSummaryClasses } from '@mui/material/AccordionSummary';

import { varAlpha } from 'src/theme/styles';
import { Iconify } from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';
import { SectionTitle } from './components/section-title';
import { FloatLine, FloatPlusIcon, FloatTriangleDownIcon } from './components/svg-elements';

import {
  _faqsAccount,
  _faqsPayment,
  _faqsDelivery,
  _faqsProductIssues,
  _faqsReturns,
  _faqsWarranty,
} from 'src/sections/faqs/view/data';

const convertToFAQFormat = (faqs) =>
  faqs.map(({ heading, detail }) => ({
    question: heading,
    answer: <Typography>{detail}</Typography>,
  }));

const FAQs = [
  ...convertToFAQFormat(_faqsAccount),
  ...convertToFAQFormat(_faqsPayment),
  ...convertToFAQFormat(_faqsDelivery),
  ...convertToFAQFormat(_faqsProductIssues),
  ...convertToFAQFormat(_faqsReturns),
  ...convertToFAQFormat(_faqsWarranty),
];

export function HomeFAQs({ sx, ...other }) {
  const [expanded, setExpanded] = useState(FAQs[0].question);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const renderDescription = (
    <SectionTitle
      caption="Въпроси"
      title="Ние имаме"
      txtGradient="отговорите"
      sx={{ textAlign: 'center' }}
    />
  );

  const renderContent = (
    <Stack spacing={1} sx={{ mt: 8, mx: 'auto', maxWidth: 720, mb: { xs: 5, md: 8 } }}>
      {FAQs.map((item, index) => (
        <Accordion
          key={item.question}
          component={m.div}
          variants={varFade({ distance: 24 }).inUp}
          expanded={expanded === item.question}
          onChange={handleChange(item.question)}
          sx={{
            borderRadius: 2,
            transition: (theme) =>
              theme.transitions.create(['background-color'], { duration: theme.transitions.duration.short }),
            '&::before': { display: 'none' },
            '&:hover': { bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.16) },
            '&:first-of-type, &:last-of-type': { borderRadius: 2 },
            [`&.${accordionClasses.expanded}`]: {
              m: 0,
              borderRadius: 2,
              boxShadow: 'none',
              bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
            },
            [`& .${accordionSummaryClasses.root}`]: {
              py: 3,
              px: 2.5,
              minHeight: 'auto',
              [`& .${accordionSummaryClasses.content}`]: { m: 0, [`&.${accordionSummaryClasses.expanded}`]: { m: 0 } },
            },
            [`& .${accordionDetailsClasses.root}`]: { px: 2.5, pt: 0, pb: 3 },
          }}
        >
          <AccordionSummary
            expandIcon={
              <Iconify width={20} icon={expanded === item.question ? 'mingcute:minimize-line' : 'mingcute:add-line'} />
            }
            aria-controls={`panel${index}bh-content`}
            id={`panel${index}bh-header`}
          >
            <Typography variant="h6">{item.question}</Typography>
          </AccordionSummary>
          <AccordionDetails>{item.answer}</AccordionDetails>
        </Accordion>
      ))}
    </Stack>
  );

  const renderContact = (
    <Stack alignItems="center" sx={{ px: 3, py: 8, textAlign: 'center', background: (theme) => `linear-gradient(270deg, ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}, ${varAlpha(theme.vars.palette.grey['500Channel'], 0)})` }}>
      <Typography variant="h4">Все още имате въпроси ?</Typography>
      <Typography sx={{ mt: 2, mb: 3, color: 'text.secondary' }}>Опишете въпроса си и ние ще ви помогнем</Typography>
      <Button color="inherit" variant="contained" href={`mailto:info@${process.env.NEXT_PUBLIC_FE_DOMAIN}.com`} startIcon={<Iconify icon="fluent:mail-24-filled" />}>
        Свържете се с нас
      </Button>
    </Stack>
  );

  return (
    <Box component="section" sx={{ ...sx }} {...other}>
      <MotionViewport sx={{ py: 10, position: 'relative' }}>
        <TopLines />
        <Container>
          {renderDescription}
          {renderContent}
        </Container>
        <Stack sx={{ position: 'relative' }}>
          <BottomLines />
          {renderContact}
        </Stack>
      </MotionViewport>
    </Box>
  );
}

function TopLines() {
  return <FloatLine vertical sx={{ top: 0, left: 80 }} />;
}

function BottomLines() {
  return <FloatLine sx={{ bottom: 0, left: 0 }} />;
}
