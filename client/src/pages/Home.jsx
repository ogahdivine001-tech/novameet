import { Link } from 'react-router-dom';
import {
  HiVideoCamera,
  HiShieldCheck,
  HiUserGroup,
  HiChatAlt2,
  HiDesktopComputer,
  HiLockClosed,
  HiChevronDown,
  HiCheck,
  HiMicrophone,
} from 'react-icons/hi';
import { BsMicMuteFill } from 'react-icons/bs';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import useAuth from '../hooks/useAuth';
import { getInitials, getAvatarColor } from '../utils/meetingUtils';

const features = [
  {
    icon: HiVideoCamera,
    title: 'HD video, always sharp',
    description:
      'Adaptive video that scales to your connection so every face stays clear, from a two-person call to a full team huddle.',
  },
  {
    icon: HiDesktopComputer,
    title: 'One-click screen sharing',
    description:
      'Present your screen, a single window, or a slide deck the moment you need to, no plugins or extra downloads.',
  },
  {
    icon: HiChatAlt2,
    title: 'Live chat during calls',
    description:
      'Drop links, questions, or quick notes into the meeting chat without interrupting whoever is speaking.',
  },
  {
    icon: HiUserGroup,
    title: 'Built for real teams',
    description:
      'Raise hands, mute noisy mics, and manage who is in the room with host controls made for busy meetings.',
  },
  {
    icon: HiShieldCheck,
    title: 'Meetings you control',
    description:
      'Lock a room once everyone has arrived, or protect it with a password so only invited people get in.',
  },
  {
    icon: HiLockClosed,
    title: 'Private by default',
    description:
      'Every meeting gets a unique ID, and your account credentials are never shared with anyone in the room.',
  },
];

const steps = [
  {
    title: 'Create your meeting',
    description: 'Start an instant meeting or schedule one for later in a few seconds.',
  },
  {
    title: 'Share the meeting ID',
    description: 'Send your unique NovaMeet ID or link to anyone you want in the room.',
  },
  {
    title: 'Meet and collaborate',
    description: 'Talk, share your screen, and chat, all inside one clean meeting room.',
  },
];

const pricingTiers = [
  {
    name: 'Starter',
    price: 'Free',
    description: 'For individuals getting started with video calls.',
    features: ['Unlimited 1:1 meetings', 'Up to 6 participants', 'Screen sharing', 'In-call chat'],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Team',
    price: '$12',
    period: '/host/month',
    description: 'For growing teams that meet every day.',
    features: [
      'Up to 100 participants',
      'Meeting scheduling',
      'Password-protected rooms',
      'Waiting room control',
      'Meeting history',
    ],
    cta: 'Start Free Trial',
    highlighted: true,
  },
  {
    name: 'Business',
    price: '$24',
    period: '/host/month',
    description: 'For organizations with advanced security needs.',
    features: [
      'Up to 500 participants',
      'Admin roles & controls',
      'Priority support',
      'Custom branding',
      'Dedicated onboarding',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

const testimonials = [
  {
    name: 'Amara Okafor',
    role: 'Operations Lead, Driftwood Studio',
    quote:
      'NovaMeet replaced three different tools for our weekly standups. The room just works, every time.',
  },
  {
    name: 'Daniel Reyes',
    role: 'University Lecturer',
    quote:
      'My students join from every kind of device and it never breaks. Screen sharing for slides is instant.',
  },
  {
    name: 'Priya Nataraj',
    role: 'Founder, Loomline',
    quote:
      'The host controls give me confidence running client calls. Locking a room once everyone joins is a small thing that matters a lot.',
  },
];

const faqs = [
  {
    q: 'Do participants need an account to join a meeting?',
    a: 'Meeting hosts need a NovaMeet account to create and manage meetings. Participants joining an existing meeting also sign in, which keeps meeting rooms secure and lets hosts manage who is present.',
  },
  {
    q: 'How many people can join a single meeting?',
    a: 'It depends on your plan. Starter supports up to 6 participants, Team supports up to 100, and Business supports up to 500 participants per meeting.',
  },
  {
    q: 'Can I password-protect a meeting?',
    a: 'Yes. When creating a meeting you can set a password and enable a waiting room, so only people you approve can join.',
  },
  {
    q: 'What happens if my host ends the meeting?',
    a: 'All participants are notified immediately and returned to the dashboard. The meeting is marked as ended in your meeting history.',
  },
];

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="min-h-screen flex flex-col bg-[rgb(var(--color-bg))]">
      <Navbar />

      {/* Hero */}
      <section id="home" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-nova-50 via-transparent to-transparent dark:from-nova-950/40 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-16 relative">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-nova-100 dark:bg-nova-950 text-nova-700 dark:text-nova-300 text-xs font-semibold mb-5">
              <HiVideoCamera /> Trusted by modern teams worldwide
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[rgb(var(--color-text-primary))] leading-[1.08]">
              Meet. Collaborate. <span className="text-nova-600">Connect.</span>
            </h1>
            <p className="mt-5 text-base sm:text-lg text-[rgb(var(--color-text-secondary))] max-w-xl mx-auto">
              NovaMeet gives teams, students, businesses, and communities secure,
              reliable video meetings that just work, no matter how many people join.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to={isAuthenticated ? '/meetings/create' : '/register'}
                className="btn btn-primary text-base px-6 py-3 w-full sm:w-auto"
              >
                Start a Meeting
              </Link>
              <Link
                to={isAuthenticated ? '/meetings/join' : '/login'}
                className="btn btn-secondary text-base px-6 py-3 w-full sm:w-auto"
              >
                Join a Meeting
              </Link>
            </div>
          </div>

          {/* Hero visual: meeting dashboard preview */}
          <div className="mt-14 max-w-5xl mx-auto animate-slide-up">
            <div className="card p-3 sm:p-4 shadow-card-hover">
              <div className="flex items-center gap-1.5 px-2 pb-3">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="ml-3 text-xs text-[rgb(var(--color-text-secondary))] font-mono">
                  novameet.app/meeting/NOVA-482-913
                </span>
              </div>
              <div className="rounded-xl bg-slate-900 p-3 sm:p-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                  {[
                    { name: 'You', color: '#6366f1' },
                    { name: 'Amara O.', color: '#ec4899' },
                    { name: 'Daniel R.', color: '#10b981' },
                    { name: 'Priya N.', color: '#f59e0b' },
                    { name: 'Marcus T.', color: '#06b6d4' },
                    { name: 'Sofia L.', color: '#8b5cf6' },
                  ].map((p, i) => (
                    <div
                      key={p.name}
                      className="aspect-video rounded-lg bg-slate-800 flex items-center justify-center relative overflow-hidden"
                    >
                      <div
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white text-sm font-bold"
                        style={{ backgroundColor: p.color }}
                      >
                        {getInitials(p.name)}
                      </div>
                      <span className="absolute bottom-1.5 left-1.5 text-[10px] sm:text-xs text-white/90 flex items-center gap-1">
                        {p.name}
                        {i === 2 ? <BsMicMuteFill className="text-red-400" /> : <HiMicrophone />}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-2 mt-3 sm:mt-4">
                  {[HiMicrophone, HiVideoCamera, HiDesktopComputer, HiChatAlt2, HiUserGroup].map(
                    (Icon, i) => (
                      <span
                        key={i}
                        className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-white/80"
                      >
                        <Icon className="text-sm" />
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted by */}
      <section className="py-10 border-y border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <p className="text-center text-xs uppercase tracking-wider text-[rgb(var(--color-text-secondary))] font-semibold mb-6">
            Trusted by modern teams
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-[rgb(var(--color-text-secondary))] font-bold text-lg opacity-70">
            <span>Driftwood</span>
            <span>Loomline</span>
            <span>Northgate</span>
            <span>Cedarpoint</span>
            <span>Fieldnote</span>
            <span>Harborlight</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="max-w-xl mx-auto text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[rgb(var(--color-text-primary))]">
              Everything a meeting needs
            </h2>
            <p className="mt-3 text-[rgb(var(--color-text-secondary))]">
              A focused set of tools that make meetings feel effortless, for hosts and
              participants alike.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="card p-6 hover:shadow-card-hover transition-shadow">
                <div className="w-11 h-11 rounded-xl bg-nova-50 dark:bg-nova-950 flex items-center justify-center mb-4">
                  <f.icon className="text-nova-600 dark:text-nova-400 text-xl" />
                </div>
                <h3 className="font-semibold text-[rgb(var(--color-text-primary))]">{f.title}</h3>
                <p className="text-sm text-[rgb(var(--color-text-secondary))] mt-2">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="solutions" className="py-20 sm:py-24 bg-[rgb(var(--color-surface))] border-y border-[rgb(var(--color-border))]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="max-w-xl mx-auto text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[rgb(var(--color-text-primary))]">
              How NovaMeet works
            </h2>
            <p className="mt-3 text-[rgb(var(--color-text-secondary))]">
              Three steps between you and a meeting that runs itself.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={s.title} className="text-center">
                <div className="w-12 h-12 rounded-full bg-nova-600 text-white flex items-center justify-center font-bold mx-auto mb-4">
                  {i + 1}
                </div>
                <h3 className="font-semibold text-[rgb(var(--color-text-primary))]">{s.title}</h3>
                <p className="text-sm text-[rgb(var(--color-text-secondary))] mt-2 max-w-xs mx-auto">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collaboration */}
      <section className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[rgb(var(--color-text-primary))]">
              Built to keep everyone in sync
            </h2>
            <p className="mt-4 text-[rgb(var(--color-text-secondary))]">
              Chat alongside video, raise a hand instead of interrupting, and let hosts
              manage the room without losing the flow of conversation. NovaMeet keeps the
              collaboration tools close at hand without cluttering the call.
            </p>
            <ul className="mt-6 space-y-3">
              {['Real-time in-call chat', 'Raise hand queue for hosts', 'Live mic and camera status'].map(
                (item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-[rgb(var(--color-text-primary))]">
                    <HiCheck className="text-nova-600 flex-shrink-0" /> {item}
                  </li>
                )
              )}
            </ul>
          </div>
          <div className="card p-5">
            <div className="rounded-xl bg-slate-900 p-4 h-64 flex flex-col justify-end gap-2">
              {[
                { name: 'Priya N.', text: 'Can you share the roadmap slide?' },
                { name: 'Marcus T.', text: 'Sharing my screen now 👍' },
              ].map((m) => (
                <div key={m.name} className="flex items-start gap-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                    style={{ backgroundColor: getAvatarColor(m.name) }}
                  >
                    {getInitials(m.name)}
                  </div>
                  <div className="bg-slate-800 text-white text-xs px-3 py-2 rounded-2xl rounded-tl-sm max-w-[80%]">
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Security */}
      <section id="security" className="py-20 sm:py-24 bg-[rgb(var(--color-surface))] border-y border-[rgb(var(--color-border))]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 grid md:grid-cols-2 gap-10 items-center">
          <div className="order-2 md:order-1 card p-8 flex items-center justify-center">
            <HiShieldCheck className="text-nova-600 text-8xl" />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[rgb(var(--color-text-primary))]">
              Security built into every room
            </h2>
            <p className="mt-4 text-[rgb(var(--color-text-secondary))]">
              Every meeting gets a unique, hard-to-guess ID. Hosts can add a password,
              enable a waiting room, and lock the meeting once everyone has arrived.
              Passwords are hashed and your account credentials never leave your device
              unprotected.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="max-w-xl mx-auto text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[rgb(var(--color-text-primary))]">
              Simple, transparent pricing
            </h2>
            <p className="mt-3 text-[rgb(var(--color-text-secondary))]">
              Start free. Upgrade when your team needs more room.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`card p-7 flex flex-col ${
                  tier.highlighted ? 'ring-2 ring-nova-600 relative' : ''
                }`}
              >
                {tier.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 badge bg-nova-600 text-white">
                    Most popular
                  </span>
                )}
                <h3 className="font-semibold text-[rgb(var(--color-text-primary))]">{tier.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-[rgb(var(--color-text-primary))]">
                    {tier.price}
                  </span>
                  {tier.period && (
                    <span className="text-sm text-[rgb(var(--color-text-secondary))]">
                      {tier.period}
                    </span>
                  )}
                </div>
                <p className="text-sm text-[rgb(var(--color-text-secondary))] mt-2">
                  {tier.description}
                </p>
                <ul className="mt-5 space-y-2.5 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-[rgb(var(--color-text-primary))]">
                      <HiCheck className="text-nova-600 flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  className={`btn w-full mt-6 text-sm ${
                    tier.highlighted ? 'btn-primary' : 'btn-secondary'
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 sm:py-24 bg-[rgb(var(--color-surface))] border-y border-[rgb(var(--color-border))]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="max-w-xl mx-auto text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[rgb(var(--color-text-primary))]">
              Loved by people who meet a lot
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="card p-6">
                <p className="text-sm text-[rgb(var(--color-text-primary))]">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3 mt-5">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: getAvatarColor(t.name) }}
                  >
                    {getInitials(t.name)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">{t.name}</p>
                    <p className="text-xs text-[rgb(var(--color-text-secondary))]">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 sm:py-24">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[rgb(var(--color-text-primary))]">
              Frequently asked questions
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((item, idx) => (
              <div key={item.q} className="card overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left focus-ring"
                  aria-expanded={openFaq === idx}
                >
                  <span className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
                    {item.q}
                  </span>
                  <HiChevronDown
                    className={`text-[rgb(var(--color-text-secondary))] transition-transform ${
                      openFaq === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-4 text-sm text-[rgb(var(--color-text-secondary))]">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-24">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-nova-600 to-nova-900 px-8 py-14 sm:py-16 text-center shadow-card-hover">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Ready to meet better?
            </h2>
            <p className="mt-3 text-nova-100 max-w-md mx-auto">
              Create your first NovaMeet room in under a minute. No credit card required.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/register" className="btn bg-white text-nova-700 hover:bg-nova-50 text-base px-6 py-3 w-full sm:w-auto">
                Get Started Free
              </Link>
              <Link to="/login" className="btn border border-white/30 text-white hover:bg-white/10 text-base px-6 py-3 w-full sm:w-auto">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
