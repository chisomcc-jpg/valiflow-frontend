import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import commonSV from './locales/sv/common.json';
import dashboardSV from './locales/sv/dashboard.json';
import invoicesSV from './locales/sv/invoices.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      sv: {
        common: commonSV,
        dashboard: dashboardSV,
        invoices: invoicesSV,
      },
      en: {
        common: {},      // add English translations later
        dashboard: {},
        invoices: {},
      },
    },
    lng: 'sv',          // default language
    fallbackLng: 'sv',
    interpolation: {
      escapeValue: false, // React already escapes
    },
  });

export default i18n;
