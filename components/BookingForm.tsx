"use client";
import React, { useState } from "react";
import { toast } from "sonner";

interface Props {
  slug: string;
}

const BookingForm = ({ slug }: Props) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/bookings/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Booking failed");
      }

      toast.success("Booking successful!");
      setEmail("");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-6 border border-gray-700 rounded-lg bg-gray-800 shadow-lg"
    >
      <h2 className="text-xl font-semibold text-white">Book your Slot</h2>

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-700 text-white placeholder-gray-400"
        required
        disabled={loading}
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 text-white bg-emerald-600 rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Booking…" : "Submit"}
      </button>
    </form>
  );
};

export default BookingForm;