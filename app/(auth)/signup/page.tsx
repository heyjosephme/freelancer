import { SignUpForm } from "@/components/signup-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your account",
};

export default function SignUpPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <SignUpForm />
      </div>
    </div>
  );
}
