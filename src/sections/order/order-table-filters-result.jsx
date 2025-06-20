import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { fDateRangeShortLabel } from 'src/utils/format-time';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';
import {useTranslate} from "../../locales";

// ----------------------------------------------------------------------

export function OrderTableFiltersResult({ filters, totalResults, onResetPage, sx }) {
  const {t: tCommon} = useTranslate('common');
  const {t: tOrder} = useTranslate('order');
  const handleRemoveKeyword = useCallback(() => {
    onResetPage();
    filters.setState({ name: '' });
  }, [filters, onResetPage]);

  const handleRemoveStatus = useCallback(() => {
    onResetPage();
    filters.setState({ status: 'all' });
  }, [filters, onResetPage]);

  const handleRemoveDate = useCallback(() => {
    onResetPage();
    filters.setState({ startDate: null, endDate: null });
  }, [filters, onResetPage]);

  const handleReset = useCallback(() => {
    onResetPage();
    filters.onResetState();
  }, [filters, onResetPage]);

  return (
    <FiltersResult totalResults={totalResults} onReset={handleReset} sx={sx}>
      <FiltersBlock
        label={`${tCommon('text.status')}:`}
        isShow={filters.state.status !== 'all'}>
        <Chip
          {...chipProps}
          label={tOrder(`table.${filters.state.status}`) || filters.state.status}
          onDelete={handleRemoveStatus}
          sx={{ textTransform: 'capitalize' }}
        />
      </FiltersBlock>

      <FiltersBlock
        label={`${tCommon('text.date')}:`}
        isShow={Boolean(filters.state.startDate && filters.state.endDate)}
      >
        <Chip
          {...chipProps}
          label={fDateRangeShortLabel(filters.state.startDate, filters.state.endDate)}
          onDelete={handleRemoveDate}
        />
      </FiltersBlock>

      <FiltersBlock label={`${tCommon('text.keyword')}:`} isShow={!!filters.state.name}>
        <Chip {...chipProps} label={filters.state.name} onDelete={handleRemoveKeyword} />
      </FiltersBlock>
    </FiltersResult>
  );
}
