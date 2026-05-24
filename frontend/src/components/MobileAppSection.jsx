import { Smartphone } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSiteSettings } from '../context/SiteSettingsContext'

const QR_URL =
  'https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://mahalo.ma&color=1a0208&bgcolor=ffffff&margin=4'

export default function MobileAppSection() {
  const settings = useSiteSettings()
  const { t } = useTranslation()

  if (settings.mobile_app_enabled === '0') return null

  const title       = settings.mobile_app_title       || t('mobileApp.title')
  const subtitle    = settings.mobile_app_subtitle    || t('mobileApp.subtitle')
  const description = settings.mobile_app_description || t('mobileApp.description')
  const appstoreUrl  = settings.mobile_app_appstore_url  || '#'
  const playstoreUrl = settings.mobile_app_playstore_url || '#'

  return (
    <section className="px-4 xs:px-5 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto">

        {/* Card */}
        <div
          className="relative rounded-3xl overflow-hidden"
          style={{
            background:
              'linear-gradient(120deg, #070003 0%, #130108 20%, #1e020c 48%, #2c0413 74%, #1a0208 100%)',
          }}
        >

          {/* ── Atmospheric glow orbs ── */}
          <div className="absolute inset-0 pointer-events-none">
            <div style={{ position:'absolute', top:'-40%', left:'-6%', width:'50%', height:'200%', background:'radial-gradient(ellipse, rgba(186,25,50,0.48) 0%, transparent 55%)', filter:'blur(72px)' }} />
            <div style={{ position:'absolute', top:'10%', left:'22%', width:'50%', height:'120%', background:'radial-gradient(ellipse, rgba(115,13,38,0.32) 0%, transparent 58%)', filter:'blur(56px)' }} />
            <div style={{ position:'absolute', top:'-20%', right:'-4%', width:'40%', height:'140%', background:'radial-gradient(ellipse, rgba(186,25,50,0.24) 0%, transparent 60%)', filter:'blur(52px)' }} />
            <div style={{ position:'absolute', top:0, left:0, right:0, height:'1px', background:'linear-gradient(90deg, transparent, rgba(255,255,255,0.18) 50%, transparent)' }} />
            <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'45%', background:'linear-gradient(to top, rgba(7,0,3,0.70), transparent)' }} />
          </div>

          {/* ── Layout: phone LEFT · content RIGHT ── */}
          <div className="relative z-10 flex flex-col sm:flex-row">

            {/* ───── Phone mockup ───── */}

            {/* MOBILE: full-width zone, phone centered */}
            <div className="sm:hidden flex items-end justify-center pt-8" style={{ height: 230 }}>
              <div className="relative flex items-end justify-center h-full">
                <div className="absolute inset-0" style={{ background:'radial-gradient(ellipse at 50% 80%, rgba(186,25,50,0.45) 0%, transparent 60%)', filter:'blur(36px)' }} />
                <img
                  src="/app-mockup.png"
                  alt={t('mobileApp.badge')}
                  style={{
                    height: 210,
                    width: 'auto',
                    objectFit: 'contain',
                    objectPosition: 'bottom',
                    filter: 'drop-shadow(0 20px 40px rgba(115,13,38,0.80)) drop-shadow(0 6px 16px rgba(0,0,0,0.60))',
                    transform: 'rotate(4deg)',
                    transformOrigin: 'bottom center',
                    position: 'relative',
                    zIndex: 1,
                  }}
                />
              </div>
            </div>

            {/* DESKTOP: 38% width, phone overflows top of card */}
            <div
              className="hidden sm:flex items-end justify-center shrink-0"
              style={{ width: '38%', minHeight: 280, position: 'relative', overflow: 'visible' }}
            >
              <div className="absolute inset-0" style={{ background:'radial-gradient(ellipse at 60% 80%, rgba(186,25,50,0.42) 0%, transparent 58%)', filter:'blur(48px)', zIndex:0 }} />
              <img
                src="/app-mockup.png"
                alt={t('mobileApp.badge')}
                style={{
                  height: '125%',
                  maxHeight: 440,
                  width: 'auto',
                  objectFit: 'contain',
                  objectPosition: 'bottom',
                  filter: 'drop-shadow(0 28px 56px rgba(115,13,38,0.80)) drop-shadow(0 8px 20px rgba(0,0,0,0.65))',
                  transform: 'rotate(4deg)',
                  transformOrigin: 'bottom center',
                  position: 'relative',
                  zIndex: 1,
                  marginBottom: 0,
                }}
              />
            </div>

            {/* ───── Content ───── */}
            <div className="flex-1 flex flex-col justify-center px-6 pb-10 pt-4 sm:px-10 sm:py-14">

              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 mb-5 self-start"
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.14)',
                  borderRadius: '999px',
                  padding: '6px 16px',
                  backdropFilter: 'blur(14px)',
                }}
              >
                <Smartphone size={11} color="#BA1932" />
                <span style={{ color:'rgba(255,255,255,0.60)', fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.13em' }}>
                  {t('mobileApp.badge')}
                </span>
              </div>

              {/* Heading */}
              <h2
                className="font-extrabold text-white leading-tight mb-3 sm:mb-4"
                style={{
                  fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
                  fontSize: 'clamp(1.7rem, 4vw, 2.8rem)',
                  letterSpacing: '-0.02em',
                }}
              >
                {title}
                <br />
                <span
                  style={{
                    WebkitTextFillColor: 'transparent',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    backgroundImage: 'linear-gradient(130deg, #BA1932 0%, #f07088 55%, #c0243e 100%)',
                  }}
                >
                  {subtitle}
                </span>
              </h2>

              {/* Description */}
              <p className="text-white/40 text-sm leading-relaxed mb-7 max-w-sm">
                {description}
              </p>

              {/* QR code + store badges row */}
              <div className="flex flex-wrap items-start gap-4 sm:gap-5">

                {/* QR code white box */}
                <div
                  className="flex flex-col items-center gap-1.5 shrink-0"
                  style={{
                    background: 'white',
                    borderRadius: 14,
                    padding: '10px 10px 8px',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
                  }}
                >
                  <img
                    src={QR_URL}
                    alt="QR Code"
                    width={90}
                    height={90}
                    style={{ display: 'block', borderRadius: 6 }}
                    loading="lazy"
                  />
                  <span style={{ fontSize: 8, fontWeight: 700, color: '#730D26', textAlign: 'center', lineHeight: 1.3, maxWidth: 90 }}>
                    {t('mobileApp.scanQr')}
                  </span>
                </div>

                {/* Google Play + App Store stacked */}
                <div className="flex flex-col gap-2.5 justify-center">
                  <a
                    href={playstoreUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-xl overflow-hidden transition-transform hover:-translate-y-0.5 active:scale-95"
                  >
                    <img
                      src="/badge-playstore.png"
                      alt={t('mobileApp.playStore')}
                      className="h-10 sm:h-11 w-auto"
                    />
                  </a>
                  <a
                    href={appstoreUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-xl overflow-hidden transition-transform hover:-translate-y-0.5 active:scale-95"
                  >
                    <img
                      src="/badge-appstore.png"
                      alt={t('mobileApp.appStore')}
                      className="h-10 sm:h-11 w-auto"
                    />
                  </a>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
