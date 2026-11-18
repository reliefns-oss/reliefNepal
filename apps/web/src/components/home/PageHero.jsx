import Container from '../shared/Container.jsx';
import PrimaryButton from '../shared/PrimaryButton.jsx';

export default function PageHero() {
  return (
    <section className="relative isolate overflow-hidden bg-forest-900 text-white">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(18,58,39,.96),rgba(18,58,39,.72)),url('/images/community-placeholder.svg')] bg-cover bg-center" />
      <Container className="py-24 sm:py-32 lg:py-40">
        <p className="mb-5 text-xs font-bold uppercase tracking-[0.24em] text-amber-200">
          Standing with communities across Nepal
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold leading-tight sm:text-6xl">
          Together, building a future where everyone can thrive.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-white/80">
          We work with local communities to strengthen opportunity, dignity, and
          resilience. Learn about our approach and the work we do together.
        </p>
        <div className="mt-9 flex flex-wrap gap-4">
          <PrimaryButton
            href="/our%20work"
            className="bg-white text-forest-900 hover:bg-ivory"
          >
            Explore our work
          </PrimaryButton>
          <a
            className="inline-flex min-h-11 items-center rounded-full border border-white/50 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
            href="#impact"
          >
            See our approach
          </a>
        </div>
      </Container>
    </section>
  );
}
