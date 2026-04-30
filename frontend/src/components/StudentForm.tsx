"use client";

import { useState } from "react";
import api from "@/lib/api";

export default function StudentForm({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [age, setAge] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !rollNumber || !age) {
      alert("All fields are required");
      return;
    }

    try {
      setLoading(true);

      await api.post("/students", {
        name,
        rollNumber,
        age: Number(age),
      });

      setName("");
      setRollNumber("");
      setAge("");

      onSuccess();
    } catch {
      alert("Failed to add student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded p-4 shadow-sm bg-white">
      <h2 className="text-lg font-semibold mb-4">Add Student</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          className="border p-2 rounded w-full"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="border p-2 rounded w-full"
          placeholder="Roll Number"
          value={rollNumber}
          onChange={(e) => setRollNumber(e.target.value)}
        />

        <input
          className="border p-2 rounded w-full"
          placeholder="Age"
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {loading ? "Adding..." : "Add Student"}
      </button>
    </div>
  );
}