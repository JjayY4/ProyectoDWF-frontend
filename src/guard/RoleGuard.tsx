import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

interface Props {
  roles: string[];
  children: React.ReactElement;
}
export const RoleGuard: React.FC<Props> = ({ roles, children }) => {
  const { rol } = useAuth();
  if (!rol) return <Navigate to="/login" />;
  if (!roles.includes(rol)) return <Navigate to="/unauthorized" />;
  return children;
};