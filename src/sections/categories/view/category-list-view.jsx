'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Container, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress,
  Alert, AlertTitle, Tab, Tabs, Button
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import { paths } from 'src/routes/paths';
import { Label } from 'src/components/label';
import {
  useTable, getComparator, TablePaginationCustom, TableNoData, TableEmptyRows,
} from 'src/components/table';
import { useBoolean } from 'src/hooks/use-boolean';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useGetCategories } from '../../../actions/categories';
import { RouterLink } from '../../../routes/components';
import { Iconify } from '../../../components/iconify';
import { useTranslate } from '../../../locales';

const defaultFilters = {
  name: '',
  status: 'all',
};

export default function CategoryListView() {
  const table = useTable({ defaultOrderBy: 'orderNumber' });
  const settings = useSettingsContext();
  const confirm = useBoolean();
  const [filters, setFilters] = useState(defaultFilters);
  const [tableData, setTableData] = useState([]);

  const { t: tCategory } = useTranslate('category');
  const { t: tCommon } = useTranslate('common');

  const [statusOptions, setStatusOptions] = useState([
    { value: 'all', label: tCategory('general.all') },
    { value: 'onlyParent', label: tCategory('general.onlyParent') }
  ]);

  const { categories, categoriesLoading, categoriesError } = useGetCategories();

  useEffect(() => {
    if (categories.length) {
      setTableData(categories);
    }
  }, [categories]);

  const groupCategoriesByParent = (categories) => {
    return categories.reduce((acc, category) => {
      const parentId = category.parentCategory || 'root';
      if (!acc[parentId]) {
        acc[parentId] = [];
      }
      acc[parentId].push(category);
      return acc;
    }, {});
  };

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const applyFilter = ({ inputData, comparator, filters }) => {
    const { name, status } = filters;
    let filteredData = inputData;

    if (name) {
      filteredData = filteredData.filter(
        (category) =>
          category.name.toLowerCase().includes(name.toLowerCase()) ||
          (category.description && category.description.toLowerCase().includes(name.toLowerCase()))
      );
    }

    if (status === 'onlyParent') {
      filteredData = filteredData.filter(category => !category.parentCategory);
    } else if (status !== 'all') {
      filteredData = filteredData.filter(category => category.parentCategory === status || category._id === status);
    }

    const stabilizedThis = filteredData.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      return order !== 0 ? order : a[1] - b[1];
    });

    return stabilizedThis.map((el) => el[0]);
  };

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const groupedCategories = groupCategoriesByParent(dataFiltered);

  if (categoriesLoading) {
    return <CircularProgress />;
  }

  if (categoriesError) {
    return (
      <Alert severity="warning">
        <AlertTitle>{tCategory('general.loadingErrorTitle')}</AlertTitle>
        {tCategory('general.loadingErrorMessage')}
      </Alert>
    );
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={tCategory('general.categoryList')}
        links={[
          { name: tCategory('general.dashboard'), href: paths.dashboard.root },
          { name: tCategory('general.categories'), href: paths.dashboard.categories.root },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.categories.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            {tCategory('general.addCategory')}
          </Button>
        }
      />

      <Card>
        <Tabs
          value={filters.status}
          onChange={(e, value) => handleFilters('status', value)}
          sx={{
            px: 2.5,
            boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
          }}
        >
          {statusOptions.map((tab) => (
            <Tab
              key={tab.value}
              iconPosition="end"
              value={tab.value}
              label={tab.label}
              icon={
                <Label
                  variant={(tab.value === 'all' || tab.value === filters.status) ? 'filled' : 'soft'}
                  color={(tab.value === 'all' && 'default') || 'primary'}
                >
                  {tab.value === 'all' && tableData.length}
                </Label>
              }
            />
          ))}
        </Tabs>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="categories table">
            <TableHead>
              <TableRow>
                <TableCell align="left">{tCategory('general.mainCategory')}</TableCell>
                <TableCell align="left">{tCategory('general.categoryName')}</TableCell>
                <TableCell align="left">{tCategory('general.description')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(groupedCategories).map((parentId) => (
                <>
                  {parentId !== 'root' && (
                    <TableRow style={{ backgroundColor: '#f0f0f0' }}>
                      <TableCell colSpan={4}>
                        <strong>{categories.find(c => c._id === parentId)?.name}</strong>
                      </TableCell>
                    </TableRow>
                  )}
                  {groupedCategories[parentId].map((category) => (
                    <TableRow key={category._id}>
                      <TableCell align="left">
                        {category.parentCategory
                          ? categories.find(c => c._id === category.parentCategory)?.name
                          : 'N/A'}
                      </TableCell>
                      <TableCell align="left">{category.name}</TableCell>
                      <TableCell align="left">{category.description}</TableCell>
                    </TableRow>
                  ))}
                  <TableEmptyRows height={52} emptyRows={table.emptyRows} />
                </>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePaginationCustom
          count={dataFiltered.length}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
          dense={table.dense}
          onChangeDense={table.onChangeDense}
        />

        {dataFiltered.length === 0 && <TableNoData />}
      </Card>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={tCategory('general.deleteTitle')}
        content={
          <>
            {tCategory('general.deleteConfirmation', {
              count: table.selected.length,
            })}
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            {tCommon('buttons.delete')}
          </Button>
        }
      />
    </Container>
  );
}
