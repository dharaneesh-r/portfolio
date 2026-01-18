import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { personalInfo } from "../data/personal";
import { education } from "../data/education";
import { experiences } from "../data/experience";
import { FaBriefcase, FaGraduationCap, FaMapMarkerAlt, FaCalendarAlt, FaAward, FaBuilding, FaChevronLeft, FaChevronRight, FaCode, FaRocket, FaLightbulb, FaTrophy, FaStar } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

const AboutMe = () => {
  const [currentExpIndex, setCurrentExpIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const experienceRef = useRef(null);

  useEffect(() => {
    // Hero entrance
    const heroTl = gsap.timeline();
    heroTl
      .from(".hero-title", {
        opacity: 0,
        scale: 0.8,
        y: -50,
        duration: 0.8,
        ease: "back.out(1.5)"
      })
      .from(".hero-subtitle", {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.4")
      .from(".hero-stats", {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.5,
        ease: "back.out(1.5)"
      }, "-=0.3");

    // Bio cards
    gsap.from(".bio-card", {
      scrollTrigger: {
        trigger: ".bio-section",
        start: "top 75%",
      },
      opacity: 0,
      y: 50,
      stagger: 0.15,
      duration: 0.8,
      ease: "power2.out"
    });

    // Floating profile
    gsap.to(".profile-circle", {
      y: -10,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }, []);

  const nextExperience = () => {
    if (currentExpIndex < experiences.length - 1) {
      gsap.to(experienceRef.current, {
        opacity: 0,
        x: -50,
        duration: 0.3,
        onComplete: () => {
          setCurrentExpIndex(currentExpIndex + 1);
          gsap.fromTo(experienceRef.current,
            { opacity: 0, x: 50 },
            { opacity: 1, x: 0, duration: 0.3 }
          );
        }
      });
    }
  };

  const prevExperience = () => {
    if (currentExpIndex > 0) {
      gsap.to(experienceRef.current, {
        opacity: 0,
        x: 50,
        duration: 0.3,
        onComplete: () => {
          setCurrentExpIndex(currentExpIndex - 1);
          gsap.fromTo(experienceRef.current,
            { opacity: 0, x: -50 },
            { opacity: 1, x: 0, duration: 0.3 }
          );
        }
      });
    }
  };

  const currentExp = experiences[currentExpIndex];

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
          <h1 className="hero-title font-heading font-extrabold text-5xl sm:text-6xl md:text-7xl mb-6">
            <span className="gradient-text">About Me</span>
          </h1>
          <p className="hero-subtitle text-gray-300 text-xl sm:text-2xl max-w-4xl mx-auto leading-relaxed mb-12">
            Passionate <span className="text-primary-500 font-bold">Full Stack Developer</span> crafting scalable solutions
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6">
            <div className="hero-stats glass-dark rounded-2xl px-8 py-4 border border-primary-500/30">
              <div className="text-3xl font-bold text-primary-500 mb-1">1+</div>
              <div className="text-gray-400 text-sm">Years Exp</div>
            </div>
            <div className="hero-stats glass-dark rounded-2xl px-8 py-4 border border-primary-500/30">
              <div className="text-3xl font-bold text-primary-500 mb-1">2</div>
              <div className="text-gray-400 text-sm">Companies</div>
            </div>
            <div className="hero-stats glass-dark rounded-2xl px-8 py-4 border border-primary-500/30">
              <div className="text-3xl font-bold text-primary-500 mb-1">15+</div>
              <div className="text-gray-400 text-sm">Projects</div>
            </div>
            <div className="hero-stats glass-dark rounded-2xl px-8 py-4 border border-primary-500/30">
              <div className="text-3xl font-bold text-green-400 mb-1">100%</div>
              <div className="text-gray-400 text-sm">Dedicated</div>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="bio-section mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="bio-card lg:col-span-1">
              <div className="glass-dark rounded-3xl p-8 text-center relative overflow-hidden group border border-primary-500/20">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="profile-circle w-48 h-48 mx-auto rounded-full bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 flex items-center justify-center text-white text-7xl font-bold mb-6 relative shadow-2xl">
                  {personalInfo.name.charAt(0)}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/30 to-transparent"></div>
                  <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/50 to-primary-600/50 rounded-full blur-2xl -z-10 animate-pulse"></div>
                </div>

                <h2 className="text-3xl font-bold text-white mb-2">{personalInfo.fullName}</h2>
                <p className="text-primary-500 font-bold text-xl mb-6 flex items-center justify-center gap-2">
                  <FaCode />
                  {personalInfo.role}
                </p>

                <div className="space-y-3 text-gray-300 text-sm">
                  <p className="flex items-center justify-center gap-2">
                    <FaMapMarkerAlt className="text-primary-500" />
                    {personalInfo.location}
                  </p>
                  <p>{personalInfo.email}</p>
                  <p>{personalInfo.phone}</p>
                </div>
              </div>
            </div>

            {/* Bio Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tabs */}
              <div className="bio-card flex gap-2 p-2 glass-dark rounded-2xl border border-primary-500/20">
                {['overview', 'skills', 'focus'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === tab
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="bio-card glass-dark rounded-2xl p-8 border border-primary-500/20">
                {activeTab === 'overview' && (
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                      <FaLightbulb className="text-primary-500" />
                      Professional Summary
                    </h3>
                    <p className="text-gray-300 text-lg leading-relaxed mb-8">
                      {personalInfo.bio.short}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {personalInfo.bio.long.slice(0, 4).map((paragraph, index) => (
                        <div key={index} className="glass rounded-xl p-5 border-l-4 border-primary-500 bg-gradient-to-r from-primary-500/10 to-transparent hover:from-primary-500/20 transition-all">
                          <p className="text-gray-300 text-sm leading-relaxed">{paragraph}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'skills' && (
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                      <FaTrophy className="text-primary-500" />
                      Core Competencies
                    </h3>
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-white font-semibold mb-3">Frontend</h4>
                        <div className="flex flex-wrap gap-2">
                          {['React.js', 'Redux', 'JavaScript (ES6+)', 'HTML5', 'CSS3', 'Tailwind CSS', 'Grommet'].map((tech, idx) => (
                            <span key={idx} className="px-4 py-2 bg-blue-500/20 border border-blue-500/40 rounded-lg text-blue-400 text-sm font-semibold">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-3">Backend</h4>
                        <div className="flex flex-wrap gap-2">
                          {['Node.js', 'Express.js', 'MongoDB', 'DynamoDB', 'REST APIs', 'Elasticsearch', 'Kibana'].map((tech, idx) => (
                            <span key={idx} className="px-4 py-2 bg-green-500/20 border border-green-500/40 rounded-lg text-green-400 text-sm font-semibold">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-3">Cloud & DevOps</h4>
                        <div className="flex flex-wrap gap-2">
                          {['AWS (EC2, S3, ECS)', 'Docker', 'Kubernetes', 'CI/CD', 'CloudWatch', 'GitHub Actions', 'Jenkins'].map((tech, idx) => (
                            <span key={idx} className="px-4 py-2 bg-purple-500/20 border border-purple-500/40 rounded-lg text-purple-400 text-sm font-semibold">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'focus' && (
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                      <FaRocket className="text-primary-500" />
                      Current Focus
                    </h3>
                    <div className="glass rounded-xl p-6 border-l-4 border-primary-500 bg-gradient-to-r from-primary-500/20 to-transparent mb-6">
                      <p className="text-white font-semibold text-xl mb-2">{personalInfo.currentFocus}</p>
                      <p className="text-gray-400">Continuously learning and growing</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {personalInfo.interests.map((interest, idx) => (
                        <div key={idx} className="glass-dark rounded-lg p-4 border border-primary-500/30 hover:border-primary-500 transition-all group">
                          <FaStar className="text-primary-500 mb-2 group-hover:scale-125 transition-transform" />
                          <p className="text-white font-medium">{interest}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Experience Carousel */}
        <div className="mb-24">
          <h2 className="text-4xl font-heading font-bold text-white mb-12 text-center flex items-center justify-center gap-3">
            <FaBriefcase className="text-primary-500" />
            Professional Journey
          </h2>

          <div className="relative">
            {/* Navigation */}
            <button
              onClick={prevExperience}
              disabled={currentExpIndex === 0}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-20 w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white flex items-center justify-center hover:scale-110 disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              <FaChevronLeft />
            </button>

            <button
              onClick={nextExperience}
              disabled={currentExpIndex === experiences.length - 1}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-20 w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white flex items-center justify-center hover:scale-110 disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              <FaChevronRight />
            </button>

            {/* Experience Card */}
            <div ref={experienceRef} className="glass-dark rounded-2xl p-10 border-2 border-primary-500/30 relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary-500/5 to-transparent rounded-full blur-3xl"></div>

              <div className="relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
                  <div className="flex-1">
                    <div className="inline-block px-4 py-1 bg-primary-500/20 rounded-full text-primary-400 text-sm font-semibold mb-3">
                      {currentExpIndex + 1} of {experiences.length}
                    </div>
                    <h3 className="text-4xl font-bold text-white mb-3">{currentExp.role}</h3>
                    <p className="text-primary-500 font-semibold text-2xl mb-3 flex items-center gap-2">
                      <FaBuilding />
                      {currentExp.company}
                    </p>
                    {currentExp.client && (
                      <div className="glass rounded-xl p-4 border-l-4 border-primary-500 bg-gradient-to-r from-primary-500/25 to-transparent mb-4 max-w-2xl">
                        <p className="text-xs text-primary-300 mb-1 uppercase tracking-wide font-bold">Client Project</p>
                        <p className="text-white font-bold text-lg">{currentExp.client}</p>
                      </div>
                    )}
                  </div>
                  <div className="text-gray-400 text-sm md:text-right mt-4 md:mt-0 md:ml-6">
                    <p className="flex items-center gap-2 md:justify-end mb-2">
                      <FaCalendarAlt className="text-primary-500" />
                      <span className="text-white font-semibold">{currentExp.duration}</span>
                    </p>
                    <p className="flex items-center gap-2 md:justify-end mb-3">
                      <FaMapMarkerAlt className="text-primary-500" />
                      {currentExp.location}
                    </p>
                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${currentExp.current
                      ? 'bg-green-500/20 text-green-400 border-2 border-green-500/50 animate-pulse'
                      : 'bg-gray-500/20 text-gray-400'
                      }`}>
                      {currentExp.current ? '● CURRENT' : currentExp.type}
                    </span>
                  </div>
                </div>

                <p className="text-gray-300 text-lg mb-8 leading-relaxed">{currentExp.description}</p>

                {/* Responsibilities */}
                <div className="mb-8">
                  <h4 className="text-white font-bold mb-4 text-xl flex items-center gap-2">
                    <span className="w-1 h-6 bg-primary-500 rounded"></span>
                    Key Responsibilities
                  </h4>
                  <div className="space-y-2">
                    {currentExp.responsibilities.map((resp, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                        <span className="text-primary-500 mt-1 font-bold">▸</span>
                        <span className="text-gray-300 flex-1">{resp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                {currentExp.achievements && currentExp.achievements.length > 0 && (
                  <div className="mb-8 bg-gradient-to-r from-green-500/10 to-transparent rounded-xl p-6 border border-green-500/30">
                    <h4 className="text-white font-bold mb-4 text-xl flex items-center gap-2">
                      <FaAward className="text-green-400 text-2xl" />
                      Key Achievements
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {currentExp.achievements.map((achievement, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-green-500/5">
                          <span className="text-green-400 mt-1 font-bold">✓</span>
                          <span className="text-gray-300 flex-1">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Technologies */}
                <div>
                  <h4 className="text-white font-bold mb-4 text-xl flex items-center gap-2">
                    <span className="w-1 h-6 bg-primary-500 rounded"></span>
                    Technologies & Tools
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {currentExp.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-gradient-to-r from-primary-500/20 to-primary-600/20 border border-primary-500/40 rounded-lg text-primary-400 text-sm font-semibold hover:bg-primary-500/30 hover:scale-105 transition-all"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {experiences.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    gsap.to(experienceRef.current, {
                      opacity: 0,
                      scale: 0.95,
                      duration: 0.2,
                      onComplete: () => {
                        setCurrentExpIndex(idx);
                        gsap.fromTo(experienceRef.current,
                          { opacity: 0, scale: 0.95 },
                          { opacity: 1, scale: 1, duration: 0.2 }
                        );
                      }
                    });
                  }}
                  className={`h-2 rounded-full transition-all ${idx === currentExpIndex
                    ? 'w-8 bg-primary-500'
                    : 'w-2 bg-gray-600 hover:bg-gray-500'
                    }`}
                />
              ))}
            </div>
          </div>
        </div>


        {/* Education Timeline */}
        <div className="mb-24">
          <h2 className="text-4xl font-heading font-bold text-white mb-12 text-center flex items-center justify-center gap-3">
            <FaGraduationCap className="text-primary-500" />
            Academic Journey
          </h2>

          <div className="relative max-w-5xl mx-auto">
            {/* Vertical Timeline Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 via-primary-600 to-transparent"></div>

            <div className="space-y-16">
              {education.map((edu, index) => (
                <div key={edu.id} className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  {/* Timeline Dot */}
                  <div className="absolute left-8 md:left-1/2 w-8 h-8 -ml-4 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full border-4 border-dark-900 shadow-lg shadow-primary-500/50 z-10 flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  </div>

                  {/* Content Card */}
                  <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-16' : 'md:pl-16'} pl-20 md:pl-0`}>
                    <div className="glass-dark rounded-2xl p-8 hover:bg-white/5 transition-all duration-300 border-2 border-primary-500/30 hover:border-primary-500/60 shadow-xl relative group">
                      {/* Connecting Line to Dot */}
                      <div className={`hidden md:block absolute top-1/2 ${index % 2 === 0 ? 'right-0 translate-x-full' : 'left-0 -translate-x-full'} w-16 h-0.5 bg-gradient-to-r ${index % 2 === 0 ? 'from-primary-500/50 to-transparent' : 'from-transparent to-primary-500/50'}`}></div>

                      {/* Year Badge */}
                      <div className="absolute -top-4 left-8 px-4 py-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full text-white text-sm font-bold shadow-lg">
                        {edu.startYear} - {edu.endYear}
                      </div>

                      <div className="mt-4">
                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-primary-400 transition-colors">{edu.degree}</h3>
                        <p className="text-primary-500 font-semibold text-lg mb-3 flex items-center gap-2">
                          <FaGraduationCap />
                          {edu.institution}
                        </p>

                        <div className="flex flex-wrap gap-3 mb-4">
                          {edu.field && (
                            <span className="text-gray-400 text-sm">
                              <span className="text-primary-500 font-semibold">Field:</span> {edu.field}
                            </span>
                          )}
                          <span className="flex items-center gap-2 text-sm text-gray-400">
                            <FaMapMarkerAlt className="text-primary-500" />
                            {edu.location}
                          </span>
                          {edu.grade && (
                            <span className="text-white font-bold text-sm bg-primary-500/20 px-3 py-1 rounded-full">
                              {edu.grade}
                            </span>
                          )}
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${edu.status.includes('Pursuing')
                              ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                              : 'bg-green-500/20 text-green-400 border-green-500/40'
                            }`}>
                            {edu.status}
                          </span>
                        </div>

                        <p className="text-gray-300 mb-6 leading-relaxed">{edu.description}</p>

                        {/* Achievements */}
                        {edu.achievements && edu.achievements.length > 0 && (
                          <div className="mb-6">
                            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                              <FaAward className="text-primary-500" />
                              Highlights
                            </h4>
                            <ul className="space-y-2">
                              {edu.achievements.map((achievement, idx) => (
                                <li key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                                  <span className="text-primary-500 mt-1">•</span>
                                  <span>{achievement}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Coursework */}
                        {edu.coursework && edu.coursework.length > 0 && (
                          <div>
                            <h4 className="text-white font-semibold mb-3">Relevant Coursework</h4>
                            <div className="flex flex-wrap gap-2">
                              {edu.coursework.map((course, idx) => (
                                <span key={idx} className="px-3 py-1.5 bg-primary-500/10 border border-primary-500/30 rounded-lg text-primary-400 text-xs font-medium hover:bg-primary-500/20 transition-colors">
                                  {course}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>


        {/* Highlights */}
        <div className="mb-20">
          <h2 className="text-4xl font-heading font-bold text-white mb-12 text-center">Career Highlights</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {personalInfo.highlights.map((highlight, index) => (
              <div key={index} className="glass-dark rounded-xl p-6 text-center hover:bg-primary-500/10 hover:border-primary-500 border border-transparent transition-all group">
                <div className="text-4xl mb-3 group-hover:scale-125 transition-transform">✨</div>
                <p className="text-white font-semibold text-sm">{highlight}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <a
            href={personalInfo.resume.url}
            download={personalInfo.resume.filename}
            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold text-lg rounded-full hover:shadow-[0_0_50px_rgba(249,115,22,0.8)] hover:scale-110 transition-all duration-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download My Resume
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutMe;
