import { Outlet } from 'react-router-dom'
import { Outline } from '../../components/Outline'

export default function AppLayout() {
  return (
    <Outline title="<AppLayout />">
      <Outlet />
    </Outline>
  )
}
