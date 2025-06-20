'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import CategoryForm from "./add-category-form";
import {useGetCategories} from "../../actions/categories";
import { useRouter } from 'src/routes/hooks';
import {useTranslate} from "src/locales";

// ----------------------------------------------------------------------

export function CategoryCreateView() {
  const { categories, categoriesLoading, categoriesError, refetchCategories } = useGetCategories();
  const { t: tCategory } = useTranslate('category');
  const router = useRouter();

  const afterCreate = async () => {
    await refetchCategories();
    router.push(paths.dashboard.categories.root);
  }

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={tCategory('general.newCategory')}
        links={[
          { name: tCategory('general.dashboard'), href: paths.dashboard.root },
          { name: tCategory('general.categories'), href: paths.dashboard.categories.root },
          { name: tCategory('general.addCategory') }
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <CategoryForm editable={false} categories={categories} initialValues={{}} afterCreate={afterCreate}/>
    </DashboardContent>
  );
}
