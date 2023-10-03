"use client";
import { useEffect } from 'react';
import { SessionProvider } from "next-auth/react";

type Props = {
  children?: React.ReactNode;
};

const NextAuthProvider = ({ children }: Props) => {

  useEffect(() => {
    document.body.style.opacity = "1";
  }, []);

  return <SessionProvider>{children}</SessionProvider>;
};

export default NextAuthProvider;