"use client";

import { SignUpForm } from "@/components/auth/SignUpForm";
import { SplitAuthLayout } from "@/components/auth/SplitAuthLayout";

export default function SignupPage() {
  return (
    <SplitAuthLayout
      title="Create your Vayva account"
      subtitle="Set up your business system in minutes"
      showSignInLink={true}
    >
      <div className="flex justify-center w-full">
        <SignUpForm />
      </div>
    </SplitAuthLayout>
  );
}
