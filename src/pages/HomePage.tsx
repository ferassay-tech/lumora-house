import { Link } from "react-router-dom";
import { PageShell } from "../components/page-shell";
import { GoldDivider, CornerFlourish, QuoteMark, IconBook, IconHeart, IconOpenHands } from "../components/ornaments";
import { StampCTA, UnderlineLink } from "../components/cta";
import { Reveal, ParallaxLayer, CursorDrift } from "../components/motion-primitives";
import { books } from "../lib/content";
import { StructuredData } from "../components/StructuredData";

const featuredBook = books.find((b) => b.featured)!;

const BOOK_JSON_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Book",
  name: featuredBook.title,
  author: { "@type": "Person", name: featuredBook.author },
  inLanguage: "ar",
  bookFormat: "https://schema.org/EBook",
});

export default function HomePage() {
  return (
    <PageShell>
      <StructuredData json={BOOK_JSON_LD} />
      <HeroSection />
      <PhilosophySection />
      <FeaturedBookSection />
      <BooksGridSection />
      <QuoteSection />
      <FinalCTASection />
    </PageShell>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden px-6 pb-24 pt-14 lg:px-10 lg:pb-32 lg:pt-20">
      {/* background watercolor plate, muted */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-ivory via-ivory/95 to-ivory" />
      </div>

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-[0.9fr_1.1fr]">
        {/* book cutout — bottom-left per brief's editorial-offset architecture */}
        <div className="relative order-2 flex justify-center lg:order-1 lg:justify-start">
          <ParallaxLayer speed={0.08} className="relative">
            <CursorDrift strength={8}>
              <div className="relative">
                <div className="absolute -inset-10 -z-10 rounded-full bg-gold/10 blur-3xl" />
                <img
  src={featuredBook.cover}
  alt={featuredBook.title}
                  className="w-full max-w-md drop-shadow-[0_40px_60px_rgba(44,36,32,0.25)]"
                />
              </div>
            </CursorDrift>
          </ParallaxLayer>
        </div>

        {/* headline block — top-right, RTL primary reading direction */}
        <div className="order-1 text-center lg:order-2 lg:text-right">
          <Reveal>
            <p className="text-sm uppercase tracking-[0.25em] text-gold">دار لومورا للنشر الرقمي</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="mt-5 text-balance font-display text-5xl leading-[1.15] text-ink md:text-7xl">
              كوني هاجر
            </h1>
          </Reveal>
          <Reveal delay={0.14}>
            <div className="mt-6 flex justify-center lg:justify-end">
              <GoldDivider className="h-5 w-52 text-gold" />
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mx-auto mt-6 max-w-xl text-balance text-lg leading-loose text-ink-soft lg:mx-0">
              دليلك للثبات والوعي والأثر الذي لا يُنسى. للمرأة التي تختار أن تكون بدايةً لحكاية تُلهم.
            </p>
          </Reveal>
          <Reveal delay={0.26}>
            <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-end">
              <StampCTA to="/books/kuni-hajar">اطلبي نسختك الآن</StampCTA>
              <UnderlineLink to="/about">تعرّفي على الدار</UnderlineLink>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function PhilosophySection() {
  return (
    <section className="relative overflow-hidden bg-cream px-6 py-24 lg:px-10 lg:py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <Reveal>
          <p className="text-sm uppercase tracking-[0.25em] text-gold">فلسفتنا</p>
          <h2 className="mt-4 text-balance font-display text-4xl leading-tight text-ink md:text-5xl">
            نؤمن بأن الكلمة الراقية تستحق أن تُصاغ في أبهى صورة
          </h2>
          <p className="mt-6 max-w-lg text-balance leading-loose text-ink-soft">
            من هذا الإيمان، نختار بعناية ما ننشر وما نصمم وما نُبدع، لنمنح قارئاتنا تجارب فكرية
            وجمالية تلهم وتدوم. نحن أكثر من دار نشر، نحن حارسات للمعنى، وجسر بين الجمال والعمق.
          </p>
        </Reveal>

        {/* second-read moment: the gold arabesque bleeding at full saturation */}
        <Reveal delay={0.15} className="relative">
          <div className="relative -mx-6 aspect-square overflow-hidden rounded-[10px] lg:mx-0 lg:-mr-10">
            <img
              src="/assets/arabesque-pattern.webp"
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FeaturedBookSection() {
  return (
    <section className="px-6 py-24 lg:px-10 lg:py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <Reveal className="relative order-2 lg:order-1">
          <div className="relative overflow-hidden rounded-[10px] bg-gradient-to-br from-cream to-beige p-10">
            <CornerFlourish className="absolute right-4 top-4 h-14 w-14 text-gold/60" />
            <img
              src={featuredBook.cover}
alt={featuredBook.title}
              className="mx-auto w-full max-w-sm drop-shadow-2xl"
              loading="lazy"
            />
          </div>
        </Reveal>

        <div className="order-1 text-center lg:order-2 lg:text-right">
          <Reveal>
            <p className="text-sm uppercase tracking-[0.25em] text-gold">الكتاب المميز</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-4 font-display text-4xl leading-tight text-ink md:text-5xl">
              {featuredBook.title}
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <div className="mt-5 flex justify-center lg:justify-end">
              <GoldDivider className="h-4 w-44 text-gold" />
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mx-auto mt-6 max-w-lg text-balance leading-loose text-ink-soft lg:mx-0">
              {featuredBook.excerpt}
            </p>
          </Reveal>
          <Reveal delay={0.26}>
            <div className="mt-8 flex justify-center lg:justify-end">
              <UnderlineLink to={`/books/${featuredBook.slug}`}>اقرئي المزيد</UnderlineLink>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function BooksGridSection() {
  return (
    <section className="bg-cream px-6 py-24 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="text-center">
          <p className="text-sm uppercase tracking-[0.25em] text-gold">أحدث الإصدارات</p>
          <h2 className="mt-4 font-display text-4xl text-ink md:text-5xl">مكتبة دار لومورا</h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {books.map((book, i) => (
            <Reveal key={book.slug} delay={i * 0.06}>
              <Link
                to={`/books/${book.slug}`}
                className="group block overflow-hidden rounded-[10px] border border-beige bg-ivory transition-shadow duration-300 hover:shadow-[0_20px_45px_-20px_rgba(44,36,32,0.25)]"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-cream to-beige p-6">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="mx-auto h-full w-auto object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                  <span className="absolute right-4 top-4 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-ink/90 text-sm text-ivory opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {book.comingSoon && (
                    <span className="absolute left-4 top-4 rounded-full bg-lavender/80 px-3 py-1 text-xs text-ink">
                      قريبًا
                    </span>
                  )}
                </div>
                <div className="border-t border-beige p-5 text-right">
                  <p className="text-xs text-gold">{book.category}</p>
                  <h3 className="mt-1.5 font-display text-lg text-ink">{book.title}</h3>
                  <p className="mt-1 text-xs text-ink-soft">{book.author}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3} className="mt-12 text-center">
          <UnderlineLink to="/books">عرض جميع الكتب</UnderlineLink>
        </Reveal>
      </div>
    </section>
  );
}

function QuoteSection() {
  return (
    <section className="relative overflow-hidden bg-mauve/25 px-6 py-28 lg:px-10">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <QuoteMark className="mx-auto h-10 w-14 text-gold" />
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-8 text-balance font-display text-3xl leading-relaxed text-ink md:text-4xl">
            الكتاب الذي يصل إلى قلبك، يبقى فيه أطول من أي كلمة تُقال.
          </p>
        </Reveal>
        <Reveal delay={0.18}>
          <p className="mt-6 text-sm text-ink-soft">مها نصر، مؤلفة كوني هاجر</p>
        </Reveal>
      </div>
    </section>
  );
}

function FinalCTASection() {
  return (
    <section className="px-6 py-24 lg:px-10 lg:py-28">
      <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-10 rounded-[10px] border border-beige bg-cream/60 p-10 text-center sm:grid-cols-3 lg:p-14">
        <FeatureIcon icon={<IconBook className="h-8 w-8" />} label="كتاب فاخر يُقتنى" />
        <FeatureIcon icon={<IconHeart className="h-8 w-8" />} label="محتوى بقلب صادق" />
        <FeatureIcon icon={<IconOpenHands className="h-8 w-8" />} label="أثر يبقى بعدك" />
      </div>

      <Reveal className="mx-auto mt-16 max-w-2xl text-center">
        <h2 className="text-balance font-display text-3xl leading-tight text-ink md:text-4xl">
          ابدئي رحلتك مع كوني هاجر اليوم
        </h2>
        <p className="mt-4 text-balance leading-loose text-ink-soft">
          نسخة رقمية فاخرة، تصلك خلال دقائق، لتبدئي القراءة على الفور.
        </p>
        <div className="mt-8 flex justify-center">
          <StampCTA to="/books/kuni-hajar">اطلبي نسختك الآن</StampCTA>
        </div>
      </Reveal>
    </section>
  );
}

function FeatureIcon({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-gold">{icon}</span>
      <span className="text-sm text-ink-soft">{label}</span>
    </div>
  );
}

