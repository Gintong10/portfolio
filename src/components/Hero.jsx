import HeroMap from './HeroMap'

function Hero() {
  return (
    <header className="hero" id="top">
      <HeroMap />
      <div className="hero__content">
        <p className="hero__brand">Jintong Wang</p>
        <h1 className="hero__headline">I ship small products that people can open and use.</h1>
        <p className="hero__lede">
          CMU student building iOS apps, realtime games, and tools, from Pittsburgh and San Diego.
        </p>
        <div className="hero__cta">
          <a className="btn btn--primary" href="#work">
            See the work
          </a>
          <a className="btn btn--ghost" href="https://github.com/Gintong10" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </div>
    </header>
  )
}

export default Hero
