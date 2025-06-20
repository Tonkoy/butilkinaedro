/**
 * https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore?tab=readme-ov-file#_flatten
 * https://github.com/you-dont-need-x/you-dont-need-lodash
 */
import {Iconify} from "../components/iconify";

// ----------------------------------------------------------------------

export function flattenArray(list, key = 'children') {
  let children = [];

  const flatten = list?.map((item) => {
    if (item[key] && item[key].length) {
      children = [...children, ...item[key]];
    }
    return item;
  });

  return flatten?.concat(children.length ? flattenArray(children, key) : children);
}

// ----------------------------------------------------------------------

export function flattenDeep(array) {
  const isArray = array && Array.isArray(array);

  if (isArray) {
    return array.flat(Infinity);
  }
  return [];
}

// ----------------------------------------------------------------------

export function orderBy(array, properties, orders) {
  return array.slice().sort((a, b) => {
    for (let i = 0; i < properties.length; i += 1) {
      const property = properties[i];
      const order = orders && orders[i] === 'desc' ? -1 : 1;

      const aValue = a[property];
      const bValue = b[property];

      if (aValue < bValue) return -1 * order;
      if (aValue > bValue) return 1 * order;
    }
    return 0;
  });
}

// ----------------------------------------------------------------------

export function keyBy(array, key) {
  return (array || []).reduce((result, item) => {
    const keyValue = key ? item[key] : item;

    return { ...result, [String(keyValue)]: item };
  }, {});
}

// ----------------------------------------------------------------------

export function sumBy(array, iteratee) {
  return array.reduce((sum, item) => sum + iteratee(item), 0);
}

// ----------------------------------------------------------------------

export function isEqual(a, b) {
  if (a === null || a === undefined || b === null || b === undefined) {
    return a === b;
  }

  if (typeof a !== typeof b) {
    return false;
  }

  if (typeof a === 'string' || typeof a === 'number' || typeof a === 'boolean') {
    return a === b;
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }

    return a.every((item, index) => isEqual(item, b[index]));
  }

  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) {
      return false;
    }

    return keysA.every((key) => isEqual(a[key], b[key]));
  }

  return false;
}

// ----------------------------------------------------------------------

function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

export const merge = (target, ...sources) => {
  if (!sources.length) return target;

  const source = sources.shift();

  // eslint-disable-next-line no-restricted-syntax
  for (const key in source) {
    if (isObject(source[key])) {
      if (!target[key]) Object.assign(target, { [key]: {} });
      merge(target[key], source[key]);
    } else {
      Object.assign(target, { [key]: source[key] });
    }
  }

  return merge(target, ...sources);
};

export const displayName = (user) => {
  return `${user?.firstName} ${user?.lastName}`;
}

export const ORDER_STATUSES = [
  { value: 'all', label: 'All', color: 'default' },
  { value: 'received', label: 'Received', color: 'info' },
  { value: 'inProgress', label: 'In Progress', color: 'warning' },
  { value: 'completed', label: 'Completed', color: 'success' },
  { value: 'cancelled', label: 'Cancelled', color: 'error' },
  { value: 'refunded', label: 'Refunded', color: 'default' },
];

export const PAYMENT_TYPE_ICONS = {
  cash: 'solar:wallet-money-bold',
  card: 'solar:card-bold',
  bank: 'solar:bank-bold',
};

export const PAYMENT_TYPE_OPTIONS = [
  { value: 'cash', label: 'В брой', icon: PAYMENT_TYPE_ICONS.cash },
  { value: 'card', label: 'с карта', icon: PAYMENT_TYPE_ICONS.card },
  { value: 'bank', label: 'Банков трансфер', icon: PAYMENT_TYPE_ICONS.bank },
];

export const INVOICE_STATUSES = [
  { value: 'paid', label: 'Платена', color: 'success' },
  { value: 'pending', label: 'Не платена', color: 'warning' },
  { value: 'overdue', label: 'Просрочена', color: 'error' },
  { value: 'draft', label: 'Чернова', color: 'default' }
];

export function getPaymentTypeIcon(paymentType) {
  const icon = PAYMENT_TYPE_ICONS[paymentType];
  return icon ? <Iconify icon={icon} width={20} /> : null;
}

export const getOrderStatusColor = (status) =>
  ORDER_STATUSES.find((s) => s.value === status)?.color || 'default';

export const getInvoiceStatusColor = (status) =>
  INVOICE_STATUSES.find((s) => s.value === status)?.color || 'default';

export const getOrderStatusLabel = (status) =>
  ORDER_STATUSES.find((s) => s.value === status)?.label || status;

export const getInvoiceStatusLabel = (status) =>
  INVOICE_STATUSES.find((s) => s.value === status)?.label || status;


export function buildEcontByOfficePayload(order) {
  return {
    label: {
      senderClient: {
        name :"Адкод ЕООД",
        phones:[
          "0883473222"
        ]
      },
      senderAgent:{
        name: "Дени Иванов",
        phones: ["0883473222"]
      },
      senderOfficeCode :"6013",
      receiverClient: {
        name: order.recipient,
        phones: [order.phoneNumber?.replace('+', '') || '']
      },
      receiverAgent: {
        name: order.recipient,
        phones: [order.phoneNumber?.replace('+', '') || '']
      },
      receiverOfficeCode: order?.shippingOfficeId,
      shipmentType: "PACK",
      packCount: order?.totalItems.length || 1,
      payAfterTest:false,
      sizeUnder60cm :true,
      payAfterAccept:true,
      partialDelivery: true,
      keepUpright :false,
      weight: 0.950,
      shipmentDescription: order?.items?.map((item) => item.name).join(', '),
      services:{
        cdType:"get",
        "cdAmount": order?.totalAmount,
        "cdCurrency":"BGN",
        "cdPayOptionsTemplate":"CD165547",
        "paymentSenderMethod":"",
        "paymentReceiverAmount":"cash"
      },
    },
    mode: "create"
  };
}
