import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import Typography from '@mui/material/Typography';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';


import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function FaqsList({ items = [], sx, ...other }) {
  return (
    <Box sx={sx} {...other}>
      {items.map((accordion) => (
        <Accordion key={accordion.id}>
          <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
            <Typography variant="subtitle1">{accordion.heading}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{accordion.detail}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
