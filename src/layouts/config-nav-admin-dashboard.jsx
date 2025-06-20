
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

export const adminNavData = [
  /**
   * Overview
   */
  {
    subheader: 'Табло',
    items: [
      { title: 'Основно табло', path: paths.dashboard.root, icon: ICONS.ecommerce }
    ],
  },
  /**
   * Management
   */
  {
    subheader: 'Менажиране на магазин',
    items: [

      {
        title: 'Категории',
        path: paths.dashboard.categories.root,
        icon: ICONS.categories,
        children: [
          { title: 'Списък', path: paths.dashboard.product.root },
          { title: 'Създай продукт', path: paths.dashboard.product.new }
          /*
          { title: 'Детайли', path: paths.dashboard.categories.details },
          { title: 'Промени категория', path: paths.dashboard.categories.edit },*/
        ],
      },
      {
        title: 'Продукти',
        path: paths.dashboard.product.root,
        icon: ICONS.product,
        children: [
          { title: 'Списък', path: paths.dashboard.product.root },
          { title: 'Създай продукт', path: paths.dashboard.product.new }
        ],
      },
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
    subheader: 'Администрация',
    items: [
      {
        title: 'Потребители',
        path: paths.dashboard.user.root,
        icon: ICONS.user,
        children: [
          { title: 'Профил', path: paths.dashboard.user.root },
          { title: 'Карти', path: paths.dashboard.user.cards },
          { title: 'Списък', path: paths.dashboard.user.list },
          { title: 'Създай потребител', path: paths.dashboard.user.new },
          { title: 'Промени потребител', path: paths.dashboard.user.demo.edit },
          { title: 'Акаунт', path: paths.dashboard.user.account },
        ],
      },
      {
        // default roles : All roles can see this entry.
        // roles: ['user'] Only users can see this item.
        // roles: ['admin'] Only admin can see this item.
        // roles: ['admin', 'manager'] Only admin/manager can see this item.
        // Reference from 'src/guards/RoleBasedGuard'.
        title: 'Достъп',
        path: paths.dashboard.permission,
        icon: ICONS.lock,
        roles: ['admin', 'manager'],
        caption: 'Достъп за администратори',
      },
      /*  {
         title: 'Level',
         path: '#/dashboard/menu_level',
         icon: ICONS.menuItem,
         children: [
           {
             title: 'Level 1a',
             path: '#/dashboard/menu_level/menu_level_1a',
             children: [
               {
                 title: 'Level 2a',
                 path: '#/dashboard/menu_level/menu_level_1a/menu_level_2a',
               },
               {
                 title: 'Level 2b',
                 path: '#/dashboard/menu_level/menu_level_1a/menu_level_2b',
                 children: [
                   {
                     title: 'Level 3a',
                     path: '#/dashboard/menu_level/menu_level_1a/menu_level_2b/menu_level_3a',
                   },
                   {
                     title: 'Level 3b',
                     path: '#/dashboard/menu_level/menu_level_1a/menu_level_2b/menu_level_3b',
                   },
                 ],
               },
             ],
           },
           { title: 'Level 1b', path: '#/dashboard/menu_level/menu_level_1b' },
         ],
       },
       {
         title: 'Disabled',
         path: '#disabled',
         icon: ICONS.disabled,
         disabled: true,
       },
       {
         title: 'Label',
         path: '#label',
         icon: ICONS.label,
         info: (
           <Label
             color="info"
             variant="inverted"
             startIcon={<Iconify icon="solar:bell-bing-bold-duotone" />}
           >
             NEW
           </Label>
         ),
       },
       {
         title: 'Caption',
         path: '#caption',
         icon: ICONS.menuItem,
         caption:
           'Quisque malesuada placerat nisl. In hac habitasse platea dictumst. Cras id dui. Pellentesque commodo eros a enim. Morbi mollis tellus ac sapien.',
       },
          {
            title: 'Params',
            path: '/dashboard/params?id=e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
            icon: ICONS.parameter,
          },
         {
            title: 'External link',
            path: 'https://www.google.com/',
            icon: ICONS.external,
            info: <Iconify width={18} icon="prime:external-link" />,
          },
          { title: 'Blank', path: paths.dashboard.blank, icon: ICONS.blank },*/
    ],
  },
];
