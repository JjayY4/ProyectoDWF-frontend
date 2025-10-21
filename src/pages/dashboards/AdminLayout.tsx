import { Outlet, useLocation } from 'react-router-dom';
import { RoleGuard } from '../../guard/RoleGuard';
import NavMenuAerolineas from '../../pages/dashboards/NavMenuAerolineas';

export default function AdminLayout() {
  const location = useLocation();
  const isAerolineas = location.pathname.startsWith('/admin/aerolineas');

  return (
    <RoleGuard roles={["ADMIN"]}>
      <>
        {isAerolineas && <NavMenuAerolineas />}
        <Outlet />
      </>
    </RoleGuard>
  );
}