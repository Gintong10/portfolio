import HeroMap from './HeroMap'

function Hero() {
  return (
    <header className="hero" id="top">
      <HeroMap />
      <div className="hero__content">
        <p className="hero__brand">Jintong Wang</p>
        <h1 className="hero__headline">I ship small products that people can open and use.</h1>
        <div className="hero__lede">
          <p>
            Hey! Here’s something written by myself: a change of pace in this AI-ridden day and
            age. I am a sophomore studying statistics, machine learning, and computer science at
            Carnegie Mellon University. I was born in Finland, raised in San Diego, and reside in
            Pittsburgh (at least during the school year).
          </p>
          <p>
            While studying stats, ML, and maths keeps the analytical part of my brain quite busy, I
            can’t help but apply the same mindset to the things I do in my free time. When I’m not
            in class, I’m probably calculating pot odds at a poker table, tracking CS2 market price
            data, or working on some slightly useful side project. Speaking of calculating pot odds,
            poker is actually where this mindset has been tested the most. My proudest accomplishment
            is turning a $20 bankroll into $1,000 online, three separate times.
          </p>
        </div>
        <div className="hero__cta">
          <a className="btn btn--ghost" href="mailto:jintongawesome@gmail.com">
            jintongawesome@gmail.com
          </a>
          <a className="btn btn--ghost" href="https://github.com/Gintong10" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a
            className="btn btn--ghost"
            href="https://www.linkedin.com/in/jintong-wang-096645289/"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </header>
  )
}

export default Hero
