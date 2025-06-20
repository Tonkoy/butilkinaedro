import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config-global';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />;

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  parameter: icon('ic-parameter'),
  categories: icon('ic-analytics'),
};

// ----------------------------------------------------------------------

export const navData = [
  /**
   * Overview
   */
  {
    subheader: 'Табло',
    items: [
      { title: 'Основна информация', path: paths.dashboard.root, icon: ICONS.ecommerce }
    ],
  },
  /**
   * Management
   */
  {
    subheader: 'Менажиране на магазин',
    items: [
      {
        title: 'Поръчки',
        path: paths.dashboard.order.root,
        icon: ICONS.order,
        children: [
          { title: 'Списък', path: paths.dashboard.order.root }
        ],
      },
      {
        title: 'Фактури',
        path: paths.dashboard.invoice.root,
        icon: ICONS.invoice,
        children: [
          { title: 'Списък', path: paths.dashboard.invoice.root },
/*          { title: 'Детайли', path: paths.dashboard.invoice.demo.details },
          { title: 'Създай', path: paths.dashboard.invoice.new },
          { title: 'Промени фактура', path: paths.dashboard.invoice.demo.edit },*/
        ],
      }
    ],
  },
  /**
   * Item State
   */
  {
    subheader: 'Системни Настройки',
    items: [
      {
        title: 'Потребители',
        path: paths.dashboard.user.root,
        icon: ICONS.user,
        children: [
          { title: 'Профил', path: paths.dashboard.user.account },
        ],
      },
    ],
  },

];
