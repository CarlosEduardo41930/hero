import Nav from '../Componentes/Nav'
import { Outlet } from 'react-router-dom';

function Layout() {
    return(
        <div className="min-h-screen">
        <Nav />
        <Outlet />
        </div>
    )
}

export default Layout;