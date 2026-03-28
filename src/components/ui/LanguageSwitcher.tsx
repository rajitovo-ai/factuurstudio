import { useTranslation } from 'react-i18next'

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation('common')

  const toggleLanguage = () => {
    const newLang = i18n.language === 'nl' ? 'en' : 'nl'
    void i18n.changeLanguage(newLang)
  }

  const displayLang = i18n.language === 'nl' ? 'NL' : 'EN'

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-600 transition-all hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-600"
      aria-label={t('language')}
    >
      <span className="text-[10px] leading-none opacity-80">{i18n.language === 'nl' ? '🇳🇱' : '🇬🇧'}</span>
      <span className="text-xs font-semibold tracking-wide">{displayLang}</span>
    </button>
  )
}
