import { projects } from '../data/projects'

function Work() {
  return (
    <section className="section work" id="work">
      <div className="section__head">
        <p className="section__label">Selected work</p>
        <h2>Things I’ve built and put online.</h2>
        <p className="section__sub">
          Flagship product work first, then games and systems tools from the last year.
        </p>
      </div>

      <ol className="work__list">
        {projects.map((project, index) => (
          <li key={project.id} className="work__item">
            <a
              className="work__link"
              href={project.href}
              target="_blank"
              rel="noreferrer"
            >
              <div className="work__media">
                <img
                  className={`work__preview${project.previewFit === 'contain' ? ' work__preview--contain' : ''}`}
                  src={project.preview}
                  alt={`${project.name} in action`}
                  loading="lazy"
                  width={1440}
                  height={900}
                />
              </div>
              <div className="work__copy">
                <div className="work__meta">
                  <span className="work__index">{String(index + 1).padStart(2, '0')}</span>
                  <span className="work__status">{project.status}</span>
                  <span className="work__year">{project.year}</span>
                </div>
                <div className="work__body">
                  <div className="work__title-row">
                    {project.image ? (
                      <img
                        className="work__icon"
                        src={project.image}
                        alt=""
                        width={40}
                        height={40}
                      />
                    ) : null}
                    <h3>{project.name}</h3>
                  </div>
                  <p>{project.blurb}</p>
                  <ul className="work__stack">
                    {project.stack.map((tech) => (
                      <li key={tech}>{tech}</li>
                    ))}
                  </ul>
                </div>
                <span className="work__arrow" aria-hidden="true">
                  →
                </span>
              </div>
            </a>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default Work
