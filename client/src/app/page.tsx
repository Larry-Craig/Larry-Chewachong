"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { ArrowRight, Mail, Sparkles, Code2, Layers, Cloud, Zap, Loader2, CheckCircle2, ExternalLink, Phone, User, FileText } from "lucide-react";
import { fetchHealthCheck, fetchProjects, fetchSkills, sendContactMessage } from "@/lib/api";

// Inline Brand Icon Helpers
const GithubIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
  </svg>
);

const LinkedinIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

// Contact Form Component
function ContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<{ type: "idle" | "loading" | "success" | "error"; msg?: string }>({ type: "idle" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: "loading" });

    try {
      const res = await sendContactMessage(formData);
      if (res.success) {
        setStatus({ 
          type: "success", 
          msg: "✨ Message delivered successfully! I'll get back to you soon." 
        });
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus({ 
          type: "error", 
          msg: res.error || "Failed to send message. Please try again." 
        });
      }
    } catch (error) {
      setStatus({ 
        type: "error", 
        msg: "Network error. Please check your connection and try again." 
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Your Name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-3 rounded-xl bg-zinc-800/50 border border-zinc-700/60 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
        />
        <input
          type="email"
          placeholder="Your Email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-3 rounded-xl bg-zinc-800/50 border border-zinc-700/60 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
        />
      </div>
      
      <textarea
        placeholder="Your Message"
        rows={4}
        required
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        className="w-full px-4 py-3 rounded-xl bg-zinc-800/50 border border-zinc-700/60 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 resize-none"
      />

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status.type === "loading"}
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-purple-600 text-white font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
        >
          {status.type === "loading" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Mail className="w-4 h-4" />
              Send Message
            </>
          )}
        </button>

        {status.type === "success" && (
          <span className="text-sm text-emerald-400 font-medium flex items-center gap-2 animate-in fade-in slide-in-from-left-4 duration-300">
            <CheckCircle2 className="w-4 h-4" />
            {status.msg}
          </span>
        )}
        {status.type === "error" && (
          <span className="text-sm text-rose-400 font-medium animate-in fade-in slide-in-from-left-4 duration-300">
            {status.msg}
          </span>
        )}
      </div>
    </form>
  );
}

// Skill Icon Mapper
const getSkillIcon = (skillName: string) => {
  const name = skillName.toLowerCase();
  if (name.includes('react') || name.includes('next')) return <Code2 className="w-5 h-5" />;
  if (name.includes('node') || name.includes('express')) return <Zap className="w-5 h-5" />;
  if (name.includes('fastapi') || name.includes('python')) return <Sparkles className="w-5 h-5" />;
  if (name.includes('postgres') || name.includes('sql')) return <Layers className="w-5 h-5" />;
  if (name.includes('docker') || name.includes('cloud')) return <Cloud className="w-5 h-5" />;
  if (name.includes('tailwind') || name.includes('css')) return <Sparkles className="w-5 h-5" />;
  return <Code2 className="w-5 h-5" />;
};

// Skill Color Mapper
const getSkillGradient = (skillName: string) => {
  const name = skillName.toLowerCase();
  if (name.includes('react') || name.includes('next')) return "from-cyan-400 to-blue-500";
  if (name.includes('node') || name.includes('express')) return "from-green-400 to-emerald-500";
  if (name.includes('fastapi') || name.includes('python')) return "from-teal-400 to-cyan-500";
  if (name.includes('postgres') || name.includes('sql')) return "from-blue-400 to-indigo-500";
  if (name.includes('docker') || name.includes('cloud')) return "from-sky-400 to-blue-500";
  if (name.includes('tailwind') || name.includes('css')) return "from-cyan-400 to-teal-500";
  if (name.includes('typescript') || name.includes('js')) return "from-blue-500 to-purple-500";
  if (name.includes('git') || name.includes('github')) return "from-orange-400 to-red-500";
  return "from-blue-400 to-purple-400";
};

interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  liveUrl?: string;
  live_demo_url?: string;
  githubUrl?: string;
  github_url?: string;
}

interface Skill {
  id: number;
  name: string;
  domain: string;
  color: string;
}

export default function Home() {
  const [apiStatus, setApiStatus] = useState<boolean>(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const healthRes = await fetchHealthCheck();
        setApiStatus(healthRes?.status === "OK");

        const [skillsRes, projectsRes] = await Promise.all([
          fetchSkills(),
          fetchProjects()
        ]);
        
        if (skillsRes?.data) setSkills(skillsRes.data);
        if (projectsRes?.data) setProjects(projectsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-2xl animate-pulse">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-800" />
            <div className="w-20 h-4 bg-zinc-800 rounded" />
            <div className="w-16 h-3 bg-zinc-800/50 rounded" />
          </div>
        </div>
      ))}
    </div>
  );

  const ProjectSkeleton = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-8 animate-pulse">
          <div className="space-y-4">
            <div className="flex justify-between">
              <div className="w-32 h-6 bg-zinc-800 rounded" />
              <div className="w-12 h-12 rounded-xl bg-zinc-800" />
            </div>
            <div className="space-y-2">
              <div className="w-full h-4 bg-zinc-800 rounded" />
              <div className="w-3/4 h-4 bg-zinc-800 rounded" />
            </div>
            <div className="flex gap-2">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="w-16 h-6 bg-zinc-800 rounded-full" />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-950 to-zinc-900 text-zinc-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 -left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-32 relative z-10">
        {/* Hero & About Combined Section */}
        <section id="about" className="pt-16 md:pt-24 space-y-8">
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${apiStatus ? "bg-emerald-400" : "bg-blue-400"} opacity-75`} />
                <span className={`relative inline-flex rounded-full h-2 w-2 ${apiStatus ? "bg-emerald-400" : "bg-blue-400"}`} />
              </span>
              {apiStatus ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Backend API Connected
                </>
              ) : (
                "Available for Global Opportunities"
              )}
            </div>
          </div>

          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.1]">
              <span className="block">Full-Stack</span>
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                Software Engineer
              </span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed">
              Designing and deploying scalable web applications, robust REST APIs, 
              and resilient cloud architectures with modern development practices.
            </p>
          </div>

          {/* About Me - Integrated into Hero */}
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 md:p-8 backdrop-blur-sm space-y-4 hover:border-zinc-700 transition-all duration-300 mt-8">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 flex-shrink-0">
                <User className="w-6 h-6" />
              </div>
              <div className="space-y-4">
                <p className="text-zinc-300 leading-relaxed text-base md:text-lg">
                  I'm <span className="text-white font-semibold">Larry Chewachong</span>, a Software Engineering student focused on building high-performance web applications and resilient cloud architectures. With experience across full-stack JavaScript environments (<span className="text-blue-400">React, Next.js, Node.js</span>), microservice backends, and databases, I specialize in engineering systems that solve real-world operational challenges.
                </p>
                <p className="text-zinc-400 leading-relaxed text-sm md:text-base">
                  Beyond writing code and containerizing services with Docker, I bring a keen interest in software architecture, systematic design, and long-term maintainability into every project I build.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    Problem-First Mindset
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    Clean Architecture
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Continuous Growth
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <a
              href="#projects"
              className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold text-sm hover:from-blue-500 hover:to-purple-600 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
            >
              View Featured Projects
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            
            <a
              href="/Chewachong%20Larry%20Che%20CV.pdf"
              download="Chewachong_Larry_Che_CV.pdf"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-zinc-800/80 border border-zinc-700 text-white font-semibold text-sm hover:bg-zinc-700 hover:border-zinc-600 transition-all duration-300 hover:scale-105 shadow-md backdrop-blur-sm"
            >
              <FileText className="w-4 h-4 text-blue-400" />
              Download CV
            </a>

            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-zinc-800/50 border border-zinc-700 font-semibold text-sm hover:bg-zinc-800 hover:border-zinc-600 transition-all duration-300 backdrop-blur-sm"
            >
              <Mail className="w-4 h-4" />
              Contact Me
            </a>
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap items-center gap-4 pt-8 border-t border-zinc-800/50">
            <span className="text-sm text-zinc-500">Connect with me</span>
            {[
              { 
                icon: <GithubIcon className="w-5 h-5" />, 
                href: "https://github.com/Larry-Craig", 
                label: "GitHub" 
              },
              { 
                icon: <LinkedinIcon className="w-5 h-5" />, 
                href: "https://www.linkedin.com/in/chewachong-larry-che-685310345", 
                label: "LinkedIn" 
              },
              { 
                icon: <Mail className="w-5 h-5" />, 
                href: "mailto:chewachongcraig@gmail.com", 
                label: "Email" 
              },
              { 
                icon: <Phone className="w-5 h-5" />, 
                href: "tel:+237678394294", 
                label: "Phone" 
              },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                target={social.href.startsWith('http') ? "_blank" : undefined}
                rel={social.href.startsWith('http') ? "noopener noreferrer" : undefined}
                className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all duration-300 hover:scale-110"
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </section>

        {/* Technical Competency Grid */}
        <section id="skills" className="py-8 space-y-8">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-bold">Technical Competencies</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-zinc-800 to-transparent" />
            {isLoading && (
              <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
            )}
          </div>
          
          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {skills.map((skill, index) => {
                const gradient = getSkillGradient(skill.name);
                return (
                  <div
                    key={skill.id}
                    className="group relative bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl hover:border-zinc-700 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/5 animate-in fade-in slide-in-from-bottom-4"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" 
                         style={{ background: `linear-gradient(135deg, ${gradient.replace('from-', '').replace('to-', '')}10, transparent)` }} />
                    <div className="relative flex flex-col items-center gap-3">
                      <div className={`p-2.5 rounded-xl bg-gradient-to-br ${gradient} text-white/80`}>
                        {getSkillIcon(skill.name)}
                      </div>
                      <span className="text-sm font-medium text-center text-zinc-300 group-hover:text-white transition-colors">
                        {skill.name}
                      </span>
                      <span className="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors">
                        {skill.domain}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Dynamic Featured Projects Section */}
        <section id="projects" className="py-8 space-y-8">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-bold">Featured Projects</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-zinc-800 to-transparent" />
            {isLoading && (
              <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
            )}
          </div>
          
          {isLoading ? (
            <ProjectSkeleton />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => {
                // Check backend properties OR fall back by project title
                const demoUrl = 
                  project.live_demo_url || 
                  project.liveUrl || 
                  (project.title.includes("Emplora") ? "https://github.com/user-attachments/assets/9454f4a8-f2d3-4155-b642-0a4337a42017" :
                   project.title.includes("CAFAD") ? "https://github.com/user-attachments/assets/78947ed5-39fb-49b7-b70b-6c59fdb9995b" :
                   project.title.includes("Delivery") ? "https://delivery-buddy-backend.onrender.com/docs" : "");

                const sourceUrl = project.github_url || project.githubUrl || "https://github.com/Larry-Craig";

                const isVideo = demoUrl?.includes("github.com/user-attachments") || 
                                demoUrl?.includes("youtube") || 
                                demoUrl?.includes(".mp4");

                return (
                  <div
                    key={project.id}
                    className="group relative bg-zinc-900/30 border border-zinc-800 rounded-2xl p-8 hover:border-zinc-700 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/5 animate-in fade-in slide-in-from-bottom-4"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="absolute top-4 right-4 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Code2 className="w-6 h-6 text-zinc-500 group-hover:text-blue-400 transition-colors" />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold group-hover:text-blue-400 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-sm text-zinc-400 leading-relaxed">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <span key={tag} className="text-xs px-3 py-1 rounded-full bg-zinc-800/50 text-zinc-400 border border-zinc-800 hover:border-blue-500/50 transition-colors">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-4 pt-4 border-t border-zinc-800/50">
                        {demoUrl && (
                          <a 
                            href={demoUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1.5 group/link font-medium"
                          >
                            {isVideo ? (
                              <>
                                <span className="p-1 rounded-full bg-rose-500/10 text-rose-400 group-hover/link:bg-rose-500/20 transition-colors">
                                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z"/>
                                  </svg>
                                </span>
                                Watch Demo
                              </>
                            ) : (
                              <>
                                <ExternalLink className="w-3.5 h-3.5 text-blue-400 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                                Live API / Docs
                              </>
                            )}
                          </a>
                        )}

                        {sourceUrl && (
                          <a 
                            href={sourceUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-sm text-zinc-400 hover:text-zinc-300 transition-colors flex items-center gap-1"
                          >
                            <GithubIcon className="w-3.5 h-3.5" /> Source
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Interactive Contact Section */}
        <section id="contact" className="py-8 space-y-8">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-bold">Get In Touch</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-zinc-800 to-transparent" />
          </div>
          
          <div className="relative bg-gradient-to-br from-zinc-900/50 to-zinc-900/30 border border-zinc-800 rounded-2xl p-8 md:p-12 backdrop-blur-sm hover:border-zinc-700 transition-all duration-300">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
            <div className="relative space-y-6 max-w-2xl">
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold">Let's Build Something Together</h3>
                <p className="text-lg text-zinc-400 leading-relaxed">
                  Interested in collaborating or have a role available? Drop a message below and it will route directly to my inbox and database!
                </p>
              </div>

              <ContactForm />
              
              {/* Direct Contact Information */}
              <div className="pt-4 border-t border-zinc-800/50">
                <p className="text-sm text-zinc-500 mb-3">Or reach me directly:</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <a 
                    href="mailto:chewachongcraig@gmail.com" 
                    className="text-zinc-400 hover:text-blue-400 transition-colors flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    chewachongcraig@gmail.com
                  </a>
                  <a 
                    href="tel:+237678394294" 
                    className="text-zinc-400 hover:text-blue-400 transition-colors flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    +237 678 394 294
                  </a>
                  <span className="text-zinc-600">|</span>
                  <a 
                    href="tel:+237677071986" 
                    className="text-zinc-400 hover:text-blue-400 transition-colors flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    +237 677 071 986
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
          <span>© 2026 Larry Chewachong. </span>
          <div className="flex items-center gap-6">
            <a 
              href="https://github.com/Larry-Craig" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <GithubIcon className="w-4 h-4" />
              GitHub
            </a>
            <a 
              href="https://www.linkedin.com/in/chewachong-larry-che-685310345" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <LinkedinIcon className="w-4 h-4" />
              LinkedIn
            </a>
            <a 
              href="mailto:chewachongcraig@gmail.com" 
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Mail className="w-4 h-4" />
              Email
            </a>
            <a 
              href="/Chewachong%20Larry%20Che%20CV.pdf" 
              download="Chewachong_Larry_Che_CV.pdf"
              className="hover:text-white transition-colors flex items-center gap-1 text-blue-400 font-medium"
            >
              <FileText className="w-3.5 h-3.5" />
              Resume CV
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}