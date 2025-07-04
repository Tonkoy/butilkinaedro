'use client';

import { useState, useEffect, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { useTabs } from 'src/hooks/use-tabs';

import { varAlpha } from 'src/theme/styles';
import { PRODUCT_PUBLISH_OPTIONS } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

import { ProductDetailsReview } from '../product-details-review';
import { ProductDetailsSummary } from '../product-details-summary';
import { ProductDetailsToolbar } from '../product-details-toolbar';
import { ProductDetailsCarousel } from '../product-details-carousel';
import { ProductDetailsDescription } from '../product-details-description';

// ----------------------------------------------------------------------

const SUMMARY = [
  {
    title: 'Висококачествени продукти',
    description: 'Гарантирано качество както на продуктите, така и на персонализирането им.',
    icon: 'solar:verified-check-bold',
  },
  {
    title: 'Бърза обработка на поръчките',
    description: 'При наличност на продукта в нашата система, гарантираме обработка до 3 работни дни.',
    icon: 'solar:clock-circle-bold',
  },
  {
    title: 'Коректност и прозрачност',
    description: 'Държим на коректното отношение и прозрачността в изпълнението на поръчката',
    icon: 'solar:shield-check-bold',
  },
];

// ----------------------------------------------------------------------

export function ProductDetailsView({ product }) {
  const tabs = useTabs('description');

  const [publish, setPublish] = useState('');

  useEffect(() => {
    if (product) {
      setPublish(product?.publish);
    }
  }, [product]);

  const handleChangePublish = useCallback((newValue) => {
    setPublish(newValue);
  }, []);

  return (
    <DashboardContent>
      <ProductDetailsToolbar
        backLink={paths.dashboard.product.root}
        editLink={paths.dashboard.product.edit(`${product?._id}`)}
        liveLink={paths.products.details(`${product?._id}`)}
        publish={publish}
        onChangePublish={handleChangePublish}
        publishOptions={PRODUCT_PUBLISH_OPTIONS}
      />

      <Grid container spacing={{ xs: 3, md: 5, lg: 8 }}>
        <Grid xs={12} md={6} lg={7}>
          <ProductDetailsCarousel product={product ?? []} />
        </Grid>

        <Grid xs={12} md={6} lg={5}>
          {product && <ProductDetailsSummary disableActions product={product} />}
        </Grid>
      </Grid>

      <Box
        gap={5}
        display="grid"
        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
        sx={{ my: 10 }}
      >
        {SUMMARY.map((item) => (
          <Box key={item.title} sx={{ textAlign: 'center', px: 5 }}>
            <Iconify icon={item.icon} width={32} sx={{ color: 'primary.main' }} />

            <Typography variant="subtitle1" sx={{ mb: 1, mt: 2 }}>
              {item?.name}
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {item?.descriptionTranslated}
            </Typography>
          </Box>
        ))}
      </Box>

      <Card>
        <Tabs
          value={tabs.value}
          onChange={tabs.onChange}
          sx={{
            px: 3,
            boxShadow: (theme) =>
              `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
          }}
        >
          {[
            { value: 'description', label: 'Description' },
            /* { value: 'reviews', label: `Reviews (${product?.reviews.length})` }, */
          ].map((tab) => (
            <Tab key={tab.value} value={tab.value} label={tab.label} />
          ))}
        </Tabs>

        {tabs.value === 'description' && (
          <ProductDetailsDescription description={product?.description ?? ''} />
        )}

       {/* {tabs.value === 'reviews' && (
          <ProductDetailsReview
            ratings={product?.ratings ?? []}
            reviews={product?.reviews ?? []}
            totalRatings={product?.totalRatings ?? 0}
            totalReviews={product?.totalReviews ?? 0}
          />
        )}*/}
      </Card>
    </DashboardContent>
  );
}
