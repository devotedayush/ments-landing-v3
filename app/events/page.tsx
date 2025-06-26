'use client';
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/utils';

export default function EventsPage() {
  const [user, setUser] = useState<any>(null);
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true })
        .limit(1);
      if (error) {
        setError('Failed to fetch event. Please try again later.');
        setEvent(null);
      } else if (data && data.length > 0) {
        setEvent(data[0]);
      } else {
        setEvent(null);
      }
      setLoading(false);
    };
    fetchEvent();
  }, []);

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 pt-24 pb-16 max-w-4xl">
        {/* Admin control removed */}
        {loading ? (
          <div className="text-center py-16 text-lg text-muted-foreground">Loading event...</div>
        ) : error ? (
          <div className="text-center py-16 text-red-600 font-semibold">{error}</div>
        ) : !event ? (
          <div className="text-center py-16 text-muted-foreground font-medium">No upcoming event found.</div>
        ) : (
          <div className="flex flex-col md:flex-row items-stretch md:space-x-8 space-y-8 md:space-y-0 justify-center">
            {/* Event Image */}
            <div className="flex-shrink-0 w-full md:w-[380px] flex justify-center items-center">
              <Image
                src={event.image_url || "/office.png"}
                alt={event.title || "Event venue"}
                width={380}
                height={320}
                className="rounded-xl shadow-lg object-cover w-full max-w-[340px] h-[220px] md:h-[320px]"
                priority
              />
            </div>
            {/* Event Details Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-10 w-full max-w-xl flex flex-col justify-center min-h-[220px] md:min-h-[320px]">
              <h1 className="text-2xl md:text-3xl font-bold mb-3 text-balance text-primary">{event.title}</h1>
              <p className="mb-5 text-base md:text-lg text-muted-foreground line-clamp-5">{event.description}</p>
              <div className="mb-5">
                <span className="block text-sm text-muted-foreground">Date & Time</span>
                <span className="block font-medium">
                  {event.date ? new Date(event.date).toLocaleString(undefined, { dateStyle: 'long', timeStyle: 'short' }) : 'TBA'}
                </span>
              </div>
              <Link href="/events/registration">
                <button className="bg-primary text-primary-foreground px-8 py-3 rounded-md hover:bg-primary/90 transition text-lg font-semibold w-full md:w-auto">
                  Register Now
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
