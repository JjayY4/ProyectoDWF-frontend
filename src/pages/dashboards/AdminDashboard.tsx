import { RoleGuard } from "../../guard/RoleGuard";
export default function AdminDashboard() {
  return (
    <RoleGuard roles={['ADMIN']}>
      <div className="p-8">
        <h1 className="text-2xl font-bold">Administración</h1>
      </div>
    </RoleGuard>
  );
}