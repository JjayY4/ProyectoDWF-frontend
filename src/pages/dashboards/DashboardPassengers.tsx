import { RoleGuard } from '../../guard/RoleGuard';

export default function Dashboard() {
  return (
    <RoleGuard roles={['PASSENGER']}>
      <div className="p-8">
        <h1 className="text-2xl font-bold">Panel de pasajero</h1>
      </div>
    </RoleGuard>
  );
}