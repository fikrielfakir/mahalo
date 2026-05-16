import { useState, useEffect } from 'react'
import { Cookie, X, ChevronDown, ChevronUp, Shield, BarChart2, Settings } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const STORAGE_KEY = 'mahalo_cookie_consent'

function readConsent() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) } catch { return null }
}

function writeConsent(val) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(val)) } catch {}
}

export default function CookieBanner({ settings }) {
  const { t } = useTranslation()
  const [visible, setVisible]     = useState(false)
  const [expanded, setExpanded]   = useState(false)
  const [prefs, setPrefs]         = useState({ analytics: true, marketing: false })
  const [mounted, setMounted]     = useState(false)

  const enabled  = settings?.cookie_consent_enabled !== '0'
  const title    = settings?.cookie_consent_title    || t('cookies.title')
  const message  = settings?.cookie_consent_message  || t('cookies.message')
  const acceptTxt = settings?.cookie_accept_text     || t('cookies.acceptAll')
  const declineTxt = settings?.cookie_decline_text   || t('cookies.decline')
  const policyUrl = settings?.cookie_policy_url      || '/privacy'

  useEffect(() => {
    setMounted(true)
    if (!enabled) return
    const consent = readConsent()
    if (!consent) {
      // Slight delay so it doesn't flash on load
      const t = setTimeout(() => setVisible(true), 800)
      return () => clearTimeout(t)
    }
  }, [enabled])

  if (!mounted || !enabled || !visible) return null

  const handleAcceptAll = () => {
    writeConsent({ accepted: true, analytics: true, marketing: true, timestamp: Date.now() })
    setVisible(false)
  }

  const handleDecline = () => {
    writeConsent({ accepted: false, analytics: false, marketing: false, timestamp: Date.now() })
    setVisible(false)
  }

  const handleSavePrefs = () => {
    writeConsent({ accepted: true, ...prefs, timestamp: Date.now() })
    setVisible(false)
  }

  return (
    <>
      {/* Backdrop blur on mobile */}
      <div className="fixed inset-0 z-[998] bg-black/10 backdrop-blur-[1px] md:hidden pointer-events-none" />

      <div className="fixed bottom-0 left-0 right-0 z-[999] p-3 md:p-6 md:left-auto md:right-6 md:bottom-6 md:max-w-md animate-slide-up">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#730D26] to-[#BA1932] px-5 py-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
              <Cookie size={18} className="text-white" />
            </div>
            <h3 className="text-white font-bold text-base flex-1">{title}</h3>
            <button
              onClick={handleDecline}
              className="text-white/60 hover:text-white transition-colors"
              aria-label="Dismiss"
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="p-5">
            <p className="text-gray-600 text-sm leading-relaxed mb-4">{message}</p>

            {/* Cookie types */}
            <div className="space-y-2 mb-4">
              {/* Essential — always on */}
              <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <Shield size={15} className="text-emerald-600 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{t('cookies.essential')}</p>
                    <p className="text-xs text-gray-400">{t('cookies.essentialDesc')}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{t('cookies.alwaysOn')}</span>
              </div>

              {expanded && (
                <>
                  {/* Analytics */}
                  <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <BarChart2 size={15} className="text-blue-500 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{t('cookies.analytics')}</p>
                        <p className="text-xs text-gray-400">{t('cookies.analyticsDesc')}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setPrefs(p => ({ ...p, analytics: !p.analytics }))}
                      className={`relative w-10 h-5 rounded-full transition-colors ${prefs.analytics ? 'bg-[#730D26]' : 'bg-gray-200'}`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${prefs.analytics ? 'left-5.5 left-[22px]' : 'left-0.5'}`} />
                    </button>
                  </div>

                  {/* Marketing */}
                  <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Settings size={15} className="text-purple-500 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{t('cookies.marketing')}</p>
                        <p className="text-xs text-gray-400">{t('cookies.marketingDesc')}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setPrefs(p => ({ ...p, marketing: !p.marketing }))}
                      className={`relative w-10 h-5 rounded-full transition-colors ${prefs.marketing ? 'bg-[#730D26]' : 'bg-gray-200'}`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${prefs.marketing ? 'left-[22px]' : 'left-0.5'}`} />
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Manage preferences toggle */}
            <button
              onClick={() => setExpanded(e => !e)}
              className="text-xs text-[#730D26] font-semibold flex items-center gap-1 mb-4 hover:underline"
            >
              {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              {expanded ? t('cookies.hidePreferences') : t('cookies.managePreferences')}
            </button>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={handleDecline}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                {declineTxt}
              </button>
              {expanded ? (
                <button
                  onClick={handleSavePrefs}
                  className="flex-1 py-2.5 rounded-xl bg-[#730D26] text-white text-sm font-semibold hover:bg-[#BA1932] transition-colors"
                >
                  {t('cookies.savePreferences')}
                </button>
              ) : (
                <button
                  onClick={handleAcceptAll}
                  className="flex-1 py-2.5 rounded-xl bg-[#730D26] text-white text-sm font-semibold hover:bg-[#BA1932] transition-colors"
                >
                  {acceptTxt}
                </button>
              )}
            </div>

            <p className="text-center text-xs text-gray-400 mt-3">
              <a href={policyUrl} className="text-[#730D26] hover:underline">{t('cookies.policyLink')}</a>
              {' · '}
              <a href="/privacy" className="text-[#730D26] hover:underline">{t('cookies.privacyLink')}</a>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        .animate-slide-up { animation: slide-up 0.4s cubic-bezier(.16,1,.3,1) both; }
      `}</style>
    </>
  )
}
