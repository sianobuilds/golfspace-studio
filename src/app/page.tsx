import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Box,
  Layers,
  Maximize2,
  MoveUpRight,
  Sparkles,
  Target,
} from "lucide-react";

const features = [
  {
    icon: Layers,
    number: "01",
    title: "Build Your Layout",
    description:
      "Place professional golf simulator equipment directly into your space with an intuitive visual editor.",
  },
  {
    icon: Maximize2,
    number: "02",
    title: "Perfect Every Detail",
    description:
      "Adjust positioning, dimensions and orientation with precise interactive controls.",
  },
  {
    icon: Sparkles,
    number: "03",
    title: "Visualize the Result",
    description:
      "Transform your equipment layout into a realistic installation preview with AI rendering.",
  },
];

export default function Home() {
  return (
    <main>
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_30%,#274c3b_0%,#142820_35%,#0c1715_75%)]" />
        <div className="absolute right-[-180px] top-16 h-[550px] w-[550px] rounded-full border border-[#c8ae7d]/10" />
        <div className="absolute right-[-90px] top-28 h-[420px] w-[420px] rounded-full border border-[#c8ae7d]/10" />

        <div className="relative mx-auto grid min-h-[740px] max-w-7xl items-center gap-14 px-6 py-24 lg:grid-cols-[1fr_1.05fr]">
          <div>
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#c8ae7d]/30 px-4 py-2 text-xs uppercase tracking-[0.2em] text-[#d6bd8b]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d6bd8b]" />
              The future of golf space planning
            </div>
            <h1 className="max-w-2xl text-5xl font-semibold leading-[1.09] tracking-[-0.06em] sm:text-6xl lg:text-7xl">
              Every great
              <br />
              game starts
              <br />
              with a <span className="italic font-light text-[#c8ae7d]">space.</span>
            </h1>
            <p className="mt-8 max-w-lg text-lg leading-8 text-white/55">
              Design your perfect golf simulator environment. Explore equipment,
              plan your layout and bring your vision to life in one intelligent studio.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/studio/demo"
                className="inline-flex items-center gap-3 rounded-full bg-[#c8ae7d] px-7 py-4 font-semibold text-[#12221a] transition hover:bg-[#e0c998]"
              >
                Start Designing <ArrowUpRight size={19} />
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center gap-3 rounded-full border border-white/25 px-7 py-4 text-white transition hover:border-[#c8ae7d]"
              >
                Explore Equipment <ArrowRight size={19} />
              </Link>
            </div>
            <div className="mt-16 flex gap-12 border-t border-white/10 pt-7">
              <div>
                <div className="text-2xl font-semibold">01</div>
                <div className="mt-1 text-xs uppercase tracking-widest text-white/40">Plan</div>
              </div>
              <div>
                <div className="text-2xl font-semibold">02</div>
                <div className="mt-1 text-xs uppercase tracking-widest text-white/40">Configure</div>
              </div>
              <div>
                <div className="text-2xl font-semibold">03</div>
                <div className="mt-1 text-xs uppercase tracking-widest text-white/40">Visualize</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] border border-white/10" />
            <div className="relative overflow-hidden rounded-[1.5rem] border border-white/15 bg-[#21382e] shadow-2xl">
              <div className="relative aspect-[4/4.2] overflow-hidden bg-[radial-gradient(ellipse_at_50%_20%,#476b51,#1a2d26_65%,#0b1512)]">
                <div className="absolute inset-x-[9%] top-[12%] h-[55%] border-[14px] border-[#101a17] bg-[#d7dfd4] shadow-[0_0_60px_#b8d2ae30]">
                  <div className="absolute inset-0 bg-[linear-gradient(160deg,#7a9984,#c2d3ba_45%,#657e68)]" />
                  <div className="absolute inset-x-0 bottom-0 h-[30%] bg-[#456b4b]" />
                  <div className="absolute bottom-[20%] left-1/2 h-[5px] w-[35%] -translate-x-1/2 rounded-full bg-[#e8e7cc]" />
                </div>
                <div className="absolute bottom-[5%] left-[17%] right-[17%] h-[33%] rounded-[45%] bg-[#537b59] shadow-[0_0_0_20px_#172820,0_18px_40px_#0008]" />
                <div className="absolute bottom-[18%] left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-white shadow-lg" />
                <div className="absolute left-[9%] top-[10%] h-[4px] w-[82%] bg-[#d7b780]/50 blur-sm" />
                <div className="absolute bottom-6 left-6 rounded-xl border border-white/15 bg-[#102019]/85 px-5 py-4 backdrop-blur">
                  <div className="text-[10px] uppercase tracking-[0.22em] text-[#c8ae7d]">Space concept</div>
                  <div className="mt-1 text-xl font-medium">The Signature Bay</div>
                  <div className="mt-1 text-xs text-white/45">Premium simulator configuration</div>
                </div>
              </div>
            </div>
            <div className="absolute -right-5 top-10 hidden rounded-2xl border border-white/15 bg-[#172c23]/95 p-5 shadow-xl backdrop-blur sm:block">
              <div className="flex items-center gap-3">
                <Target size={20} className="text-[#c8ae7d]" />
                <div>
                  <div className="text-xs text-white/45">Equipment planning</div>
                  <div className="text-sm font-semibold">Interactive Studio</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#101e19] py-10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-6 text-xs uppercase tracking-[0.25em] text-white/40">
          <span>Spatial Design</span>
          <span>Equipment Planning</span>
          <span>Interactive Canvas</span>
          <span>AI Visualization</span>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-28">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.25em] text-[#c8ae7d]">Designed around you</p>
            <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              From empty room to<br />extraordinary experience.
            </h2>
          </div>
          <Link href="/studio/demo" className="flex items-center gap-2 text-sm text-[#c8ae7d]">
            Enter the studio <MoveUpRight size={17} />
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.number} className="rounded-2xl border border-white/10 bg-[#15261f] p-8">
              <div className="mb-12 flex items-start justify-between">
                <feature.icon size={29} className="text-[#c8ae7d]" strokeWidth={1.5} />
                <span className="text-sm text-white/25">{feature.number}</span>
              </div>
              <h3 className="text-2xl font-medium">{feature.title}</h3>
              <p className="mt-4 leading-7 text-white/50">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#c8ae7d] px-6 py-24 text-[#13221b]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-8">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em]">Your space, reimagined</p>
            <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Ready to design your next space?
            </h2>
          </div>
          <Link href="/studio/demo" className="inline-flex items-center gap-3 rounded-full bg-[#13221b] px-7 py-4 font-semibold text-white">
            Launch Design Studio <ArrowUpRight size={19} />
          </Link>
        </div>
      </section>
      <footer className="mx-auto flex max-w-7xl flex-wrap justify-between gap-4 px-6 py-10 text-sm text-white/40">
        <span>© 2026 GolfSpace Studio. Portfolio demonstration.</span>
        <span>Designed for better spaces.</span>
      </footer>
    </main>
  );
}
