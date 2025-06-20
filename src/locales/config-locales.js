export const fallbackLng = 'bg';
export const languages = ['en', 'bg'];
export const defaultNS = 'common';
export const cookieName = 'i18next';

// ----------------------------------------------------------------------

export function i18nOptions(lng = fallbackLng, ns = defaultNS) {
  return {
    // debug: true,
    lng,
    fallbackLng,
    ns,
    defaultNS,
    fallbackNS: defaultNS,
    supportedLngs: languages,
  };
}

// ----------------------------------------------------------------------

export const changeLangMessages = {
  en: {
    success: 'Language has been changed!',
    error: 'Error changing language!',
    loading: 'Loading...',
  },
  bg: {
    success: 'Езикът беше сменен',
    error: 'Грешка при смяна на езика.',
    loading: 'Зарежда...',
  },
};
