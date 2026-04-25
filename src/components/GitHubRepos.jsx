import { useState, useEffect, useRef, useMemo } from 'react'

const GITHUB_USERNAME = 'Faisal-M2'
const API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`

// Language color mapping (matches GitHub's language colors)
const LANG_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Dart: '#00B4AB',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  Shell: '#89e051',
  Kotlin: '#A97BFF',
  Swift: '#F05138',
  Go: '#00ADD8',
  Rust: '#dea584',
  PHP: '#4F5D95',
  Ruby: '#701516',
  Vue: '#41b883',
  SCSS: '#c6538c',
}

function GitHubRepos() {
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    async function fetchRepos() {
      try {
        const response = await fetch(API_URL)
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const data = await response.json()

        // Show all repos, sort by stars then updated
        const sorted = data
          .sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.updated_at) - new Date(a.updated_at))

        setRepos(sorted)
      } catch (err) {
        console.error('Failed to fetch GitHub repos:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchRepos()
  }, [])

  // Scroll fade-in observer
  useEffect(() => {
    const fadeElements = sectionRef.current?.querySelectorAll('.fade-in')
    if (!fadeElements) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )

    fadeElements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [repos])

  function formatDate(dateStr) {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const stats = useMemo(() => {
    if (!repos.length) return null
    const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0)
    const totalForks = repos.reduce((sum, r) => sum + (r.forks_count || 0), 0)
    const langCounts = repos.reduce((acc, r) => {
      if (!r.language) return acc
      acc[r.language] = (acc[r.language] || 0) + 1
      return acc
    }, {})
    const topLang =
      Object.entries(langCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'
    return { totalRepos: repos.length, totalStars, totalForks, topLang }
  }, [repos])

  return (
    <section id="github-repos" className="section repos-section" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title">GitHub Repositories</h2>
        <p className="section-subtitle">
          My open-source work on{' '}
          <a
            href={`https://github.com/${GITHUB_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="github-profile-link"
          >
            @{GITHUB_USERNAME}
          </a>
        </p>

        {/* Loading state */}
        {loading && (
          <div className="repos-loading">
            <span className="spinner"></span>
            <p>Fetching repositories...</p>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="repos-error">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p>Couldn't load repositories right now.</p>
            <button className="btn btn-outline" onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        )}

        {/* Empty state – no repos found */}
        {!loading && !error && repos.length === 0 && (
          <div className="repos-empty fade-in">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
            <p>No public repositories yet.</p>
            <a
              href={`https://github.com/${GITHUB_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              Visit GitHub Profile
            </a>
          </div>
        )}

        {/* Stats summary */}
        {!loading && !error && stats && (
          <div className="repos-stats fade-in" aria-label="GitHub overview">
            <div className="repos-stat">
              <span className="repos-stat-num">{stats.totalRepos}</span>
              <span className="repos-stat-label">Repositories</span>
            </div>
            <div className="repos-stat">
              <span className="repos-stat-num">{stats.totalStars}</span>
              <span className="repos-stat-label">Stars earned</span>
            </div>
            <div className="repos-stat">
              <span className="repos-stat-num">{stats.totalForks}</span>
              <span className="repos-stat-label">Forks</span>
            </div>
            <div className="repos-stat">
              <span className="repos-stat-num">{stats.topLang}</span>
              <span className="repos-stat-label">Top language</span>
            </div>
          </div>
        )}

        {/* Repos grid */}
        {!loading && !error && repos.length > 0 && (
          <div className="repos-grid">
            {repos.map((repo, index) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="repo-card fade-in"
                style={{ transitionDelay: `${Math.min(index * 0.08, 0.5)}s` }}
              >
                {/* Card header */}
                <div className="repo-card-header">
                  <svg className="repo-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                    <path d="M9 18c-4.51 2-5-2-7-2" />
                  </svg>
                  <h3 className="repo-name">{repo.name}</h3>
                  <div className="repo-header-badges">
                    {repo.fork && <span className="repo-fork-badge">Fork</span>}
                    <span className="repo-visibility">{repo.private ? 'Private' : 'Public'}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="repo-description">
                  {repo.description || 'No description provided'}
                </p>

                {/* Card footer */}
                <div className="repo-card-footer">
                  <div className="repo-meta">
                    {repo.language && (
                      <span className="repo-lang">
                        <span
                          className="lang-dot"
                          style={{ backgroundColor: LANG_COLORS[repo.language] || '#858585' }}
                        ></span>
                        {repo.language}
                      </span>
                    )}
                    <span className="repo-stat" title="Stars">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                        strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      {repo.stargazers_count}
                    </span>
                    <span className="repo-stat" title="Forks">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                        strokeLinejoin="round">
                        <circle cx="12" cy="18" r="3" />
                        <circle cx="6" cy="6" r="3" />
                        <circle cx="18" cy="6" r="3" />
                        <path d="M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9" />
                        <path d="M12 12v3" />
                      </svg>
                      {repo.forks_count}
                    </span>
                  </div>
                  <span className="repo-updated">Updated {formatDate(repo.updated_at)}</span>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* View all on GitHub */}
        {!loading && !error && repos.length > 0 && (
          <div className="repos-cta">
            <a
              href={`https://github.com/${GITHUB_USERNAME}?tab=repositories`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.41 7.86 10.94.58.1.79-.25.79-.56
                0-.27-.01-1.17-.02-2.13-3.2.7-3.87-1.38-3.87-1.38-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72
                .08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26
                .73-1.55-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46
                .11-3.05 0 0 .97-.31 3.18 1.19a10.93 10.93 0 0 1 5.8 0c2.2-1.5 3.17-1.19 3.17-1.19
                .63 1.59.24 2.76.12 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.41-5.27 5.7.42.36
                .79 1.06.79 2.14 0 1.55-.01 2.8-.01 3.18 0 .31.21.67.8.55A11.52 11.52 0 0 0 23.5
                12C23.5 5.65 18.35.5 12 .5z" />
              </svg>
              View All on GitHub
            </a>
          </div>
        )}
      </div>
    </section>
  )
}

export default GitHubRepos
