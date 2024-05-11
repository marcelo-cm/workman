import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import React from "react";
import { login, signup } from "./actions";

const SignIn = () => {
  return (
    <form>
      <label htmlFor="email">Email:</label>
      <input id="email" name="email" type="email" required />
      <label htmlFor="password">Password:</label>
      <input id="password" name="password" type="password" required />
      <button formAction={login}>Log in</button>
      <button formAction={signup}>Sign up</button>
    </form>
  );
};

export default SignIn;
