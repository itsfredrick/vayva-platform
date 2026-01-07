"use client";

import { SignInForm } from "@/components/auth/SignInForm";
import { SplitAuthLayout } from "@/components/auth/SplitAuthLayout";

export default function SigninPage() {
  return (
    <SplitAuthLayout
      title="Welcome back"
      subtitle="Sign in to manage your business operations"
      showSignUpLink={true}
    >
      <div className="flex justify-center w-full">
        <SignInForm />
      </div>
    </SplitAuthLayout>
  );
}
