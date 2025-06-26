'use client';
import { useState, useEffect } from "react";
import { UserPlus } from "lucide-react";
import { supabase } from '@/lib/utils';

export default function RegistrationPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [event, setEvent] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    designation: '',
    other_designation: '',
    linkedin: '',
    city: ''
  });

  useEffect(() => {
    // Fetch latest event
    const fetchEvent = async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true })
        .limit(1);
      if (!error && data && data.length > 0) {
        setEvent(data[0]);
      }
    };
    fetchEvent();
    // Fetch user
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser(data.user);
        setForm(f => ({
          ...f,
          name: data.user.user_metadata?.full_name || '',
          email: data.user.email || '',
        }));
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const { name, email, phone, organization, designation, other_designation, linkedin, city } = form;
    const submitObj = {
      name, email, phone, organization, designation,
      linkedin, city,
      other_designation
    };
    if (designation === 'Other') {
      submitObj.designation = form.other_designation || 'Other';
      submitObj.other_designation = form.other_designation;
    }
    const { error } = await supabase.from('registrations').insert([submitObj]);
    if (error) {
      setError('Registration failed. Please try again.');
    } else {
      setSubmitted(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <section className="relative w-full overflow-hidden bg-gray-50 min-h-screen flex flex-col justify-center items-center pt-32 pb-12 px-2 md:px-6">
      {/* Subtle background shapes for visual interest */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-80 w-80 rounded-full bg-primary/10 opacity-30 blur-3xl z-0" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-primary/20 opacity-20 blur-2xl z-0" />
      {/* Hero Heading */}
      <div className="relative z-10 w-full max-w-3xl mx-auto text-center mb-10 mt-10">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Register for Our Next Event</h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-2">Join us and be a part of something exciting. Fill in your details to secure your spot!</p>
      </div>
      {/* Event Details Container */}
      <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center bg-white/90 rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 mb-8">
        <div className="bg-primary/10 rounded-full p-4 mb-4">
          <UserPlus className="w-10 h-10 text-primary" />
        </div>
        {event && (
          <div className="mb-6 w-full text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">{event.title}</h2>
            <div className="text-sm text-muted-foreground mb-2">
              {event.date ? new Date(event.date).toLocaleString(undefined, { dateStyle: 'long', timeStyle: 'short' }) : 'TBA'}
            </div>
            <div className="text-base text-muted-foreground">{event.description}</div>
          </div>
        )}
      </div>
      {/* Registration Form Container */}
      <div className="relative z-10 w-full max-w-lg mx-auto flex flex-col items-center bg-white/95 rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-primary text-center">Event Registration</h2>
        <p className="mb-6 text-muted-foreground text-center text-base">Fill in your details to secure your spot at the event.</p>
        {submitted ? (
          <div className="bg-green-100 text-green-800 p-4 rounded-md w-full text-center font-medium">Thank you for registering!</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 w-full">
            <div>
              <label className="block mb-1 font-medium" htmlFor="name">Name</label>
              <input id="name" name="name" type="text" required className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" value={form.name} onChange={handleChange} />
            </div>
            <div>
              <label className="block mb-1 font-medium" htmlFor="email">Email</label>
              <input id="email" name="email" type="email" required className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" value={form.email} onChange={handleChange} />
            </div>
            <div>
              <label className="block mb-1 font-medium" htmlFor="phone">Phone Number</label>
              <input id="phone" name="phone" type="tel" required className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" value={form.phone} onChange={handleChange} />
            </div>
            <div>
              <label className="block mb-1 font-medium" htmlFor="organization">Organization</label>
              <input id="organization" name="organization" type="text" className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" value={form.organization} onChange={handleChange} />
            </div>
            <div>
              <label className="block mb-1 font-medium" htmlFor="designation">Designation</label>
              <select
                id="designation"
                name="designation"
                required
                className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                value={form.designation}
                onChange={e => setForm(f => ({ ...f, designation: e.target.value, other_designation: '' }))}
              >
                <option value="" disabled>Select your designation</option>
                <option value="College Student">College Student</option>
                <option value="Startup Founder">Startup Founder</option>
                <option value="Working Professional">Working Professional</option>
                <option value="Faculty/Professor">Faculty/Professor</option>
                <option value="Investor">Investor</option>
                <option value="Other">Other</option>
              </select>
              {form.designation === 'Other' && (
                <input
                  id="other_designation"
                  name="other_designation"
                  type="text"
                  placeholder="Please specify"
                  className="mt-2 w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  value={form.other_designation}
                  onChange={e => setForm(f => ({ ...f, other_designation: e.target.value }))}
                  required
                />
              )}
            </div>
            <div>
              <label className="block mb-1 font-medium" htmlFor="linkedin">LinkedIn Profile</label>
              <input id="linkedin" name="linkedin" type="url" className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" value={form.linkedin} onChange={handleChange} />
            </div>
            <div>
              <label className="block mb-1 font-medium" htmlFor="city">City</label>
              <input id="city" name="city" type="text" className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" value={form.city} onChange={handleChange} />
            </div>
            {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
            <button type="submit" className="bg-primary text-primary-foreground px-8 py-3 rounded-md hover:bg-primary/90 transition text-lg font-semibold w-full">Register</button>
          </form>
        )}
      </div>
    </section>
  );
} 