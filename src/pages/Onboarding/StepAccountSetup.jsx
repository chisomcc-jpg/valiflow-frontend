import React, { useState } from "react";

export default function StepAccountSetup({ onSubmit }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", company: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4"
    >
      <h2 className="text-xl font-semibold text-slate-800">Skapa ditt konto</h2>
      <input name="name" onChange={handleChange} placeholder="Fullständigt namn" required className="input" />
      <input name="email" onChange={handleChange} placeholder="E-postadress" type="email" required className="input" />
      <input name="company" onChange={handleChange} placeholder="Företagsnamn" className="input" />
      <input name="password" onChange={handleChange} placeholder="Lösenord" type="password" required className="input" />
      <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700">
        Fortsätt
      </button>
    </form>
  );
}
