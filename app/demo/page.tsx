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
    <div className="w-dvh flex h-dvh flex-col items-center justify-center gap-8 p-4">
      <WorkmanLogo variant="COMBO" className="w-96" />
      <h3 className="text-lg ">
        Welcome to the Workman Pilot Program. We're so happy you're here.
      </h3>
      <div className="flex flex-col gap-4 rounded-md border p-4 ">
        <video
          src="WorkmanDemoJun1.mp4"
          className="w-full max-w-[900px] rounded-sm border"
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
