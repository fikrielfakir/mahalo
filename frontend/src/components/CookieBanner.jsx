import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
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
  const [visible, setVisible]   = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [prefs, setPrefs]       = useState({ analytics: true, marketing: false })
  const [mounted, setMounted]   = useState(false)

  const enabled    = settings?.cookie_consent_enabled !== '0'
  const title      = settings?.cookie_consent_title   || t('cookies.title')
  const message    = settings?.cookie_consent_message || t('cookies.message')
  const acceptTxt  = settings?.cookie_accept_text     || t('cookies.acceptAll')
  const declineTxt = settings?.cookie_decline_text    || t('cookies.decline')
  const policyUrl  = settings?.cookie_policy_url      || '/privacy'

  useEffect(() => {
    setMounted(true)
    if (!enabled) return
    const consent = readConsent()
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 800)
      return () => clearTimeout(timer)
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

  return createPortal(
    <>
      <div className="fixed bottom-0 left-0 right-0 z-[999] p-2 md:p-4 md:left-auto md:right-4 md:bottom-4 md:max-w-sm animate-slide-up">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">

          {/* Header — compact */}
          <div className="bg-gradient-to-r from-[#730D26] to-[#BA1932] px-3 py-2.5 flex items-center gap-2">
            <Cookie size={14} className="text-white shrink-0" />
            <h3 className="text-white font-bold text-sm flex-1 leading-none">{title}</h3>
            <button onClick={handleDecline} className="text-white/60 hover:text-white transition-colors -mr-0.5">
              <X size={14} />
            </button>
          </div>

          {/* Body */}
          <div className="px-3 py-3">
            <p className="text-gray-500 text-xs leading-relaxed mb-2.5">{message}</p>

            {/* Essential always-on row */}
            <div className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2 mb-2">
              <div className="flex items-center gap-2">
                <Shield size={13} className="text-emerald-600 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-gray-800 leading-none mb-0.5">{t('cookies.essential')}</p>
                  <p className="text-[10px] text-gray-400">{t('cookies.essentialDesc')}</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full whitespace-nowrap">{t('cookies.alwaysOn')}</span>
            </div>

            {expanded && (
              <div className="space-y-1.5 mb-2">
                {/* Analytics */}
                <div className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2">
                  <div className="flex items-center gap-2">
                    <BarChart2 size={13} className="text-blue-500 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-gray-800 leading-none mb-0.5">{t('cookies.analytics')}</p>
                      <p className="text-[10px] text-gray-400">{t('cookies.analyticsDesc')}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setPrefs(p => ({ ...p, analytics: !p.analytics }))}
                    className={`relative w-8 h-4 rounded-full transition-colors shrink-0 ${prefs.analytics ? 'bg-[#730D26]' : 'bg-gray-200'}`}
                  >
                    <span className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-all ${prefs.analytics ? 'left-[18px]' : 'left-0.5'}`} />
                  </button>
                </div>

                {/* Marketing */}
                <div className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Settings size={13} className="text-purple-500 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-gray-800 leading-none mb-0.5">{t('cookies.marketing')}</p>
                      <p className="text-[10px] text-gray-400">{t('cookies.marketingDesc')}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setPrefs(p => ({ ...p, marketing: !p.marketing }))}
                    className={`relative w-8 h-4 rounded-full transition-colors shrink-0 ${prefs.marketing ? 'bg-[#730D26]' : 'bg-gray-200'}`}
                  >
                    <span className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-all ${prefs.marketing ? 'left-[18px]' : 'left-0.5'}`} />
                  </button>
                </div>
              </div>
            )}

            {/* Manage prefs toggle */}
            <button
              onClick={() => setExpanded(e => !e)}
              className="text-[11px] text-[#730D26] font-semibold flex items-center gap-1 mb-2.5 hover:underline"
            >
              {expanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
              {expanded ? t('cookies.hidePreferences') : t('cookies.managePreferences')}
            </button>

            {/* Action buttons */}
            <div className="flex gap-2 mb-2">
              <button
                onClick={handleDecline}
                className="flex-1 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                {declineTxt}
              </button>
              <button
                onClick={expanded ? handleSavePrefs : handleAcceptAll}
                className="flex-1 py-1.5 rounded-xl bg-[#730D26] text-white text-xs font-semibold hover:bg-[#BA1932] transition-colors"
              >
                {expanded ? t('cookies.savePreferences') : acceptTxt}
              </button>
            </div>

            <p className="text-center text-[10px] text-gray-400">
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
        .animate-slide-up { animation: slide-up 0.35s cubic-bezier(.16,1,.3,1) both; }
      `}</style>
    </>,
    document.body
  )
}
