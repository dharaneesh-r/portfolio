import { useState } from "react";
import { FaGithub, FaExternalLinkAlt, FaReact, FaNodeJs, FaClock, FaUsers, FaStar, FaRocket, FaChartLine, FaFire } from "react-icons/fa";
import { SiTailwindcss, SiMongodb, SiFirebase, SiNextdotjs, SiExpress } from "react-icons/si";
import { projects, projectCategories } from "../data/projects";

const iconMap = {
  FaReact, FaNodeJs, SiTailwindcss, SiMongodb, SiFirebase, SiNextdotjs, SiExpress
};

const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);

  const filteredProjects = selectedCategory === "All"
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  const featuredProjects = projects.filter(p => p.featured);

  return (
    <div className="min-h-screen bg-dark-900 py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Hero */}
        <div className="text-center mb-20">
          <h1 className="font-heading font-extrabold text-5xl sm:text-6xl md:text-7xl mb-6">
            <span className="gradient-text">Featured Projects</span>
          </h1>
          <p className="text-gray-300 text-xl sm:text-2xl max-w-3xl mx-auto leading-relaxed mb-12">
            Showcasing my <span className="text-primary-500 font-bold">best work</span> and <span className="text-primary-500 font-bold">technical expertise</span>
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className="glass-dark rounded-2xl px-8 py-4 border border-primary-500/30">
              <div className="text-3xl font-bold text-primary-500 mb-1">{projects.length}</div>
              <div className="text-gray-400 text-sm">Total Projects</div>
            </div>
            <div className="glass-dark rounded-2xl px-8 py-4 border border-primary-500/30">
              <div className="text-3xl font-bold text-primary-500 mb-1">{featuredProjects.length}</div>
              <div className="text-gray-400 text-sm">Featured</div>
            </div>
            <div className="glass-dark rounded-2xl px-8 py-4 border border-primary-500/30">
              <div className="text-3xl font-bold text-primary-500 mb-1">{projectCategories.length}</div>
              <div className="text-gray-400 text-sm">Categories</div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setSelectedCategory("All")}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${selectedCategory === "All"
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg scale-105'
                : 'glass-dark text-gray-400 hover:text-white hover:border-primary-500 border border-primary-500/30'
                }`}
            >
              All Projects
            </button>
            {projectCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-semibold transition-all ${selectedCategory === category
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg scale-105'
                  : 'glass-dark text-gray-400 hover:text-white hover:border-primary-500 border border-primary-500/30'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid - Compact 3 Column */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className="glass-dark rounded-2xl overflow-hidden border-2 border-primary-500/30 hover:border-primary-500 transition-all duration-300 group relative flex flex-col"
            >
              {/* Featured Badge */}
              {project.featured && (
                <div className="absolute top-3 right-3 z-10 px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-white text-xs font-bold flex items-center gap-1 shadow-lg">
                  <FaStar />
                  FEATURED
                </div>
              )}

              {/* Project Image/Placeholder - Smaller */}
              <div className="relative h-48 bg-gradient-to-br from-primary-500/20 to-primary-600/20 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent group-hover:from-primary-500/20 transition-all"></div>
                <div className="text-6xl text-primary-500/30 group-hover:scale-110 transition-transform">
                  <FaRocket />
                </div>
                {/* Category Tag */}
                <div className="absolute bottom-3 left-3 px-3 py-1 bg-dark-900/80 backdrop-blur-sm rounded-full text-primary-500 text-xs font-semibold border border-primary-500/30">
                  {project.category}
                </div>
              </div>

              {/* Content - Compact */}
              <div className="p-5 flex-1 flex flex-col">
                {/* Title & Tagline */}
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary-400 transition-colors line-clamp-1">
                  {project.title}
                </h3>
                <p className="text-primary-500 font-semibold text-sm mb-3 line-clamp-1">{project.tagline}</p>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed line-clamp-2 flex-1">
                  {project.description}
                </p>

                {/* Tech Stack - Compact */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack.slice(0, 4).map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-primary-500/10 border border-primary-500/30 rounded text-primary-400 text-xs font-semibold"
                      >
                        {tech.name}
                      </span>
                    ))}
                    {project.techStack.length > 4 && (
                      <span className="px-2 py-1 bg-primary-500/10 border border-primary-500/30 rounded text-primary-400 text-xs font-semibold">
                        +{project.techStack.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                {/* Meta Info - Compact */}
                <div className="flex items-center gap-3 mb-4 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <FaClock className="text-primary-500" />
                    {project.duration}
                  </div>
                  {project.results?.users && (
                    <div className="flex items-center gap-1">
                      <FaUsers className="text-primary-500" />
                      {project.results.users}
                    </div>
                  )}
                </div>

                {/* Actions - Compact */}
                <div className="flex gap-2">
                  {project.links.live && (
                    <a
                      href={project.links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all"
                    >
                      <FaExternalLinkAlt className="text-xs" />
                      Live
                    </a>
                  )}
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="flex items-center justify-center px-4 py-2.5 glass-dark border border-primary-500/30 text-primary-500 text-sm font-semibold rounded-lg hover:border-primary-500 hover:scale-105 transition-all"
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Project Detail Modal */}
        {selectedProject && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedProject(null)}>
            <div className="glass-dark rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-primary-500/30 p-8" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-4xl font-bold text-white mb-2">{selectedProject.title}</h2>
                  <p className="text-primary-500 font-semibold text-lg">{selectedProject.tagline}</p>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="text-gray-400 hover:text-white text-3xl"
                >
                  ×
                </button>
              </div>

              {/* Description */}
              <p className="text-gray-300 mb-8 leading-relaxed">{selectedProject.description}</p>

              {/* Problem & Solution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="glass rounded-xl p-6 border-l-4 border-red-500">
                  <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                    <span className="text-red-500">⚠️</span>
                    Problem
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{selectedProject.problem}</p>
                </div>
                <div className="glass rounded-xl p-6 border-l-4 border-green-500">
                  <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Solution
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{selectedProject.solution}</p>
                </div>
              </div>

              {/* Features */}
              <div className="mb-8">
                <h3 className="text-white font-bold mb-4 text-xl">Key Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedProject.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-gray-300 text-sm">
                      <span className="text-primary-500 mt-1">▸</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Stack */}
              <div className="mb-8">
                <h3 className="text-white font-bold mb-4 text-xl">Technologies Used</h3>
                <div className="flex flex-wrap gap-3">
                  {selectedProject.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-primary-500/10 border border-primary-500/30 rounded-lg text-primary-400 font-semibold"
                    >
                      {tech.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Results */}
              {selectedProject.results?.metrics && selectedProject.results.metrics.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-white font-bold mb-4 text-xl flex items-center gap-2">
                    <FaChartLine className="text-primary-500" />
                    Results & Impact
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedProject.results.metrics.map((metric, idx) => (
                      <div key={idx} className="glass rounded-xl p-4 text-center border border-primary-500/20">
                        <div className="text-3xl font-bold text-primary-500 mb-1">{metric.value}</div>
                        <div className="text-gray-400 text-sm">{metric.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              <div className="flex gap-4">
                {selectedProject.links.live && (
                  <a
                    href={selectedProject.links.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all"
                  >
                    <FaExternalLinkAlt />
                    View Live Project
                  </a>
                )}
                {selectedProject.links.github && (
                  <a
                    href={selectedProject.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-6 py-4 glass-dark border border-primary-500/30 text-white font-bold rounded-xl hover:border-primary-500 hover:scale-105 transition-all"
                  >
                    <FaGithub />
                    View Code
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
