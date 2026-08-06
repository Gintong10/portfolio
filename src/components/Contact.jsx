function Contact() {
  return (
    <section className="section contact" id="contact">
      <div className="section__head">
        <p className="section__label">Contact</p>
        <h2>Want to build something?</h2>
        <p className="section__sub">Say hi. I’m around for collabs, feedback, and cool product ideas.</p>
      </div>
      <p className="contact__email">jintongawesome [at] gmail [dot] com</p>
      <p className="contact__links">
        <a
          href="https://www.linkedin.com/in/jintong-wang-096645289/"
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn
        </a>
        <span aria-hidden="true">·</span>
        <a href="https://github.com/Gintong10" target="_blank" rel="noreferrer">
          GitHub
        </a>
      </p>
    </section>
  )
}

export default Contact
