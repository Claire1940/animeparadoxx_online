"use client";

import { useState, Suspense, lazy } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronDown,
  Clock,
  Copy,
  Dna,
  ExternalLink,
  FlaskConical,
  GraduationCap,
  Map,
  MessageCircle,
  Sparkles,
  Ticket,
  Trophy,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading placeholder
const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`}
  />
);

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  locale: string;
}

const TIER_STYLES: Record<string, string> = {
  "S+":
    "from-yellow-400/20 to-amber-500/10 border-yellow-500/40 text-yellow-300",
  S: "from-purple-400/20 to-fuchsia-500/10 border-purple-500/40 text-purple-300",
  A: "from-blue-400/20 to-cyan-500/10 border-blue-500/40 text-blue-300",
  B: "from-slate-400/20 to-gray-500/10 border-slate-500/40 text-slate-300",
  Roles:
    "from-emerald-400/20 to-green-500/10 border-emerald-500/40 text-emerald-300",
};

export default function HomePageClient({
  latestArticles,
  locale,
}: HomePageClientProps) {
  const t = useMessages() as any;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://animeparadoxx.online";

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Anime Paradox X Wiki",
        description:
          "Anime Paradox X Wiki with working codes, unit tier lists, traits, evolutions, farming routes, game modes, team builds, and beginner progression tips.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Anime Paradox X - 360° Smart-AI Anime Tower Defense",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Anime Paradox X Wiki",
        alternateName: "Anime Paradox X",
        url: siteUrl,
        description:
          "Complete Anime Paradox X Wiki resource hub for codes, unit tier lists, traits, evolutions, game modes, and team progression guides",
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Anime Paradox X Wiki - 360° Smart-AI Anime Tower Defense",
        },
        sameAs: [
          "https://www.roblox.com/games/76806550943352/Anime-Paradox-X",
          "https://discord.com/invite/animeparadox",
          "https://x.com/LunmeiGames",
          "https://www.youtube.com/channel/UCY_PQX3oVp4lSP7vXeUr4Iw",
        ],
      },
      {
        "@type": "VideoGame",
        name: "Anime Paradox X",
        gamePlatform: ["Web Browser", "Roblox"],
        applicationCategory: "Game",
        genre: ["Tower Defense", "Anime", "Strategy", "Gacha"],
        numberOfPlayers: {
          minValue: 1,
          maxValue: 8,
        },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: "https://www.roblox.com/games/76806550943352/Anime-Paradox-X",
        },
      },
      {
        "@type": "VideoObject",
        name: "ANIME PARADOX | RELEASE TRAILER",
        description:
          "Official Anime Paradox X release trailer showcasing fast-paced combat, summonable units, cinematic abilities, and 360-degree smart-AI tower defense gameplay.",
        thumbnailUrl: `${siteUrl}/images/hero.webp`,
        embedUrl: "https://www.youtube.com/embed/WLZPwvk7kHY",
        url: "https://www.youtube.com/watch?v=WLZPwvk7kHY",
      },
    ],
  };

  // Module interaction states
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showExpired, setShowExpired] = useState(false);
  const [modeExpanded, setModeExpanded] = useState<number | null>(0);
  const mobileBannerAd = getPreferredMobileBannerSelection();

  const handleCopyCode = (code: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code).catch(() => {});
    }
    setCopiedCode(code);
    window.setTimeout(
      () => setCopiedCode((cur) => (cur === code ? null : cur)),
      1500,
    );
  };

  const M = t.modules;
  const codes = M.animeParadoxCodes;
  const beginner = M.animeParadoxBeginnerGuide;
  const tierList = M.animeParadoxUnitTierList;
  const bestTeams = M.animeParadoxBestTeams;
  const traits = M.animeParadoxTraitsStatRerolls;
  const evolution = M.animeParadoxEvolutionEtherealization;
  const gameModes = M.animeParadoxGameModesFarming;
  const updates = M.animeParadoxUpdatesPatchNotes;

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 广告位 1: 顶部固定横幅 */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-4 md:mb-6"
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">
                {t.hero.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-[1.05]">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <button
                onClick={() => scrollToSection("codes")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-base md:text-lg transition-colors"
              >
                <Ticket className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href="https://www.roblox.com/games/76806550943352/Anime-Paradox-X"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-base md:text-lg transition-colors"
              >
                {t.hero.playOnRobloxCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* Video Section - 紧跟 Hero 区域之后 */}
      <section className="px-4 py-10 md:py-12">
        <div className="scroll-reveal container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature
              videoId="WLZPwvk7kHY"
              title="ANIME PARADOX | RELEASE TRAILER"
            />
          </div>
        </div>
      </section>

      {/* Tools Grid - 8 Navigation Cards */}
      <section className="px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {t.tools.cards.map((card: any, index: number) => {
              const sectionIds = [
                "codes",
                "beginner-guide",
                "unit-tier-list",
                "best-teams",
                "traits-stat-rerolls",
                "evolution-etherealization",
                "game-modes-farming",
                "updates-patch-notes",
              ];
              const sectionId = sectionIds[index];

              return (
                <button
                  key={index}
                  onClick={() => scrollToSection(sectionId)}
                  className="scroll-reveal group rounded-xl border border-border p-4 md:p-6
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12
                                  bg-[hsl(var(--nav-theme)/0.1)]
                                  flex items-center justify-center
                                  group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                  transition-colors"
                  >
                    <DynamicIcon
                      name={card.icon}
                      className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="mb-1.5 text-sm md:text-base font-semibold leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 广告位 2: 首屏内容之后再加载广告 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      {/* 广告位 3: 移动端优先使用方形，桌面端保留横幅 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Latest Updates Section */}
      <LatestGuidesAccordion
        articles={latestArticles}
        locale={locale}
        max={12}
      />

      {/* Module 1: Codes */}
      <section id="codes" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-3 md:mb-4">
              <Ticket className="w-7 h-7 md:w-8 md:h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl md:text-5xl font-bold">{codes.title}</h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {codes.intro}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Verified: {codes.verifiedDate}
            </p>
          </div>

          {/* Working Codes */}
          <div className="scroll-reveal mb-8 md:mb-10">
            <h3 className="flex items-center gap-2 text-lg md:text-2xl font-bold mb-4">
              <Check className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              {codes.workingLabel}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {codes.workingCodes.map((c: any, i: number) => (
                <div
                  key={i}
                  className="p-4 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <code className="font-mono font-bold text-[hsl(var(--nav-theme-light))] break-all">
                      {c.code}
                    </code>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(c.code)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-xs font-medium hover:bg-[hsl(var(--nav-theme)/0.2)] transition-colors whitespace-nowrap"
                    >
                      {copiedCode === c.code ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> {codes.copyLabel}
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground">{c.rewards}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Expired Codes (collapsible) */}
          <div className="scroll-reveal mb-8 md:mb-10">
            <button
              type="button"
              onClick={() => setShowExpired((v) => !v)}
              className="w-full flex items-center justify-between p-4 bg-white/5 border border-border rounded-xl hover:bg-white/10 transition-colors"
            >
              <span className="font-bold text-base md:text-lg">
                {codes.expiredLabel} ({codes.expiredCodes.length})
              </span>
              <ChevronDown
                className={`w-5 h-5 transition-transform ${showExpired ? "rotate-180" : ""}`}
              />
            </button>
            {showExpired && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                {codes.expiredCodes.map((c: any, i: number) => (
                  <div
                    key={i}
                    className="p-3 bg-white/[0.02] border border-border rounded-lg opacity-70"
                  >
                    <code className="font-mono text-sm font-semibold">{c.code}</code>
                    <p className="text-xs text-muted-foreground mt-1">{c.rewards}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Redeem Steps */}
          <div className="scroll-reveal p-4 md:p-6 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl mb-6 md:mb-8">
            <h3 className="font-bold text-base md:text-lg mb-4">{codes.redeemLabel}</h3>
            <ol className="space-y-3">
              {codes.redeemSteps.map((s: string, i: number) => (
                <li key={i} className="flex gap-3">
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[hsl(var(--nav-theme)/0.2)] border border-[hsl(var(--nav-theme)/0.5)] text-sm font-bold text-[hsl(var(--nav-theme-light))]">
                    {i + 1}
                  </span>
                  <span className="text-sm md:text-base text-muted-foreground pt-0.5">
                    {s}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* Troubleshooting */}
          <div className="scroll-reveal p-4 md:p-6 bg-white/5 border border-border rounded-xl">
            <h3 className="flex items-center gap-2 font-bold text-base md:text-lg mb-4">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              {codes.troubleLabel}
            </h3>
            <ul className="space-y-2">
              {codes.troubleshooting.map((s: string, i: number) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[hsl(var(--nav-theme-light))] mt-1">•</span>
                  <span className="text-sm text-muted-foreground">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 广告位 4: 模块之间的阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 2: Beginner Guide */}
      <section
        id="beginner-guide"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-3 md:mb-4">
              <GraduationCap className="w-7 h-7 md:w-8 md:h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl md:text-5xl font-bold">{beginner.title}</h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {beginner.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-3 md:space-y-4 mb-8 md:mb-10">
            {beginner.steps.map((step: any, index: number) => (
              <div
                key={index}
                className="flex gap-3 md:gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                  <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                    {index + 1}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm md:text-base text-[hsl(var(--nav-theme-light))] font-medium mb-2">
                    {step.goal}
                  </p>
                  <ul className="space-y-1.5 mb-3">
                    {step.actions.map((a: string, ai: number) => (
                      <li key={ai} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{a}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="flex items-start gap-2 text-sm text-yellow-400/90">
                    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{step.avoid}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="scroll-reveal p-4 md:p-6 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <Check className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              <h3 className="font-bold text-base md:text-lg">{beginner.checklistLabel}</h3>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {beginner.checklist.map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Module 3: Unit Tier List */}
      <section id="unit-tier-list" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-3 md:mb-4">
              <Trophy className="w-7 h-7 md:w-8 md:h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl md:text-5xl font-bold">{tierList.title}</h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {tierList.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-6 md:space-y-8">
            {tierList.tiers.map((tier: any, ti: number) => (
              <div key={ti}>
                <div className="flex items-center gap-3 mb-3 md:mb-4">
                  <span
                    className={`inline-flex items-center justify-center min-w-[3rem] px-3 py-1.5 rounded-lg border bg-gradient-to-r font-bold text-base md:text-lg ${TIER_STYLES[tier.tier] || "border-border text-foreground"}`}
                  >
                    {tier.tier}
                  </span>
                  <span className="text-sm md:text-base text-muted-foreground">
                    {tier.label}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {tier.units.map((u: any, ui: number) => (
                    <div
                      key={ui}
                      className="p-4 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-bold text-sm md:text-base">{u.name}</h3>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] whitespace-nowrap">
                          {u.rarity}
                        </span>
                      </div>
                      <p className="text-xs text-[hsl(var(--nav-theme-light))] font-medium mb-2">
                        {u.role}
                      </p>
                      <dl className="space-y-1.5 text-xs md:text-sm">
                        <div>
                          <dt className="text-muted-foreground/70 inline">{traits.bestForLabel}: </dt>
                          <dd className="text-muted-foreground inline">{u.bestUse}</dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground/70 inline">Trait: </dt>
                          <dd className="text-muted-foreground inline">{u.recommendedTrait}</dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground/70 inline">Priority: </dt>
                          <dd className="text-muted-foreground inline">{u.evolutionPriority}</dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground/70 inline">Acquisition: </dt>
                          <dd className="text-muted-foreground inline">{u.acquisition}</dd>
                        </div>
                      </dl>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 4: Best Teams */}
      <section
        id="best-teams"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-3 md:mb-4">
              <Users className="w-7 h-7 md:w-8 md:h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl md:text-5xl font-bold">{bestTeams.title}</h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {bestTeams.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-4 md:space-y-6">
            {bestTeams.teams.map((team: any, ti: number) => (
              <div
                key={ti}
                className="p-4 md:p-6 bg-white/5 border border-border rounded-xl"
              >
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <h3 className="text-lg md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                    {team.name}
                  </h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                    {team.stage}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {team.bestFor.map((b: string, bi: number) => (
                    <span
                      key={bi}
                      className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-border"
                    >
                      {b}
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                  {team.slots.map((slot: any, si: number) => (
                    <div
                      key={si}
                      className="p-3 bg-white/[0.03] border border-border rounded-lg"
                    >
                      <p className="text-xs font-semibold text-[hsl(var(--nav-theme-light))] mb-0.5">
                        {slot.slot}
                      </p>
                      <p className="text-sm font-medium mb-1">{slot.unit}</p>
                      <p className="text-xs text-muted-foreground">
                        Alt: {slot.alternatives.join(", ")}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div className="md:col-span-1">
                    <p className="text-xs font-semibold text-muted-foreground/70 mb-1">
                      {bestTeams.whyLabel}
                    </p>
                    <p className="text-muted-foreground">{team.whyItWorks}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground/70 mb-1">
                      {bestTeams.traitsLabel}
                    </p>
                    <ul className="space-y-1">
                      {team.traitNotes.map((tr: string, tri: number) => (
                        <li key={tri} className="text-muted-foreground text-xs">
                          • {tr}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground/70 mb-1">
                      {bestTeams.orderLabel}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {team.upgradeOrder.join(" → ")}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 5: 模块之间的阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Module 5: Traits and Stat Rerolls */}
      <section id="traits-stat-rerolls" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-3 md:mb-4">
              <Dna className="w-7 h-7 md:w-8 md:h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl md:text-5xl font-bold">{traits.title}</h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {traits.intro}
            </p>
          </div>

          {/* Desktop table */}
          <div className="scroll-reveal hidden md:block overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-white/5">
                <tr>
                  <th className="text-left p-3 font-semibold">{traits.traitsLabel}</th>
                  <th className="text-left p-3 font-semibold">{traits.rarityLabel}</th>
                  <th className="text-left p-3 font-semibold">{traits.rollRateLabel}</th>
                  <th className="text-left p-3 font-semibold">{traits.effectLabel}</th>
                  <th className="text-left p-3 font-semibold">{traits.bestForLabel}</th>
                  <th className="text-left p-3 font-semibold">{traits.verdictLabel}</th>
                </tr>
              </thead>
              <tbody>
                {traits.traits.map((tr: any, i: number) => (
                  <tr key={i} className="border-t border-border align-top">
                    <td className="p-3 font-bold text-[hsl(var(--nav-theme-light))]">
                      {tr.name}
                    </td>
                    <td className="p-3 text-muted-foreground">{tr.rarity}</td>
                    <td className="p-3 text-muted-foreground">{tr.rollRate}</td>
                    <td className="p-3 text-muted-foreground">{tr.effect}</td>
                    <td className="p-3 text-muted-foreground">{tr.bestFor}</td>
                    <td className="p-3 text-muted-foreground">{tr.keepOrReroll}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="scroll-reveal md:hidden space-y-3">
            {traits.traits.map((tr: any, i: number) => (
              <div
                key={i}
                className="p-4 bg-white/5 border border-border rounded-xl"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="font-bold text-[hsl(var(--nav-theme-light))]">
                    {tr.name}
                  </h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                    {tr.rarity}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{tr.rollRate}</p>
                <p className="text-sm mb-2">{tr.effect}</p>
                <p className="text-xs text-muted-foreground mb-1">
                  <span className="text-muted-foreground/70">{traits.bestForLabel}: </span>
                  {tr.bestFor}
                </p>
                <p className="text-xs text-muted-foreground">
                  <span className="text-muted-foreground/70">{traits.verdictLabel}: </span>
                  {tr.keepOrReroll}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 6: Evolution and Etherealization */}
      <section
        id="evolution-etherealization"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-3 md:mb-4">
              <FlaskConical className="w-7 h-7 md:w-8 md:h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl md:text-5xl font-bold">{evolution.title}</h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {evolution.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-3 md:space-y-4">
            {evolution.items.map((item: any, i: number) => (
              <div
                key={i}
                className="p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[hsl(var(--nav-theme)/0.2)] border border-[hsl(var(--nav-theme)/0.5)] text-sm font-bold text-[hsl(var(--nav-theme-light))]">
                    {i + 1}
                  </span>
                  <h3 className="font-bold text-base md:text-lg text-[hsl(var(--nav-theme-light))]">
                    {item.target}
                  </h3>
                </div>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  <div>
                    <dt className="text-muted-foreground/70 text-xs font-semibold">
                      {evolution.baseFormLabel}
                    </dt>
                    <dd className="text-muted-foreground">{item.baseForm}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground/70 text-xs font-semibold">
                      {evolution.requirementsLabel}
                    </dt>
                    <dd className="text-muted-foreground">{item.requirements}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground/70 text-xs font-semibold">
                      {evolution.materialSourceLabel}
                    </dt>
                    <dd className="text-muted-foreground">{item.materialSource}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground/70 text-xs font-semibold">
                      {evolution.upgradeGainLabel}
                    </dt>
                    <dd className="text-muted-foreground">{item.upgradeGain}</dd>
                  </div>
                  <div className="md:col-span-2">
                    <dt className="text-muted-foreground/70 text-xs font-semibold inline">
                      {evolution.priorityLabel}:{" "}
                    </dt>
                    <dd className="text-[hsl(var(--nav-theme-light))] inline font-medium">
                      {item.priority}
                    </dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 7: Game Modes and Farming */}
      <section id="game-modes-farming" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-3 md:mb-4">
              <Map className="w-7 h-7 md:w-8 md:h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl md:text-5xl font-bold">{gameModes.title}</h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {gameModes.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-2 md:space-y-3">
            {gameModes.modes.map((mode: any, i: number) => (
              <div
                key={i}
                className="border border-border rounded-xl overflow-hidden bg-white/5"
              >
                <button
                  type="button"
                  onClick={() => setModeExpanded(modeExpanded === i ? null : i)}
                  className="w-full flex items-center justify-between gap-3 p-4 md:p-5 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="font-bold text-base md:text-lg">{mode.mode}</span>
                  <ChevronDown
                    className={`w-5 h-5 flex-shrink-0 transition-transform ${modeExpanded === i ? "rotate-180" : ""}`}
                  />
                </button>
                {modeExpanded === i && (
                  <div className="px-4 md:px-5 pb-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs font-semibold text-[hsl(var(--nav-theme-light))] mb-1">
                        {gameModes.rewardsLabel}
                      </p>
                      <p className="text-muted-foreground">{mode.mainRewards}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[hsl(var(--nav-theme-light))] mb-1">
                        {gameModes.teamLabel}
                      </p>
                      <p className="text-muted-foreground">{mode.recommendedTeam}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[hsl(var(--nav-theme-light))] mb-1">
                        {gameModes.targetsLabel}
                      </p>
                      <p className="text-muted-foreground">{mode.farmingTargets}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[hsl(var(--nav-theme-light))] mb-1">
                        {gameModes.strategyLabel}
                      </p>
                      <p className="text-muted-foreground">{mode.strategy}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 6: 移动端横幅 */}
      {mobileBannerAd && (
        <AdBanner
          type={mobileBannerAd.type}
          adKey={mobileBannerAd.adKey}
          className="md:hidden"
        />
      )}

      {/* Module 8: Updates and Patch Notes */}
      <section
        id="updates-patch-notes"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-3 md:mb-4">
              <Clock className="w-7 h-7 md:w-8 md:h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl md:text-5xl font-bold">{updates.title}</h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {updates.intro}
            </p>
          </div>

          <div className="scroll-reveal relative pl-6 border-l-2 border-[hsl(var(--nav-theme)/0.3)] space-y-6 md:space-y-8">
            {updates.entries.map((entry: any, i: number) => (
              <div key={i} className="relative">
                <div className="absolute -left-[1.4rem] w-4 h-4 rounded-full bg-[hsl(var(--nav-theme))] border-2 border-background" />
                <div className="p-4 md:p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                      {entry.version}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {entry.date}
                    </span>
                  </div>
                  <ul className="space-y-1.5 mb-3">
                    {entry.changes.map((c: string, ci: number) => (
                      <li key={ci} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                        <span className="text-muted-foreground">{c}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.2)] rounded-lg p-3">
                    <span className="text-xs font-semibold text-[hsl(var(--nav-theme-light))]">
                      {updates.metaImpactLabel}:{" "}
                    </span>
                    <span className="text-muted-foreground">{entry.metaImpact}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner 3 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.footer.description}
              </p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://discord.com/invite/animeparadox"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.discord}
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/LunmeiGames"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.twitter}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/channel/UCY_PQX3oVp4lSP7vXeUr4Iw"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.youtube}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.roblox.com/games/76806550943352/Anime-Paradox-X"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.roblox}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {t.footer.copyright}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.footer.disclaimer}
              </p>
              <div className="flex flex-wrap gap-3 mt-4">
                <a
                  href="https://discord.com/invite/animeparadox"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> Discord
                </a>
                <a
                  href="https://www.roblox.com/games/76806550943352/Anime-Paradox-X"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Roblox
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
