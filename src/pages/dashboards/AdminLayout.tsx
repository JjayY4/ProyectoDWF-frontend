import { Outlet } from "react-router-dom";
import { RoleGuard } from "../../guard/RoleGuard";

export default function AdminLayout() {
  return (
    <RoleGuard roles={["ADMIN"]}>
        <Outlet/>
    </RoleGuard>
  );
}