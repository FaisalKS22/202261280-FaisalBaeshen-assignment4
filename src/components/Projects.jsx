import { useState, useEffect, useRef, useMemo } from 'react'
import volunteerImg from '../assets/image copy.png'
import kashetImg from '../assets/ChatGPT Image Feb 14, 2026, 11_46_25 PM.png'
import taskManagerImg from '../assets/rbnx-task-manager.png'

const projectsData = [
  {
    title: 'Volunteer Work Unit Web',
    description:
      'A streamlined web app that bridges enthusiastic volunteers with impactful events. Centralised hub for event discovery, role selection, and instant registration.',
    tags: ['Next.js', 'Tailwind', 'TypeScript'],
    image: volunteerImg,
    alt: 'Volunteer Work Unit web screenshot',
    date: '2025-09-15',
    level: 'Advanced',
    repo: 'https://github.com/Faisal-M2',
    live: null,
  },
  {
    title: 'Kashet App',
    description:
      'A mobile app to discover, book, and manage camping trips in Saudi Arabia. Reservable spots, essential services, interactive maps, and safety features.',
    tags: ['Flutter', 'Dart', 'Firebase'],
    image: kashetImg,
    alt: 'Kashet App screenshot',
    date: '2025-11-20',
    level: 'Advanced',
    repo: 'https://github.com/Faisal-M2',
    live: null,
  },
  {
    title: 'RoboNexus App',
    description:
      'A student-led platform uniting students, researchers, and companies through robotics challenges, hands-on modules, exhibitions, and interactive zones.',
    tags: ['Flutter', 'Dart', 'Supabase'],
    image: taskManagerImg,
    alt: 'RoboNexus app screenshot',
    date: '2026-01-10',
    level: 'Beginner',
    repo: 'https://github.com/Faisal-M2',
    live: null,
  },
]

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'name-az', label: 'Name A–Z' },
  { value: 'name-za', label: 'Name Z–A' },
]

const filterOptions = ['All', 'Next.js', 'Flutter', 'React', 'Python']

function Projects() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [levelFilter, setLevelFilter] = useState('All')
  const sectionRef = useRef(null)
  const observerRef = useRef(null)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observerRef.current?.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 }
    )
    return () => observerRef.current?.disconnect()
  }, [])

  const filteredProjects = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()

    const filtered = projectsData.filter((project) => {
      const matchesTag =
        activeFilter === 'All' ||
        project.tags.some((tag) => tag.toLowerCase().includes(activeFilter.toLowerCase()))

      const matchesSearch =
        !query ||
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.tags.some((tag) => tag.toLowerCase().includes(query))

      const matchesLevel = levelFilter === 'All' || project.level === levelFilter

      return matchesTag && matchesSearch && matchesLevel
    })

    const sorted = [...filtered]
    switch (sortBy) {
      case 'newest':
        sorted.sort((a, b) => new Date(b.date) - new Date(a.date))
        break
      case 'oldest':
        sorted.sort((a, b) => new Date(a.date) - new Date(b.date))
        break
      case 'name-az':
        sorted.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'name-za':
        sorted.sort((a, b) => b.title.localeCompare(a.title))
        break
    }

    return sorted
  }, [activeFilter, searchQuery, sortBy, levelFilter])

  // Re-observe new fade-in elements every time the filtered list changes.
  // Without this, cards remounted after a filter toggle stay at opacity 0.
  useEffect(() => {
    if (!observerRef.current || !sectionRef.current) return
    const elements = sectionRef.current.querySelectorAll('.fade-in:not(.visible)')
    elements.forEach((el) => observerRef.current.observe(el))
  }, [filteredProjects])

  const handleClearSearch = () => {
    setSearchQuery('')
    setActiveFilter('All')
    setLevelFilter('All')
    setSortBy('newest')
  }

  return (
    <section id="projects" className="section projects-section" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title">Projects</h2>
        <p className="section-subtitle">A few things I've been working on</p>

        <div className="project-controls fade-in">
          <div className="search-wrapper" id="search-wrapper">
            <svg
              className="search-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              id="project-search"
              className="search-input"
              placeholder="Search projects…"
              aria-label="Search projects"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="filter-tags" id="filter-tags">
            {filterOptions.map((filter) => (
              <button
                key={filter}
                className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
                data-filter={filter === 'All' ? 'all' : filter}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="sort-level-controls">
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort projects"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            <select
              className="sort-select"
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              aria-label="Filter by difficulty level"
            >
              <option value="All">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        <div className="projects-grid" id="projects-grid">
          {filteredProjects.map((project) => (
            <article
              key={project.title}
              className="project-card fade-in"
              data-tags={project.tags.join(',')}
            >
              <div className="card-image">
                <img src={project.image} alt={project.alt} loading="lazy" decoding="async" />
              </div>
              <div className="card-body">
                <h3 className="card-title">{project.title}</h3>
                <p className="card-text">{project.description}</p>
                <div className="card-tags">
                  {project.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                  <span className="tag tag-level">{project.level}</span>
                </div>
                <div className="card-footer-row">
                  <p className="card-date">
                    {new Date(project.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                  </p>
                  <div className="card-links">
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="card-link"
                        aria-label={`${project.title} live demo`}
                      >
                        Live ↗
                      </a>
                    )}
                    {project.repo && (
                      <a
                        href={project.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="card-link"
                        aria-label={`${project.title} source code`}
                      >
                        Code ↗
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="empty-state" id="empty-state">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
            <p>No projects found matching your search.</p>
            <button className="btn btn-outline" id="clear-search-btn" onClick={handleClearSearch}>
              Clear Search
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default Projects
