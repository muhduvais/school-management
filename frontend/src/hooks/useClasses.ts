"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function useClasses() {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await api.get(`/classes`);

      setClasses(res.data.data);
    };

    fetch();
  }, []);

  return { classes };
}
