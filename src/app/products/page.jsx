import { CONFIG } from 'src/config-global';
import { getProducts } from 'src/actions/product-ssr';
import { useGetProduct } from 'src/actions/product';

import { ProductShopView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Бутилки, термоси и чаши - ${CONFIG.appName}` };

export default async function Page() {
  // const { products}  = useGetProduct();
  const products = await getProducts();

  return <ProductShopView products={products} />;
}
