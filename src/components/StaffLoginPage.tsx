import React from "react";
import { SignIn } from "@clerk/clerk-react";
import Logo from "../images/logo.svg?react";

export default function StaffLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-groom-cream p-4">
      <div className="w-full max-w-md rounded-lg border border-border bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-col items-center">
          <Logo className="mb-4 h-10 w-32" />

          <h1 className="mb-1 text-2xl font-bold">
            Sign in to Groom Club Staff
          </h1>
          <p className="text-center text-sm text-muted-foreground">
            Staff access only
          </p>
        </div>

        <div className="space-y-4">
          <SignIn 
            appearance={{
              elements: {
                rootBox:"w-full",
                cardBox:"w-full"
               
              }
            }}
          />

          <p className="pt-2 text-center text-xs text-muted-foreground">
            You must be a registered staff member to access this dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
