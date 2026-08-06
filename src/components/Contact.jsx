function Contact() {
  return (
    <section className="section contact" id="contact">
      <div className="section__head">
        <p className="section__label">Contact</p>
        <h2>Want to build something?</h2>
        <p className="section__sub">Say hi — I’m around for collabs, feedback, and cool product ideas.</p>
      </div>
      <div className="contact__actions">
        <a className="btn btn--primary" href="mailto:jintongawesome@gmail.com">
          jintongawesome@gmail.com
        </a>
        <a
          className="btn btn--ghost"
          href="https://github.com/Gintong10"
          target="_blank"
          rel="noreferrer"
        >
          github.com/Gintong10
        </a>
      </div>
    </section>
  )
}

export default Contact
