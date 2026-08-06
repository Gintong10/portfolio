import { useEffect, useRef, useState } from 'react'
import { projects } from '../data/projects'

function ProjectCard({ project, index }) {
  const [loaded, setLoaded] = useState(false)
  const imgRef = useRef(null)

  useEffect(() => {
    const img = imgRef.current
    if (img?.complete && img.naturalWidth > 0) {
      setLoaded(true)
    }
  }, [project.preview])

  return (
    <li className="work__item">
      <a
        className="work__link"
        href={project.href}
        target="_blank"
        rel="noreferrer"
      >
        <div className="work__media">
          <div
            className={`work__skeleton${loaded ? ' work__skeleton--done' : ''}`}
            aria-hidden="true"
          />
          <img
            ref={imgRef}
            className={`work__preview${project.previewFit === 'contain' ? ' work__preview--contain' : ''}${loaded ? ' work__preview--loaded' : ''}`}
            src={project.preview}
            alt={`${project.name} in action`}
            loading="lazy"
            width={1440}
            height={900}
            onLoad={() => setLoaded(true)}
          />
        </div>
        <div className="work__meta">
          <span className="work__index">{String(index + 1).padStart(2, '0')}</span>
          <span className="work__status">{project.status}</span>
          <span className="work__year">{project.year}</span>
        </div>
        <div className="work__title-row">
          {project.image ? (
            <img
              className="work__icon"
              src={project.image}
              alt=""
              width={32}
              height={32}
            />
          ) : null}
          <h3>{project.name}</h3>
          <span className="work__arrow" aria-hidden="true">
            →
          </span>
        </div>
        <p className="work__blurb">{project.blurb}</p>
        <ul className="work__stack">
          {project.stack.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
      </a>
    </li>
  )
}

function Work() {
  return (
    <section className="section work" id="work">
      <div className="section__head">
        <h2>Things I’ve built and put online.</h2>
      </div>

      <ol className="work__list">
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </ol>
    </section>
  )
}

export default Work
