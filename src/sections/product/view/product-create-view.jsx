'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ProductNewEditForm } from '../product-new-edit-form';
import {useGetCategories} from "../../../actions/categories";
import {LoadingScreen} from "../../../components/loading-screen";
// ----------------------------------------------------------------------

export function ProductCreateView() {

  const { categories, categoriesLoading, categoriesError, refetchCategories } = useGetCategories();

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new product"
        links={[
          { name: 'Табло', href: paths.dashboard.root },
          { name: 'Продукти', href: paths.dashboard.product.root },
          { name: 'Нов продукт' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {categoriesLoading && <LoadingScreen />}

      {!categoriesLoading && !categoriesError && <ProductNewEditForm categories={categories } />}
    </DashboardContent>
  );
}
