import { useEffect, useRef } from 'react'

const skills = [
  'HTML5',
  'CSS3',
  'JavaScript',
  'Git & GitHub',
  'Responsive Design',
  'React',
  'Node.js',
  'Python',
  'Flutter',
  'Dart',
  'Firebase',
  'Supabase',
  'Next.js',
  'TypeScript',
  'Tailwind',
  'CSS',
  'Figma',
  'PyTorch',
]

function Skills() {
  const sectionRef = useRef(null)

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
      { threshold: 0.15 }
    )

    fadeElements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section id="skills" className="section skills-section" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title">Skills</h2>
        <p className="section-subtitle">Technologies &amp; tools I work with</p>

        <div className="skills-grid">
          {skills.map((skill) => (
            <div key={skill} className="skill-badge fade-in">
              {skill}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Skills
