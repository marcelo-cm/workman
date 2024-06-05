"use client";

import WorkmanLogo from "@/components/molecules/WorkmanLogo";
import { Button } from "@/components/ui/button";
import { Router } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";

const Demo = () => {
  const router = useRouter();
  const demoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (demoRef.current && demoRef.current.paused) {
      demoRef.current.play();
    }
  }, [demoRef.current]);

  return (
    <div className="w-dvh flex min-h-dvh flex-col items-center justify-center gap-8 px-4 py-12 text-center">
      <WorkmanLogo variant="COMBO" className="w-64 lg:w-96" />
      <h3 className="text-lg">
        Welcome to the Workman Pilot Program. We're so happy you're here.
      </h3>
      <div className="flex max-w-[900px] flex-col gap-4 rounded-md border p-2 md:w-2/3 md:p-4">
        <video
          src="WorkmanDemoJun1.mp4"
          className="w-full rounded-sm border"
          autoPlay={true}
          loop={true}
          controls={true}
          ref={demoRef}
        />
      </div>
      <Button onClick={() => router.push("/for-approval")}>
        Launch the Platform
      </Button>
    </div>
  );
};

export default Demo;
