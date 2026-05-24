import { Smartphone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSiteSettings } from "../context/SiteSettingsContext";

const QR_URL =
  "https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://mahalo.ma&color=1a0208&bgcolor=ffffff&margin=4";

export default function MobileAppSection() {
  const settings = useSiteSettings();
  const { t } = useTranslation();

  if (settings.mobile_app_enabled === "0") return null;

  const title = settings.mobile_app_title || t("mobileApp.title");
  const subtitle = settings.mobile_app_subtitle || t("mobileApp.subtitle");
  const description =
    settings.mobile_app_description || t("mobileApp.description");
  const appstoreUrl = settings.mobile_app_appstore_url || "#";
  const playstoreUrl = settings.mobile_app_playstore_url || "#";

  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="max-w-[1700px] mx-auto">
        <div
          className="relative overflow-hidden rounded-[40px] border border-white/10"
          style={{
            background:
              "linear-gradient(115deg, #160108 0%, #090003 40%, #1a0208 100%)",
          }}
        >
          {/* Background glows */}
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute rounded-full blur-[140px] bg-[#BA1932]/25"
              style={{ left: -180, top: -60, width: 720, height: 720 }}
            />
            <div
              className="absolute rounded-full blur-[120px] bg-[#730D26]/40"
              style={{ left: "10%", bottom: -250, width: 600, height: 600 }}
            />
            <div
              className="absolute rounded-full blur-[120px] bg-[#BA1932]/10"
              style={{ right: -100, top: "10%", width: 420, height: 420 }}
            />
          </div>

          {/* Grid: phone LEFT · content RIGHT */}
          <div className="relative z-10 grid lg:grid-cols-[1fr_1.1fr] min-h-[380px] lg:min-h-[440px]">
            {/* LEFT: Phone — desktop only */}
            <div className="hidden lg:block relative overflow-hidden">
              {/* Glow behind phone */}
              <div
                className="absolute rounded-full blur-[120px] bg-[#BA1932]/35"
                style={{ left: -60, bottom: -80, width: 560, height: 560 }}
              />

              {/* Phone — taller (130%), no QR card */}
              <img
                src="/app-mockup.png"
                alt="Mobile App"
                className="absolute bottom-[-30px] left-[4%] z-10 object-contain rotate-[-6deg] drop-shadow-[0_40px_120px_rgba(0,0,0,0.85)] transition-transform duration-700 hover:scale-[1.02] hover:rotate-[-3deg]"
                style={{ height: "110%", maxHeight: 760, width: "auto" }}
              />
            </div>

            {/* LEFT: Phone — mobile only */}
            <div className="relative flex lg:hidden justify-center pt-10 pb-2">
              <div
                className="absolute rounded-full blur-[80px] bg-[#BA1932]/20"
                style={{ width: 320, height: 320 }}
              />
              <img
                src="/app-mockup.png"
                alt="Mobile App"
                className="relative z-10 w-[240px] object-contain rotate-[-5deg] drop-shadow-[0_30px_80px_rgba(0,0,0,0.8)]"
              />
            </div>

            {/* RIGHT: Content */}
            <div className="relative z-20 flex flex-col justify-center px-6 pb-10 pt-8 sm:px-10 lg:pl-4 lg:pr-16 xl:pr-24">
              {/* Badge pill */}
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 backdrop-blur-xl mb-6 self-start">
                <Smartphone size={13} className="text-[#BA1932]" />
                <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/70">
                  {t("mobileApp.badge")}
                </span>
              </div>

              {/* Heading */}
              <h2
                className="text-white font-extrabold leading-[0.95] tracking-[-0.04em]"
                style={{ fontSize: "clamp(2rem, 4vw, 3.6rem)" }}
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

              {/* Description */}
              <p className="mt-5 max-w-[480px] text-sm leading-relaxed text-white/50">
                {description}
              </p>

              {/* CTA: QR (mobile only) + store badges */}
              <div className="mt-8 flex flex-wrap items-center gap-5">
                {/* QR — mobile only */}
                <div className="flex lg:hidden flex-col items-center gap-2 rounded-2xl bg-white p-3 shadow-2xl shrink-0">
                  <img
                    src={QR_URL}
                    alt="QR Code"
                    className="rounded-lg"
                    style={{ width: 88, height: 88, display: "block" }}
                  />
                  <span
                    className="text-[9px] font-bold text-[#730D26] text-center leading-tight"
                    style={{ maxWidth: 88 }}
                  >
                    {t("mobileApp.scanQr")}
                  </span>
                </div>

                {/* Store badges */}
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
                      className="h-[48px] w-auto object-contain"
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
                      className="h-[48px] w-auto object-contain"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
