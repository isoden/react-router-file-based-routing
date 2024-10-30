import { Outlet } from 'react-router-dom'
import { Nav } from '../components/Nav'
import { Outline } from '../components/Outline'

export default function RootLayout() {
  return (
    <div className="mx-auto grid max-w-5xl gap-y-8">
      <h1 className="text-3xl font-bold">
        React Router with Remix-like file-based routing
      </h1>
      <Nav />
      <Outline title="<RootLayout />">
        <Outlet />
      </Outline>
    </div>
  )
}
