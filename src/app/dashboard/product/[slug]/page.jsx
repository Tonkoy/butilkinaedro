import axios, { endpoints } from 'src/utils/axios';

import { CONFIG } from 'src/config-global';

import { ProductDetailsView } from 'src/sections/product/view';
import { getProduct } from 'src/actions/product-ssr';

// ----------------------------------------------------------------------

export const metadata = { title: `Product details | Dashboard - ${CONFIG.appName}` };

export default async function Page({ params }) {
  const { slug } = params;
  const product = await getProduct(slug);

  return <ProductDetailsView product={product} />;
}

/**
 * [1] Default
 * Remove [1] and [2] if not using [2]
 */
const dynamic = CONFIG.isStaticExport ? 'auto' : 'force-dynamic';

export { dynamic };

/**
 * [2] Static exports
 * https://nextjs.org/docs/app/building-your-application/deploying/static-exports
 */
export async function generateStaticParams() {
  if (CONFIG.isStaticExport) {
    const res = await axios.get(endpoints.products.list);

    return res.data.products.map((product) => ({ slug: product.slug }));
  }
  return [];
}
