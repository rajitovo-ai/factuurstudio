import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import nlAuth from './locales/nl/auth.json'
import nlCommon from './locales/nl/common.json'
import nlCustomers from './locales/nl/customers.json'
import nlDashboard from './locales/nl/dashboard.json'
import nlErrors from './locales/nl/errors.json'
import nlInvoiceGenerator from './locales/nl/invoiceGenerator.json'
import nlInvoiceImport from './locales/nl/invoiceImport.json'
import nlInvoices from './locales/nl/invoices.json'
import nlLanding from './locales/nl/landing.json'
import nlNavigation from './locales/nl/navigation.json'
import nlPricing from './locales/nl/pricing.json'
import nlSettings from './locales/nl/settings.json'
import nlSupport from './locales/nl/support.json'

import enAuth from './locales/en/auth.json'
import enCommon from './locales/en/common.json'
import enCustomers from './locales/en/customers.json'
import enDashboard from './locales/en/dashboard.json'
import enErrors from './locales/en/errors.json'
import enInvoiceGenerator from './locales/en/invoiceGenerator.json'
import enInvoiceImport from './locales/en/invoiceImport.json'
import enInvoices from './locales/en/invoices.json'
import enLanding from './locales/en/landing.json'
import enNavigation from './locales/en/navigation.json'
import enPricing from './locales/en/pricing.json'
import enSettings from './locales/en/settings.json'
import enSupport from './locales/en/support.json'

const resources = {
  nl: {
    auth: nlAuth,
    common: nlCommon,
    customers: nlCustomers,
    dashboard: nlDashboard,
    errors: nlErrors,
    invoiceGenerator: nlInvoiceGenerator,
    invoiceImport: nlInvoiceImport,
    invoices: nlInvoices,
    landing: nlLanding,
    navigation: nlNavigation,
    pricing: nlPricing,
    settings: nlSettings,
    support: nlSupport,
  },
  en: {
    auth: enAuth,
    common: enCommon,
    customers: enCustomers,
    dashboard: enDashboard,
    errors: enErrors,
    invoiceGenerator: enInvoiceGenerator,
    invoiceImport: enInvoiceImport,
    invoices: enInvoices,
    landing: enLanding,
    navigation: enNavigation,
    pricing: enPricing,
    settings: enSettings,
    support: enSupport,
  },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'nl',
    supportedLngs: ['nl', 'en'],
    detection: {
      order: ['querystring', 'localStorage', 'navigator', 'htmlTag'],
      lookupQuerystring: 'lang',
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
    defaultNS: 'common',
    ns: ['common', 'landing', 'dashboard', 'invoices', 'auth', 'errors', 'navigation', 'customers', 'invoiceGenerator', 'invoiceImport', 'pricing', 'settings', 'support'],
  })

export default i18n
