const projectData = [
    { title: "singchinese", description: "Helps you learn Chinese songs", link: "https://singchinese.online"}
];

function Projects(){
    return (
        <section>
            <h2>Projects</h2>
            {projectData.map((project, i) => (
                <div key={i} className = "project-card">
                    <h3><a href={project.link}>{project.title}</a></h3>
                    <p>{project.description}</p>
                </div>
            ))}
        </section>
    );
}

export default Projects;