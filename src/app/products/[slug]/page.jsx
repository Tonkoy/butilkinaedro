import { CONFIG } from 'src/config-global';
import { getProduct } from 'src/actions/product-ssr';
import { ProductShopDetailsView } from 'src/sections/product/view';
import {endpoints, fetcher} from "../../../utils/axios";

export async function generateMetadata({ params }) {
  const { slug } = params;
  const product = await getProduct(slug);

  return {
    title: product?.seoTitle || `${product?.name} - ${CONFIG.appName}`,
    description: product?.seoDescription || product?.description,
    keywords: product?.seoKeywords || '',
    openGraph: {
      title: product?.seoTitle || product?.name,
      description: product?.seoDescription || '',
      images: [
        {
          url: product?.ogImageUrl || product?.defaultImage || '',
          alt: product?.name || '',
        },
      ],
    },
  };
}

export default async function Page({ params }) {
  const { slug } = params;
  const product = await getProduct(slug);

  return <ProductShopDetailsView product={product} />;
}

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  if (CONFIG.isStaticExport) {
    const res = await fetcher(endpoints.products.list);
    return res.data.products.map((product) => ({ slug: product.slug }));
  }
  return [];
}
