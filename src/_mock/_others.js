import { _mock } from './_mock';

// ----------------------------------------------------------------------

export const _carouselsMembers = [...Array(6)].map((_, index) => ({
  id: _mock.id(index),
  name: _mock.fullName(index),
  role: _mock.role(index),
  avatarUrl: _mock.image.portrait(index),
}));

// ----------------------------------------------------------------------

export const _faqs = [
  {
    id: 'faq1',
    value: 'panel1',
    heading: 'От какъв материал са изработени бутилките?',
    detail:
      'Повечето от нашите бутилки са изработени от неръждаема стомана или висококачествена BPA-free пластмаса, които са безопасни, устойчиви и екологични.',
  },
  {
    id: 'faq2',
    value: 'panel2',
    heading: 'Задържат ли температурата на напитката?',
    detail:
      'Да! Термо бутилките могат да задържат топлина до 12 часа и студ до 24 часа благодарение на двойните си изолационни стени.',
  },
  {
    id: 'faq3',
    value: 'panel3',
    heading: 'Подходящи ли са за съдомиялна машина?',
    detail:
      'Препоръчваме ръчно измиване за по-дълъг живот на покритието и изолацията. Някои модели са подходящи за съдомиялна, но винаги проверявайте инструкциите.',
  },
  {
    id: 'faq4',
    value: 'panel4',
    heading: 'Мога ли да поръчам бутилка с персонален дизайн?',
    detail:
      'Да! Предлагаме възможности за гравиране или печат по индивидуален дизайн – с лого, име или съобщение. Свържете се с нас за оферта.',
  },
  {
    id: 'faq5',
    value: 'panel5',
    heading: 'Изтичат ли бутилките?',
    detail:
      'Всички наши бутилки преминават тест за водонепропускливост. Ако капачката е затегната правилно, бутилката не изтича.',
  },
  {
    id: 'faq6',
    value: 'panel6',
    heading: 'Какъв е капацитетът на бутилките?',
    detail:
      'Предлагаме разнообразие от обеми – от 350 ml до 1000 ml, за да отговорим на нуждите на различни потребители – от ученици до спортисти.',
  },
  {
    id: 'faq7',
    value: 'panel7',
    heading: 'Имат ли гаранция продуктите?',
    detail:
      'Да, всички наши бутилки идват с 6-месечна гаранция при производствени дефекти. Повреда от неправилна употреба не се покрива.',
  },
  {
    id: 'faq8',
    value: 'panel8',
    heading: 'Какви цветове са налични?',
    detail:
      'Предлагаме богата гама от цветове – от класически черен и сребрист до ярко червен, син, зелен, пастелни и матови нюанси.',
  },
];


// ----------------------------------------------------------------------

export const _addressBooks = [...Array(24)].map((_, index) => ({
  id: _mock.id(index),
  primary: index === 0,
  name: _mock.fullName(index),
  email: _mock.email(index + 1),
  fullAddress: _mock.fullAddress(index),
  phoneNumber: _mock.phoneNumber(index),
  company: _mock.companyNames(index + 1),
  addressType: index === 0 ? 'Home' : 'Office',
}));

// ----------------------------------------------------------------------

export const _contacts = [...Array(20)].map((_, index) => {
  const status =
    (index % 2 && 'online') || (index % 3 && 'offline') || (index % 4 && 'alway') || 'busy';

  return {
    id: _mock.id(index),
    status,
    role: _mock.role(index),
    email: _mock.email(index),
    name: _mock.fullName(index),
    phoneNumber: _mock.phoneNumber(index),
    lastActivity: _mock.time(index),
    avatarUrl: _mock.image.avatar(index),
    address: _mock.fullAddress(index),
  };
});

// ----------------------------------------------------------------------

export const _notifications = [...Array(9)].map((_, index) => ({
  id: _mock.id(index),
  avatarUrl: [
    _mock.image.avatar(1),
    _mock.image.avatar(2),
    _mock.image.avatar(3),
    _mock.image.avatar(4),
    _mock.image.avatar(5),
    null,
    null,
    null,
    null,
    null,
  ][index],
  type: ['friend', 'project', 'file', 'tags', 'payment', 'order', 'chat', 'mail', 'delivery'][
    index
  ],
  category: [
    'Communication',
    'Project UI',
    'File manager',
    'File manager',
    'File manager',
    'Order',
    'Order',
    'Communication',
    'Communication',
  ][index],
  isUnRead: _mock.boolean(index),
  createdAt: _mock.time(index),
  title:
    (index === 0 && `<p><strong>Deja Brady</strong> sent you a friend request</p>`) ||
    (index === 1 &&
      `<p><strong>Jayvon Hull</strong> mentioned you in <strong><a href='#'>Minimal UI</a></strong></p>`) ||
    (index === 2 &&
      `<p><strong>Lainey Davidson</strong> added file to <strong><a href='#'>File manager</a></strong></p>`) ||
    (index === 3 &&
      `<p><strong>Angelique Morse</strong> added new tags to <strong><a href='#'>File manager<a/></strong></p>`) ||
    (index === 4 &&
      `<p><strong>Giana Brandt</strong> request a payment of <strong>$200</strong></p>`) ||
    (index === 5 && `<p>Your order is placed waiting for shipping</p>`) ||
    (index === 6 && `<p>Delivery processing your order is being shipped</p>`) ||
    (index === 7 && `<p>You have new message 5 unread messages</p>`) ||
    (index === 8 && `<p>You have new mail`) ||
    '',
}));

// ----------------------------------------------------------------------

export const _mapContact = [
  { latlng: [33, 65], address: _mock.fullAddress(1), phoneNumber: _mock.phoneNumber(1) },
  { latlng: [-12.5, 18.5], address: _mock.fullAddress(2), phoneNumber: _mock.phoneNumber(2) },
];

// ----------------------------------------------------------------------

export const _socials = [
  {
    value: 'facebook',
    label: 'Facebook',
    path: 'https://www.facebook.com/caitlyn.kerluke',
  },
  {
    value: 'instagram',
    label: 'Instagram',
    path: 'https://www.instagram.com/caitlyn.kerluke',
  },
  {
    value: 'linkedin',
    label: 'Linkedin',
    path: 'https://www.linkedin.com/caitlyn.kerluke',
  },
  {
    value: 'twitter',
    label: 'Twitter',
    path: 'https://www.twitter.com/caitlyn.kerluke',
  },
];

// ----------------------------------------------------------------------

export const _pricingPlans = [
  {
    subscription: 'basic',
    price: 0,
    caption: 'Forever',
    lists: ['3 prototypes', '3 boards', 'Up to 5 team members'],
    labelAction: 'Current plan',
  },
  {
    subscription: 'starter',
    price: 4.99,
    caption: 'Saving $24 a year',
    lists: [
      '3 prototypes',
      '3 boards',
      'Up to 5 team members',
      'Advanced security',
      'Issue escalation',
    ],
    labelAction: 'Choose starter',
  },
  {
    subscription: 'premium',
    price: 9.99,
    caption: 'Saving $124 a year',
    lists: [
      '3 prototypes',
      '3 boards',
      'Up to 5 team members',
      'Advanced security',
      'Issue escalation',
      'Issue development license',
      'Permissions & workflows',
    ],
    labelAction: 'Choose premium',
  },
];

// ----------------------------------------------------------------------

export const _testimonials = [
  {
    name: "Ивайло Д., продуктов мениджър, Пловдив",
    postedDate: _mock.time(1),
    ratingNumber: 4,
    avatarUrl: _mock.image.avatar(1),
    content: `Купих бутилка за офиса, за вкъщи и една за пътуване. Цветовете са супер, а капачката не протича. Със сигурност ще поръчам още.“`,
  },
  {
    name: 'Николай Т., треньор по йога, Варна',
    postedDate: _mock.time(2),
    ratingNumber: 5,
    avatarUrl: _mock.image.avatar(2),
    content: `Най-добрата термо бутилка, която съм имал. Издържа целия ден, а дизайнът събира погледите навсякъде.`,
  },
  {
    name: "Светла Г., блогър, Бургас",
    postedDate: _mock.time(3),
    ratingNumber: 5,
    avatarUrl: _mock.image.avatar(3),
    content: `„Бърза доставка, красиво опакован продукт и чудесен подарък. Единствено бих добавила опция за персонализация.“`,
  },
  {
    name: "Радослав К., спортен ентусиаст, Велико Търново",
    postedDate: _mock.time(4),
    ratingNumber: 4,
    avatarUrl: _mock.image.avatar(4),
    content: `Идеалната бутилка за активни хора! Използвам я ежедневно във фитнеса и по време на разходки – здрава е, лека и стилна.“`,
  },
  {
    name: "Магдалена С., ученичка, Стара Загора",
    postedDate: _mock.time(5),
    ratingNumber: 5,
    avatarUrl: _mock.image.avatar(5),
    content: `Получих бутилката си като подарък и веднага си поръчах още една! Качеството е страхотно, а усещането, че допринасям за природата, е безценно.`,
  }
];
