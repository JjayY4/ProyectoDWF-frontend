import { useAuthStore } from '../store/authStore';
import { useState, useEffect } from 'react';
import Banner from '../components/Index/Banner';
import UserProfile from '../components/profile/userProfile';

export default function IndexLogged() {
  const user = useAuthStore((s) => s.user);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    console.log('Usuario en IndexLogged:', user);
    console.log('Todo el store:', useAuthStore.getState());
  }, [user]);

  return (
    <div className="min-h-screen bg-sky-50">
      <header className="bg-sky-600 text-white">
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
            Explora el Mundo
            {user && (
              <>, <button
                onClick={() => setOpen(true)}
                className="underline hover:text-yellow-300 transition"
              >
                {user.name}
              </button></>
            )}
          </h1>
        </div>
      </header>
      <section className="py-16">
        <Banner />
      </section>
      <UserProfile open={open} onClose={() => setOpen(false)} />
    </div>
  );
}