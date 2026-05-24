import { Smartphone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSiteSettings } from "../context/SiteSettingsContext";

const QR_URL =
  "https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://mahalo.ma&color=1a0208&bgcolor=ffffff&margin=4";

export default function MobileAppSection() {
  const settings = useSiteSettings();
  const { t } = useTranslation();

  if (settings.mobile_app_enabled === "0") return null;

  const title       = settings.mobile_app_title       || t("mobileApp.title");
  const subtitle    = settings.mobile_app_subtitle    || t("mobileApp.subtitle");
  const description = settings.mobile_app_description || t("mobileApp.description");
  const appstoreUrl = settings.mobile_app_appstore_url  || "#";
  const playstoreUrl= settings.mobile_app_playstore_url || "#";

  const BadgePill = () => (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 backdrop-blur-xl mb-6 self-start">
      <Smartphone size={13} className="text-[#BA1932]" />
      <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/70">
        {t("mobileApp.badge")}
      </span>
    </div>
  );

  const Heading = () => (
    <h2
      className="text-white font-extrabold leading-[0.95] tracking-[-0.04em]"
      style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
    >
      {title}
      <span
        className="block mt-2 bg-clip-text text-transparent"
        style={{
          backgroundImage:
            "linear-gradient(130deg, #BA1932 0%, #ff6b8a 55%, #d92d53 100%)",
        }}
      >
        {subtitle}
      </span>
    </h2>
  );

  const StoreButtons = () => (
    <div className="flex flex-col gap-3">
      <a
        href={playstoreUrl}
        target="_blank"
        rel="noreferrer"
        className="block transition-all duration-200 hover:scale-[1.03] hover:-translate-y-0.5"
      >
        <img
          src="/badge-playstore.png"
          alt={t("mobileApp.playStore")}
          className="h-[46px] w-auto object-contain"
        />
      </a>
      <a
        href={appstoreUrl}
        target="_blank"
        rel="noreferrer"
        className="block transition-all duration-200 hover:scale-[1.03] hover:-translate-y-0.5"
      >
        <img
          src="/badge-appstore.png"
          alt={t("mobileApp.appStore")}
          className="h-[46px] w-auto object-contain"
        />
      </a>
    </div>
  );

  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="max-w-[1700px] mx-auto">
        <div
          className="relative rounded-[32px] sm:rounded-[40px] overflow-hidden"
          style={{ background: "linear-gradient(135deg, #1c0309 0%, #090102 55%, #150207 100%)" }}
        >
          {/* ── Background glows (clipped by overflow-hidden on parent) ── */}
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(186,25,50,0.35) 0%, transparent 70%)",
                left: "-15%", top: "-40%", width: "70%", height: "180%",
                filter: "blur(60px)",
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(115,13,38,0.30) 0%, transparent 70%)",
                right: "-10%", bottom: "-30%", width: "55%", height: "100%",
                filter: "blur(80px)",
              }}
            />
          </div>

          {/* ════════════════════════════════════════
              DESKTOP LAYOUT  (lg and above)
              Left: text content | Right: phone
          ════════════════════════════════════════ */}
          <div className="hidden lg:grid lg:grid-cols-[1.15fr_1fr] relative z-10 min-h-[440px]">

            {/* ── Left: Content ── */}
            <div className="flex flex-col justify-center px-12 xl:px-16 py-14">
              <BadgePill />
              <Heading />
              <p className="mt-5 max-w-[480px] text-sm leading-relaxed text-white/50">
                {description}
              </p>
              <div className="mt-8 flex items-center gap-6">
                <StoreButtons />
                {/* QR code — desktop only */}
                <div className="flex flex-col items-center gap-2 rounded-2xl bg-white/95 p-3 shadow-2xl shrink-0">
                  <img
                    src={QR_URL}
                    alt="QR Code"
                    className="rounded-lg"
                    style={{ width: 80, height: 80, display: "block" }}
                  />
                  <span className="text-[8px] font-bold text-[#730D26] text-center leading-tight" style={{ maxWidth: 80 }}>
                    {t("mobileApp.scanQr")}
                  </span>
                </div>
              </div>
            </div>

            {/* ── Right: Phone mockup ── */}
            <div className="relative flex items-end justify-center overflow-hidden">
              {/* Inner glow behind phone */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "radial-gradient(circle at 50% 80%, rgba(186,25,50,0.25) 0%, transparent 65%)",
                }}
              />
              <img
                src="/app-mockup.png"
                alt="Mobile App"
                className="relative z-10 object-contain rotate-[-5deg] drop-shadow-[0_40px_100px_rgba(0,0,0,0.9)] transition-transform duration-700 hover:scale-[1.02] hover:rotate-[-2deg]"
                style={{ height: "108%", maxHeight: 720, width: "auto" }}
              />
            </div>
          </div>

          {/* ════════════════════════════════════════
              MOBILE LAYOUT  (below lg)
              Top: phone (contained) | Bottom: content
          ════════════════════════════════════════ */}
          <div className="lg:hidden relative z-10">

            {/* ── Phone — fully contained, no overflow ── */}
            <div className="relative flex justify-center items-end overflow-hidden" style={{ height: 260 }}>
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "radial-gradient(circle at 50% 90%, rgba(186,25,50,0.30) 0%, transparent 65%)",
                }}
              />
              <img
                src="/app-mockup.png"
                alt="Mobile App"
                className="relative z-10 object-contain rotate-[-4deg] drop-shadow-[0_20px_60px_rgba(0,0,0,0.85)]"
                style={{ height: "100%", width: "auto", maxWidth: "65%" }}
              />
            </div>

            {/* ── Content ── */}
            <div className="px-6 pb-8 pt-6 sm:px-8">
              <BadgePill />
              <Heading />
              <p className="mt-4 text-sm leading-relaxed text-white/50">
                {description}
              </p>
              <div className="mt-7 flex items-center gap-5 flex-wrap">
                <StoreButtons />
                {/* QR — mobile */}
                <div className="flex flex-col items-center gap-2 rounded-2xl bg-white/95 p-3 shadow-2xl shrink-0">
                  <img
                    src={QR_URL}
                    alt="QR Code"
                    className="rounded-lg"
                    style={{ width: 72, height: 72, display: "block" }}
                  />
                  <span className="text-[8px] font-bold text-[#730D26] text-center leading-tight" style={{ maxWidth: 72 }}>
                    {t("mobileApp.scanQr")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
