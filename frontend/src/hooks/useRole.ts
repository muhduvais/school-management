"use client";

export default function useRole() {
  if (typeof window === "undefined") return null;

  return localStorage.getItem("role");
}