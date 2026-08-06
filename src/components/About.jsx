import { skills } from '../data/projects'

function About() {
  return (
    <section className="section about" id="about">
      <div className="section__head">
        <p className="section__label">About</p>
        <h2>Builder first. Student at Carnegie Mellon.</h2>
      </div>
      <div className="about__grid">
        <div className="about__copy">
          <p>
            I’m Jintong Wang, class of 2029 at CMU. I like products with a clear loop:
            walk into a place and apps lock, deal a hand and friends join on a link,
            press play and Chinese lyrics make sense.
          </p>
          <p>
            Lately that’s meant shipping Landlock on the App Store, running PokerWhen
            for home games, and hacking on multiplayer toys for TartanHacks and beyond.
            Based between San Diego and Pittsburgh.
          </p>
        </div>
        <ul className="about__skills">
          {skills.map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default About
