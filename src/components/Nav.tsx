import { NavLink } from 'react-router-dom'

export function Nav() {
  return (
    <nav>
      {linkList.map((links, i) => (
        <ul key={i} className="flex flex-wrap gap-x-4 py-2">
          {links.map((link, j) => (
            <li key={j}>
              <NavLink
                to={link.to}
                end
                className={({ isActive }) =>
                  `text-blue-500 underline hover:no-underline ${isActive ? 'font-bold' : ''}`
                }
              >
                <span className="pr-1">{link.to}</span>(
                <code className="rounded p-0.5 text-sm">{link.filename}</code>)
              </NavLink>
            </li>
          ))}
        </ul>
      ))}
    </nav>
  )
}

const linkList = [
  [
    { to: '/', filename: '_index' },
    { to: '/route', filename: 'route' },
    { to: '/about', filename: '_landing.about/route' },
    { to: '/not-found', filename: '404' },
  ],
  [
    { to: '/login', filename: '_auth.login' },
    { to: '/register', filename: '_auth.register' },
  ],
  [
    { to: '/concerts', filename: 'concerts._index' },
    { to: '/concerts/new-york', filename: 'concerts.$city' },
    { to: '/concerts/trending', filename: 'concerts.trending' },
    { to: '/concerts/mine', filename: 'concerts_.mine' },
  ],
  [
    { to: '/files', filename: 'files.$' },
    { to: '/files/talks/remix-conf_old.pdf', filename: 'files.$' },
    { to: '/files/talks/remix-conf_final.pdf', filename: 'files.$' },
    {
      to: '/files/talks/remix-conf-FINAL-MAY_2022.pdf',
      filename: 'files.$',
    },
  ],
  [
    { to: '/optional/categories', filename: '($lang).categories' },
    { to: '/optional/en/categories', filename: '($lang).categories' },
    { to: '/optional/fr/categories', filename: '($lang).categories' },
    {
      to: '/optional/en/american-flag-speedo',
      filename: '($lang).$productId',
    },
    {
      to: '/optional/fr/american-flag-speedo',
      filename: '($lang).$productId',
    },
  ],
  [
    { to: '/app', filename: 'app._index/route' },
    { to: '/app/projects', filename: 'app.projects/route' },
    {
      to: '/app/projects/1/roadmap',
      filename: 'app.projects.$id.roadmap/route',
    },
  ],
]
