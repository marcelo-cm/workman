"use client";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    window.location.href = "/for-approval";
  }, []);

  return <>Default Route</>;
}
