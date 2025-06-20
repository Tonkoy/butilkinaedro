import { CONFIG } from 'src/config-global';

import { ProductCreateView } from 'src/sections/product/view';
import {CategoryCreateView} from "../../../../sections/categories/category-create-view";

// ----------------------------------------------------------------------

export const metadata = { title: `Създай категория | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <CategoryCreateView />;
}
