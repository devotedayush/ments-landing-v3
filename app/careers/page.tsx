'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/utils';
import CareerHero from "@/components/careers/CareerHero";
import ValuesSection from "@/components/careers/ValuesSection";
import BenefitsSection from "@/components/careers/BenefitsSection";
import LocationSection from "@/components/careers/LocationSection";
import OpeningsSection from "@/components/careers/OpeningsSection";

export default function CareersPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.replace('/login');
      } else {
        setUser(data.user);
      }
      setLoading(false);
    };
    checkUser();
  }, [router, isClient]);

  if (!isClient || loading || !user) return null;

  return (
    <main className="min-h-screen w-full overflow-x-hidden">
      <CareerHero />
      <ValuesSection />
      <BenefitsSection />
      <LocationSection />
      <OpeningsSection />
    </main>
  );
}

