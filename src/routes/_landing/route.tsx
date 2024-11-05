import { Outlet } from 'react-router-dom'
import { Outline } from '../../components/Outline'

export default function LandingLayout() {
  return (
    <Outline title="<LandingLayout />">
      <Outlet />
    </Outline>
  )
}
