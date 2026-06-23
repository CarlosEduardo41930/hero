import Nav from '../Componentes/Nav'
import { Outlet } from 'react-router-dom';

function Layout() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900">
            <Nav />
            <Outlet />
        </div>
    )
}

export default Layout;