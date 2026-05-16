import { useState, useMemo } from 'react'
import { Calculator, ChevronDown, ChevronUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'

function formatMAD(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M MAD`
  if (n >= 1_000)     return `${Math.round(n).toLocaleString()} MAD`
  return `${Math.round(n)} MAD`
}

export default function MortgageCalculator({ price = 0 }) {
  const { t } = useTranslation()
  const [open, setOpen]   = useState(false)
  const [down, setDown]   = useState(20)
  const [rate, setRate]   = useState(4.5)
  const [years, setYears] = useState(20)

  const { monthly, total, interest, loan } = useMemo(() => {
    const p = price * (1 - down / 100)
    const r = rate / 100 / 12
    const n = years * 12
    if (!p || !r || !n) return { monthly: 0, total: 0, interest: 0, loan: p }
    const m = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    const t = m * n
    return { monthly: m, total: t, interest: t - p, loan: p }
  }, [price, down, rate, years])

  return (
    <div className="bg-white rounded-3xl shadow-card overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-5 hover:bg-gray-50/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gold/10 flex items-center justify-center">
            <Calculator size={17} className="text-gold" />
          </div>
          <div className="text-left">
            <p className="text-navy font-bold text-sm">{t('mortgage.title')}</p>
            {!open && monthly > 0 && (
              <p className="text-navy/40 text-xs mt-0.5">≈ {formatMAD(monthly)}{t('mortgage.perMonth')}</p>
            )}
          </div>
        </div>
        {open ? <ChevronUp size={16} className="text-navy/30" /> : <ChevronDown size={16} className="text-navy/30" />}
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-4 border-t border-gray-100">
          {/* Down payment */}
          <div className="pt-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{t('mortgage.downPayment')}</label>
              <span className="text-navy font-bold text-sm">{down}%</span>
            </div>
            <input
              type="range" min={5} max={60} step={5} value={down}
              onChange={e => setDown(+e.target.value)}
              className="w-full accent-[#BA1932] h-1.5 rounded-full cursor-pointer"
            />
            <div className="flex justify-between text-xs text-navy/30 mt-1">
              <span>5%</span><span>60%</span>
            </div>
          </div>

          {/* Interest rate */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{t('mortgage.interestRate')}</label>
              <span className="text-navy font-bold text-sm">{rate}%</span>
            </div>
            <input
              type="range" min={1} max={12} step={0.5} value={rate}
              onChange={e => setRate(+e.target.value)}
              className="w-full accent-[#BA1932] h-1.5 rounded-full cursor-pointer"
            />
            <div className="flex justify-between text-xs text-navy/30 mt-1">
              <span>1%</span><span>12%</span>
            </div>
          </div>

          {/* Loan term */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{t('mortgage.loanTerm')}</label>
              <span className="text-navy font-bold text-sm">{years} {t('mortgage.yrs')}</span>
            </div>
            <input
              type="range" min={5} max={30} step={5} value={years}
              onChange={e => setYears(+e.target.value)}
              className="w-full accent-[#BA1932] h-1.5 rounded-full cursor-pointer"
            />
            <div className="flex justify-between text-xs text-navy/30 mt-1">
              <span>5 {t('mortgage.yrs')}</span><span>30 {t('mortgage.yrs')}</span>
            </div>
          </div>

          {/* Results */}
          <div className="bg-navy rounded-2xl p-4 space-y-3 mt-2">
            <div className="text-center pb-3 border-b border-white/10">
              <p className="text-white/50 text-xs mb-1">{t('mortgage.monthlyPayment')}</p>
              <p className="text-gold font-bold text-2xl">{formatMAD(monthly)}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div>
                <p className="text-white/40 text-[10px] uppercase tracking-wide mb-0.5">{t('mortgage.loanAmount')}</p>
                <p className="text-white font-semibold text-xs">{formatMAD(loan)}</p>
              </div>
              <div>
                <p className="text-white/40 text-[10px] uppercase tracking-wide mb-0.5">{t('mortgage.totalInterest')}</p>
                <p className="text-white font-semibold text-xs">{formatMAD(interest)}</p>
              </div>
            </div>
            <div className="text-center pt-1">
              <p className="text-white/30 text-[10px]">{t('mortgage.totalRepayment')}: {formatMAD(total)}</p>
            </div>
          </div>
          <p className="text-navy/30 text-[10px] text-center leading-relaxed">
            {t('mortgage.disclaimer')}
          </p>
        </div>
      )}
    </div>
  )
}
