
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { TChildren } from '@/types/global.type'

const Layout = ({ children } : TChildren) => {
  return (

     <DashboardLayout>
        {children}
     </DashboardLayout>

  )
}

export default Layout