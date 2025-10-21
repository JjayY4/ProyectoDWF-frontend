import { RoleGuard } from "../../guard/RoleGuard";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Building2, Plane, Users2, MessageSquare } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useState } from "react";
import UserProfile from "../../components/profile/userProfile";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [open, setOpen] = useState(false);

  const sections = [
    {
      title: "Gestión de Aerolíneas",
      icon: <Building2 className="h-10 w-10 text-blue-500" />,
      description: "Administra las aerolíneas registradas en el sistema.",
      link: "/admin/aerolineas",
      color: "from-blue-100 to-blue-50 hover:from-blue-200 hover:to-blue-100",
    },
    {
      title: "Gestión de Vuelos",
      icon: <Plane className="h-10 w-10 text-indigo-500" />,
      description: "Crea, edita y controla los vuelos disponibles.",
      link: "/admin/vuelos",
      color: "from-indigo-100 to-indigo-50 hover:from-indigo-200 hover:to-indigo-100",
    },
    {
      title: "Aviones y Tripulación",
      icon: <Users2 className="h-10 w-10 text-emerald-500" />,
      description: "Gestiona los aviones y el personal asignado.",
      link: "/admin/tripulacion",
      color: "from-emerald-100 to-emerald-50 hover:from-emerald-200 hover:to-emerald-100",
    },
    {
      title: "Reclamos y Sugerencias",
      icon: <MessageSquare className="h-10 w-10 text-rose-500" />,
      description: "Revisa y responde los reclamos de los pasajeros.",
      link: "/admin/reclamos",
      color: "from-rose-100 to-rose-50 hover:from-rose-200 hover:to-rose-100",
    },
  ];

  return (
    <RoleGuard roles={["ADMIN"]}>
      <div className="min-h-screen bg-gray-50 p-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          Panel de Administración
        </h1>
                <p className="text-lg text-gray-600 mb-8 text-center">
          <button
            onClick={() => setOpen(true)}
            className="underline hover:text-blue-600 transition font-medium"
          >
            {user?.name || 'Usuario'}
          </button>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sections.map((section, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(section.link)}
              className={`cursor-pointer bg-gradient-to-br ${section.color} rounded-2xl shadow-md transition-all`}
            >
              <Card className="border-0 bg-transparent shadow-none">
                <CardHeader className="flex flex-col items-center text-center">
                  {section.icon}
                  <CardTitle className="mt-3 text-lg font-semibold text-gray-800">
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center text-sm text-gray-600 px-4 pb-6">
                  {section.description}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <UserProfile open={open} onClose={() => setOpen(false)} />
      </div>
    </RoleGuard>
  );
}