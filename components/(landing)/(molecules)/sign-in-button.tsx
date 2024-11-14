import React from 'react';

import Link from 'next/link';

import { Button, ButtonProps } from '@/components/ui/button';

const SignIn = ({ ...props }: ButtonProps) => {
  return (
    <Link href="/auth/sign-in">
      <Button variant="outline" {...props}>
        Sign In
      </Button>
    </Link>
  );
};

export default SignIn;
