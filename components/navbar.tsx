"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from '@/lib/utils';

const NAV_ITEMS = [
  { label: "Blogs", href: "https://blog.ments.app", protected: true },
  { label: "Careers", href: "/careers" },
  { label: "Events", href: "/events" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, [isClient]);

  if (!isClient) return null;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/');
  };

  return (
    <motion.nav
      className="fixed top-4 left-0 right-0 z-50 flex justify-center box-border"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="box-border w-full md:w-auto max-w-4xl 
                      bg-black/90 backdrop-blur-md rounded-full
                      px-4 md:px-8 py-4 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="text-white font-bold text-xl px-4">
          ments
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center space-x-6 pr-4">
          {NAV_ITEMS.map(({ label, href, protected: isProtected }) => (
            label === "Blogs" ? (
              <a
                key={label}
                href={user ? href : "/login"}
                className="text-gray-300 hover:text-white transition-colors duration-200"
                target={user ? "_blank" : undefined}
                rel={user ? "noopener noreferrer" : undefined}
              >
                {label}
              </a>
            ) : (
              <Link key={label} href={href}
                className="text-gray-300 hover:text-white transition-colors duration-200">
                {label}
              </Link>
            )
          ))}
          {!user ? (
            <>
              <Link href="/login" className="text-gray-300 hover:text-white transition-colors duration-200">Login</Link>
              <Link href="/signup" className="text-gray-300 hover:text-white transition-colors duration-200">Sign Up</Link>
            </>
          ) : (
            <button onClick={handleLogout} className="text-gray-300 hover:text-white transition-colors duration-200">Logout</button>
          )}
        </div>

        {/* Join Waitlist */}
        <a
          href={user ? "https://ments.ezzyforms.in/forms/6841e534f06f98d51b4f" : "/login"}
          target={user ? "_blank" : undefined}
          rel={user ? "noopener noreferrer" : undefined}
          className="hidden md:block"
        >
          <Button variant="outline"
                  className="bg-white text-black border-white hover:bg-gray-100 rounded-full px-6">
            Join Waitlist
          </Button>
        </a>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {open && (
          <motion.ul
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute top-full mt-2 left-0 right-0 
                       bg-black/90 backdrop-blur-md rounded-2xl p-6 space-y-4 md:hidden"
          >
            {NAV_ITEMS.map(({ label, href, protected: isProtected }) => (
              label === "Blogs" ? (
                <li key={label}>
                  <a
                    href={user ? href : "/login"}
                    className="block text-gray-200 hover:text-white text-lg "
                    target={user ? "_blank" : undefined}
                    rel={user ? "noopener noreferrer" : undefined}
                    onClick={() => setOpen(false)}
                  >
                    {label}
                  </a>
                </li>
              ) : (
                <li key={label}>
                  <Link href={href}
                    className="block text-gray-200 hover:text-white text-lg "
                    onClick={() => setOpen(false)}
                  >
                    {label}
                  </Link>
                </li>
              )
            ))}
            {!user ? (
              <>
                <li><Link href="/login" className="block text-gray-200 hover:text-white text-lg " onClick={() => setOpen(false)}>Login</Link></li>
                <li><Link href="/signup" className="block text-gray-200 hover:text-white text-lg " onClick={() => setOpen(false)}>Sign Up</Link></li>
              </>
            ) : (
              <li><button onClick={() => { handleLogout(); setOpen(false); }} className="block text-gray-200 hover:text-white text-lg ">Logout</button></li>
            )}
            <li>
              <a
                href={user ? "https://ments.ezzyforms.in/forms/6841e534f06f98d51b4f" : "/login"}
                target={user ? "_blank" : undefined}
                rel={user ? "noopener noreferrer" : undefined}
                className="block"
                onClick={() => setOpen(false)}
              >
                <Button className="w-full rounded-full">Join Waitlist</Button>
              </a>
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
