import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { skillCategories } from "../data/skills";
import { FaCode, FaServer, FaCloud, FaTools, FaStar, FaFire, FaTrophy, FaChartLine } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

const categoryIcons = {
  frontend: FaCode,
  backend: FaServer,
  devops: FaCloud,
  tools: FaTools
};

const Skills = () => {
  const [activeCategory, setActiveCategory] = useState("frontend");
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const skillsGridRef = useRef(null);
  const radarRef = useRef(null);

  useEffect(() => {
    // No entrance animations - everything shows immediately
  }, []);

  // Animate skills when category changes
  useEffect(() => {
    if (skillsGridRef.current) {
      const cards = skillsGridRef.current.querySelectorAll(".skill-card");

      // Only animate progress bars
      cards.forEach((card) => {
        const progressBar = card.querySelector(".progress-fill");
        const level = progressBar?.getAttribute("data-level");
        if (progressBar && level) {
          gsap.fromTo(
            progressBar,
            { width: "0%" },
            { width: `${level}%`, duration: 1, ease: "power2.out" }
          );
        }
      });
    }
  }, [activeCategory]);

  const currentCategory = skillCategories[activeCategory];
  const totalSkills = Object.values(skillCategories).reduce((acc, cat) => acc + cat.skills.length, 0);
  const avgProficiency = Math.round(
    Object.values(skillCategories)
      .flatMap(cat => cat.skills)
      .reduce((acc, skill) => acc + skill.level, 0) / totalSkills
  );

  return (
    <div className="min-h-screen bg-dark-900 py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(249,115,22,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(249,115,22,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Hero Section */}
        <div className="skills-hero text-center mb-20">
          <h1 className="font-heading font-extrabold text-5xl sm:text-6xl md:text-7xl mb-6">
            <span className="gradient-text">Technical Arsenal</span>
          </h1>
          <p className="text-gray-300 text-xl sm:text-2xl max-w-3xl mx-auto leading-relaxed mb-12">
            A comprehensive showcase of my <span className="text-primary-500 font-bold">technical expertise</span> and <span className="text-primary-500 font-bold">proficiency levels</span>
          </p>

          {/* Quick Stats */}
          <div className="stats-section flex flex-wrap justify-center gap-6 mb-16">
            <div className="stat-card glass-dark rounded-2xl px-8 py-6 border border-primary-500/30 hover:border-primary-500 transition-all group">
              <div className="text-4xl font-bold text-primary-500 mb-2 group-hover:scale-110 transition-transform">{totalSkills}+</div>
              <div className="text-gray-400 text-sm">Technologies</div>
            </div>
            <div className="stat-card glass-dark rounded-2xl px-8 py-6 border border-primary-500/30 hover:border-primary-500 transition-all group">
              <div className="text-4xl font-bold text-primary-500 mb-2 group-hover:scale-110 transition-transform">{avgProficiency}%</div>
              <div className="text-gray-400 text-sm">Avg Proficiency</div>
            </div>
            <div className="stat-card glass-dark rounded-2xl px-8 py-6 border border-primary-500/30 hover:border-primary-500 transition-all group">
              <div className="text-4xl font-bold text-primary-500 mb-2 group-hover:scale-110 transition-transform">4</div>
              <div className="text-gray-400 text-sm">Categories</div>
            </div>
            <div className="stat-card glass-dark rounded-2xl px-8 py-6 border border-primary-500/30 hover:border-primary-500 transition-all group">
              <div className="text-4xl font-bold text-green-400 mb-2 group-hover:scale-110 transition-transform">1+</div>
              <div className="text-gray-400 text-sm">Years Experience</div>
            </div>
          </div>
        </div>

        {/* Category Selection - Card Grid */}
        <div className="categories-grid mb-16">
          <h2 className="text-3xl font-heading font-bold text-white mb-8 text-center">Select Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(skillCategories).map(([key, category]) => {
              const Icon = categoryIcons[key];
              const isActive = activeCategory === key;

              return (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={`category-card relative group ${isActive
                    ? 'bg-gradient-to-br from-primary-500 to-primary-600 border-primary-400'
                    : 'glass-dark border-primary-500/30 hover:border-primary-500'
                    } rounded-2xl p-6 border-2 transition-all duration-300 text-left overflow-hidden ${isActive ? 'scale-105 shadow-2xl shadow-primary-500/50' : 'hover:scale-105'
                    }`}
                >
                  {/* Background Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${isActive ? 'from-white/20 to-transparent' : 'from-primary-500/0 to-transparent group-hover:from-primary-500/10'
                    } transition-all duration-300`}></div>

                  <div className="relative z-10">
                    <Icon className={`text-4xl mb-4 ${isActive ? 'text-white' : 'text-primary-500'} group-hover:scale-110 transition-transform`} />
                    <h3 className={`text-xl font-bold mb-2 ${isActive ? 'text-white' : 'text-white'}`}>
                      {category.title}
                    </h3>
                    <p className={`text-sm ${isActive ? 'text-white/90' : 'text-gray-400'}`}>
                      {category.description}
                    </p>
                    <div className={`mt-4 text-sm font-semibold ${isActive ? 'text-white' : 'text-primary-500'}`}>
                      {category.skills.length} Skills
                    </div>
                  </div>

                  {/* Active Indicator */}
                  {isActive && (
                    <div className="absolute top-4 right-4">
                      <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Skills Grid */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-4xl font-heading font-bold text-white flex items-center gap-3">
              <FaTrophy className="text-primary-500" />
              {currentCategory.title}
            </h2>
            <div className="text-gray-400 text-sm">
              {currentCategory.skills.length} skills in this category
            </div>
          </div>

          <div ref={skillsGridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentCategory.skills.map((skill, index) => (
              <div
                key={skill.name}
                className="skill-card glass-dark rounded-2xl p-6 border-2 border-primary-500/30 hover:border-primary-500 transition-all duration-300 relative overflow-hidden group"
                onMouseEnter={() => setHoveredSkill(skill.name)}
                onMouseLeave={() => setHoveredSkill(null)}
              >
                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 to-primary-600/0 group-hover:from-primary-500/10 group-hover:to-primary-600/10 transition-all duration-500"></div>

                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      {/* Skill Icon */}
                      <div className="w-16 h-16 rounded-xl bg-white/10 border border-primary-500/30 flex items-center justify-center p-2 group-hover:scale-110 group-hover:rotate-6 transition-all">
                        <img src={skill.icon} alt={skill.name} className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary-400 transition-colors">
                          {skill.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <FaChartLine className="text-primary-500" />
                          {skill.yearsExp} {skill.yearsExp === 1 ? 'year' : 'years'}
                        </div>
                      </div>
                    </div>

                    {/* Proficiency Badge */}
                    <div className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${skill.level >= 90
                      ? 'bg-green-500/20 text-green-400 border-green-500/50'
                      : skill.level >= 75
                        ? 'bg-blue-500/20 text-blue-400 border-blue-500/50'
                        : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                      }`}>
                      {skill.level >= 90 ? 'Expert' : skill.level >= 75 ? 'Advanced' : 'Intermediate'}
                    </div>
                  </div>

                  {/* Description */}
                  {skill.description && (
                    <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                      {skill.description}
                    </p>
                  )}

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Proficiency</span>
                      <span className="text-sm font-bold text-primary-500">{skill.level}%</span>
                    </div>
                    <div className="h-3 bg-dark-800 rounded-full overflow-hidden border border-primary-500/30">
                      <div
                        className="progress-fill h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full relative overflow-hidden"
                        data-level={skill.level}
                        style={{ width: '0%' }}
                      >
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <FaStar className="text-yellow-400" />
                      <span>{skill.projects} projects</span>
                    </div>
                    {skill.level >= 90 && (
                      <div className="flex items-center gap-1 text-primary-500">
                        <FaFire className="animate-pulse" />
                        <span className="text-xs font-semibold">Top Skill</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 border-2 border-primary-500/0 group-hover:border-primary-500/50 rounded-2xl transition-all duration-300 pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Summary */}
        <div className="glass-dark rounded-3xl p-10 border-2 border-primary-500/30">
          <h2 className="text-3xl font-heading font-bold text-white mb-8 text-center">
            Proficiency Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(skillCategories).map(([key, category]) => {
              const avgLevel = Math.round(
                category.skills.reduce((acc, skill) => acc + skill.level, 0) / category.skills.length
              );
              const Icon = categoryIcons[key];

              return (
                <div key={key} className="text-center group">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-500/20 to-primary-600/20 border-4 border-primary-500/30 flex items-center justify-center relative group-hover:scale-110 transition-transform">
                    <Icon className="text-5xl text-primary-500" />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-500/0 to-primary-600/0 group-hover:from-primary-500/20 group-hover:to-primary-600/20 transition-all"></div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{category.title}</h3>
                  <div className="text-3xl font-bold text-primary-500 mb-1">{avgLevel}%</div>
                  <div className="text-sm text-gray-400">Average Proficiency</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skills;
