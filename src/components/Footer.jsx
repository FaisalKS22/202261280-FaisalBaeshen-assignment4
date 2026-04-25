function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-left">
          <p>&copy; {year} Faisal Baeshen. All rights reserved.</p>
          <p className="footer-meta">
            Built with React, Vite & lots of <span aria-label="coffee">☕</span>.
            Tip: press <kbd>Ctrl</kbd>+<kbd>K</kbd> for the command palette.
          </p>
        </div>
        <div className="social-links">
          <a href="https://github.com/Faisal-M2" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.41 7.86 10.94.58.1.79-.25.79-.56
              0-.27-.01-1.17-.02-2.13-3.2.7-3.87-1.38-3.87-1.38-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72
              .08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26
              .73-1.55-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46
              .11-3.05 0 0 .97-.31 3.18 1.19a10.93 10.93 0 0 1 5.8 0c2.2-1.5 3.17-1.19 3.17-1.19
              .63 1.59.24 2.76.12 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.41-5.27 5.7.42.36
              .79 1.06.79 2.14 0 1.55-.01 2.8-.01 3.18 0 .31.21.67.8.55A11.52 11.52 0 0 0 23.5
              12C23.5 5.65 18.35.5 12 .5z" />
            </svg>
          </a>
          <a href="https://www.linkedin.com/in/faisal-baeshen/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24
              5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.27c-.97 0-1.75-.79-1.75-1.76
              s.78-1.76 1.75-1.76 1.75.79 1.75 1.76-.78 1.76-1.75 1.76zm13.5 11.27h-3v-5.6
              c0-3.37-4-3.12-4 0v5.6h-3v-10h3v1.77c1.4-2.59 7-2.78 7 2.48v5.75z" />
            </svg>
          </a>
          <a href="mailto:faisal.baeshen@kfupm.edu.sa" aria-label="Email">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
