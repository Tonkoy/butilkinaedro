import { _orders } from 'src/_mock/_order';
import { CONFIG } from 'src/config-global';

import { OrderDetailsView } from 'src/sections/order/view';
import {getOrder} from "../../../../actions/order";

// ----------------------------------------------------------------------

export const metadata = { title: `Order details | Dashboard - ${CONFIG.appName}` };

export default async function Page({ params }) {
  const { id } = params;
  const order = await getOrder(id);
  return <OrderDetailsView order={order} />;
}

// ----------------------------------------------------------------------

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
    return _orders.map((order) => ({ id: order.id }));
  }
  return [];
}
