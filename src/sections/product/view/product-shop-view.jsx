'use client';

import  { useState, useCallback } from 'react';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useBoolean } from 'src/hooks/use-boolean';
import { useDebounce } from 'src/hooks/use-debounce';
import { useSetState } from 'src/hooks/use-set-state';

import { orderBy } from 'src/utils/helper';

import {
  PRODUCT_SORT_OPTIONS,
  PRODUCT_COLOR_OPTIONS,
  PRODUCT_RATING_OPTIONS,
  PRODUCT_CATEGORY_OPTIONS,
} from 'src/_mock';

import { EmptyContent } from 'src/components/empty-content';
import { ProductList } from '../product-list';
import { ProductSort } from '../product-sort';
import { ProductSearch } from '../product-search';
import { CartIcon } from '../components/cart-icon';
import { ProductFilters } from '../product-filters';
import { useCheckoutContext } from '../../checkout/context';
import { ProductFiltersResult } from '../product-filters-result';
import {useTranslate} from "../../../locales";

export function ProductShopView({ products }) {
  const checkout = useCheckoutContext();

  const openFilters = useBoolean();
  const [sortBy, setSortBy] = useState('priceAsc');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery);
  const { t: tCommon } = useTranslate('common');

  const filters = useSetState({
    colors: [],
    rating: '',
    category: 'all',
    priceRange: [0, 200],
  });

  const dataFiltered = applyFilter({ inputData: products, filters: filters.state, sortBy });

  const canReset =
    filters.state.colors.length > 0 ||
    filters.state.rating !== '' ||
    filters.state.category !== 'all' ||
    filters.state.priceRange[0] !== 0 ||
    filters.state.priceRange[1] !== 200;

  const notFound = !dataFiltered.length /*&& canReset*/;

  const handleSortBy = useCallback((newValue) => {
    setSortBy(newValue);
  }, []);

  const handleSearch = useCallback((inputValue) => {
    setSearchQuery(inputValue);
  }, []);

  const renderFilters = (
    <Stack
      spacing={3}
      justifyContent="space-between"
      alignItems={{ xs: 'flex-end', sm: 'center' }}
      direction={{ xs: 'column', sm: 'row' }}
    >
      {/*<ProductSearch query={debouncedQuery} onSearch={handleSearch} />*/}

      <Stack direction="row" spacing={1} flexShrink={0}>
        {/* Todo: 1.Add filters*/}
        {/*<ProductFilters
          filters={filters}
          canReset={canReset}
          open={openFilters.value}
          onOpen={openFilters.onTrue}
          onClose={openFilters.onFalse}
          options={{
            colors: PRODUCT_COLOR_OPTIONS,
            ratings: PRODUCT_RATING_OPTIONS,
            categories: ['all', ...PRODUCT_CATEGORY_OPTIONS],
          }}
        />*/}

        <ProductSort sort={sortBy} onSort={handleSortBy} sortOptions={PRODUCT_SORT_OPTIONS} />
      </Stack>
    </Stack>
  );

  const renderResults = <ProductFiltersResult filters={filters} totalResults={dataFiltered.length} />;

  const renderNotFound = <EmptyContent filled sx={{ py: 10 }} />;

  return (
    <Container sx={{ mb: 15 }}>
      <CartIcon totalItems={checkout.totalItems} />

      <Typography variant="h4" sx={{ my: { xs: 3, md: 5 } }}>
        {tCommon('text.products')}
      </Typography>

      <Stack spacing={2.5} sx={{ mb: { xs: 3, md: 5 } }}>
        {renderFilters}
        {canReset && renderResults}
      </Stack>

      {notFound && renderNotFound}

      <ProductList products={dataFiltered} />
    </Container>
  );
}

// Filter and sort logic
function applyFilter({ inputData, filters, sortBy }) {
    const { category, colors, priceRange, rating } = filters;

    let data = inputData ? [...inputData] : [];

  // Sorting
  if (sortBy === 'featured') {
    data = orderBy(data, ['variations[0].price'], ['desc']);
  } else if (sortBy === 'priceAsc') {
    data = orderBy(data, ['variations[0].price'], ['asc']);
  } else if (sortBy === 'priceDesc') {
    data = orderBy(data, ['variations[0].price'], ['desc']);
  }

  // Filtering
  if (category !== 'all') {
    data = data.filter((item) => item.category === category);
  }

  if (colors.length) {
    data = data.filter((item) =>
      item.variations.some((variation) => colors.includes(variation.colorNameTranslated))
    );
  }

  if (rating) {
    // Assuming `rating` exists in the schema or use static data for now
    data = data.filter((item) => item.rating >= rating);
  }

  const [min, max] = priceRange;
  data = data.filter((item) =>
    item.variations.some((variation) => variation.price >= min && variation.price <= max)
  );

  return data;
}
