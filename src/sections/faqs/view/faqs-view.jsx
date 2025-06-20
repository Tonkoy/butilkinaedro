'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { FaqsHero } from '../faqs-hero';
import { FaqsList } from '../faqs-list';
import { FaqsForm } from '../faqs-form';
import { FaqsCategory } from '../faqs-category';
import {
  _faqsAccount,
  _faqsPayment,
  _faqsDelivery,
  _faqsProductIssues,
  _faqsReturns,
  _faqsWarranty,
} from './data';
// ----------------------------------------------------------------------

export function FaqsView() {
  return (
    <>
      <FaqsHero />

      <Container component="section" sx={{ pb: 10, pt: { xs: 10, md: 15 }, position: 'relative' }}>
        <FaqsCategory />

        <Typography variant="h3" sx={{ my: { xs: 5, md: 10 } }}>
          Често задавани въпроси
        </Typography>

        <Box
          gap={10}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
          <Box>
            <Box id="account" sx={{ mb: 10 }}>
              <Typography variant="h5" sx={{ mb: 3 }}>Управление на акаунта</Typography>
              <FaqsList items={_faqsAccount} />
            </Box>

            <Box id="payment" sx={{ mb: 10 }}>
              <Typography variant="h5" sx={{ mb: 3 }}>Плащания</Typography>
              <FaqsList items={_faqsPayment} />
            </Box>
            <Box id="delivery" sx={{ mb: 10 }}>
              <Typography variant="h5" sx={{ mb: 3 }}>Доставка</Typography>
              <FaqsList items={_faqsDelivery} />
            </Box>

            <Box id="product-issues" sx={{ mb: 10 }}>
              <Typography variant="h5" sx={{ mb: 3 }}>
                Проблеми с продукта
              </Typography>
              <FaqsList items={_faqsProductIssues} />
            </Box>

            <Box id="returns" sx={{ mb: 10 }}>
              <Typography variant="h5" sx={{ mb: 3 }}>
                Връщане и/или замяна
              </Typography>
              <FaqsList items={_faqsReturns} />
            </Box>

            <Box id="warranty" sx={{ mb: 10 }}>
              <Typography variant="h5" sx={{ mb: 3 }}>
                Гаранция
              </Typography>
              <FaqsList items={_faqsWarranty} />
            </Box>
          </Box>
          <FaqsForm />
        </Box>
      </Container>
    </>
  );
}
