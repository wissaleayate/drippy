import { motion } from 'motion/react';
import { MapPin, Phone, Mail } from 'lucide-react';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import { useLang } from '../../context/LanguageContext';

export default function ContactPage() {
  const { t, isRTL } = useLang();

  const INFO_CARDS = [
    {
      icon: <Phone className="w-5 h-5" />,
      label: 'Phone',
      title: 'Call Us',
      value: '+213 (0) 23 45 67 89\nMon–Sat, 9 AM – 6 PM',
      accent: true,
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: 'Address',
      title: 'Find Us',
      value: '27 Rue des Martyrs\nAlgiers, Algeria 16000',
      accent: false,
    },
  ];

  const INSTAGRAM_HANDLE = '@drippy.dz';
  const INSTAGRAM_URL = '#';

  return (
    <div className="bg-ink text-bone min-h-screen font-sans flex flex-col selection:bg-volt selection:text-ink">
      <Nav />

      <main className="flex-grow pt-24 pb-20 px-4 sm:px-6 md:px-10 max-w-[1400px] mx-auto w-full">

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 sm:mb-20 mt-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.02] mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-volt animate-pulse" aria-hidden="true" />
            <span className="text-[10px] font-mono tracking-widest text-ash uppercase">{t.contact_eyebrow}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-black tracking-tight text-bone uppercase mb-5">
            {t.contact_heading.split('\n').map((line, i) => (
              <span key={i}>
                {i === 1 ? <span className="text-volt">{line}</span> : line}
                {i === 0 && <br />}
              </span>
            ))}
          </h1>
          <p className="text-sm sm:text-base text-ash max-w-md mx-auto font-medium leading-relaxed">
            {t.contact_subheading}
          </p>
        </motion.section>

        {/* ── Call Us / Find Us Cards ─────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 max-w-3xl mx-auto"
          aria-label="Contact information"
        >
          {INFO_CARDS.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 * i, ease: [0.16, 1, 0.3, 1] }}
              className={`group relative p-6 rounded-2xl border transition-all duration-300 cursor-default
                ${card.accent
                  ? 'bg-volt/[0.04] border-volt/20 hover:border-volt/40 hover:bg-volt/[0.07]'
                  : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.14] hover:bg-white/[0.04]'
                }`}
            >
              <div className={`flex items-center ${isRTL ? 'flex-row-reverse justify-between' : 'justify-between'} mb-4`}>
                <div className={`p-2 rounded-xl transition-colors duration-300
                  ${card.accent ? 'bg-volt/10 text-volt' : 'bg-white/[0.05] text-ash group-hover:text-bone'}`}
                  aria-hidden="true"
                >
                  {card.icon}
                </div>
                <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-ash/50">{card.label}</span>
              </div>
              <h3 className={`font-display font-black text-lg uppercase tracking-wide mb-2
                ${card.accent ? 'text-volt' : 'text-bone'}`}
              >
                {card.title}
              </h3>
              <p className="text-sm text-ash leading-relaxed whitespace-pre-line">{card.value}</p>
            </motion.div>
          ))}
        </motion.section>

        {/* ── Instagram + Map ─────────────────────────────────────────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-20 sm:mb-24 max-w-3xl mx-auto">
          {/* Instagram card */}
          <motion.a
            href={INSTAGRAM_URL}
            initial={{ opacity: 0, x: isRTL ? 30 : -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="group flex flex-col items-center justify-center gap-4 p-8 bg-white/[0.02] border border-white/[0.06] rounded-3xl hover:border-volt/30 hover:bg-white/[0.04] transition-all duration-300 text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-white/[0.05] group-hover:bg-volt/10 flex items-center justify-center text-ash group-hover:text-volt transition-all duration-300">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </div>
            <div>
              <h3 className="font-display font-black text-lg uppercase tracking-wide text-bone mb-1">Instagram</h3>
              <p className="text-sm text-ash">{INSTAGRAM_HANDLE}</p>
            </div>
          </motion.a>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? -30 : 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="min-h-[220px] bg-white/[0.02] border border-white/[0.06] rounded-3xl overflow-hidden relative"
          >
            <div
              className="absolute inset-0 opacity-[0.04]"
              aria-hidden="true"
              style={{
                backgroundImage: 'linear-gradient(#c8ff00 1px, transparent 1px), linear-gradient(90deg, #c8ff00 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-volt/10 border border-volt/20 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-volt" aria-hidden="true" />
                </div>
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-volt animate-ping" aria-hidden="true" />
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-volt" aria-hidden="true" />
              </div>
              <div className="text-center">
                <p className="font-display font-black text-base uppercase text-bone tracking-wide">Algiers, Algeria</p>
                <p className="text-xs text-ash font-mono mt-1">27 Rue des Martyrs</p>
              </div>
              
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 px-4 py-2 text-[10px] font-mono font-bold uppercase tracking-widest bg-volt text-ink rounded-lg hover:bg-bone transition-colors duration-200"
                aria-label="Open location in Google Maps"
              >
                {t.contact_open_maps}
              </a>
            </div>
          </motion.div>
        </section>

        {/* ── CTA Banner ───────────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.02] p-8 sm:p-10 md:p-14 text-center mb-4"
        >
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] pointer-events-none"
            aria-hidden="true"
            style={{ background: 'radial-gradient(ellipse, rgba(200,255,0,0.07) 0%, transparent 70%)' }}
          />
          <p className="text-[10px] font-mono tracking-[0.25em] uppercase text-ash mb-3">{t.contact_still_questions}</p>
          <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-bone mb-4">
            {t.contact_one_message_away}
          </h2>
          <p className="text-sm text-ash max-w-sm mx-auto mb-8 leading-relaxed">
            {t.contact_concierge_desc}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@nk-store.dz"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 bg-volt text-ink font-mono font-bold text-xs uppercase tracking-[0.15em] rounded-xl hover:bg-bone transition-colors duration-200 tap-target"
            >
              <Mail className="w-4 h-4" aria-hidden="true" />
              {t.contact_email_support}
            </a>
            <a
              href="tel:+21323456789"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 bg-transparent border border-white/10 text-bone font-mono font-bold text-xs uppercase tracking-[0.15em] rounded-xl hover:border-volt/40 hover:text-volt transition-all duration-200 tap-target"
            >
              <Phone className="w-4 h-4" aria-hidden="true" />
              {t.contact_call_us}
            </a>
          </div>
        </motion.section>

      </main>

      <Footer />
    </div>
  );
}
