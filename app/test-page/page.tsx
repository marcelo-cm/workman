"use client";

import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import React from "react";

const TestPage = () => {
  return (
    <div>
      <Button
        onClick={() =>
          toast({
            title: "Default Toast",
            description: "This is a default toast",
            action: <ToastAction altText="Action">Action</ToastAction>,
          })
        }
      >
        Default
      </Button>
      <Button
        onClick={() =>
          toast({
            title: "Destructive Toast",
            description: "This is a destructive toast",
            variant: "destructive",
            action: <ToastAction altText="Action">Action</ToastAction>,
          })
        }
      >
        Destructive
      </Button>
    </div>
  );
};

export default TestPage;
