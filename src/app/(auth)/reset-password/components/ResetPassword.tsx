"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Eye, EyeOff, Loader } from "lucide-react";
import { useState } from "react";
import { resetPassword } from "../../../../../actions/auth/reset-password";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function ResetPassword() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const searchParams = useSearchParams();
  const resetPasswordToken = searchParams.get("token") || "";
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const new_password = (
      form.elements.namedItem("newPassword") as HTMLInputElement
    ).value as string;
    const confirm_password = (
      form.elements.namedItem("confirmPassword") as HTMLInputElement
    ).value as string;
    if (new_password !== confirm_password) {
      setLoading(false);
      return toast.error("Passwords do not match");
    }
    try {
      const response = await resetPassword(new_password, resetPasswordToken);
      if (response.error) {
        return toast.error(response?.error);
      }
      toast.success(response?.message);
      router.push("/sign-in");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Card className="w-full mx-4 md:max-w-96">
      <form onSubmit={handleSubmit}>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <CardDescription>Enter your email below to login</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  placeholder="Enter your new password"
                  name="newPassword"
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                />
                <Button
                  type="button"
                  className="absolute inset-y-0 right-0 px-3 bg-transparent dark:text-white text-black hover:bg-transparent"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  placeholder="Enter your confirm password"
                  name="confirmPassword"
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                />
                <Button
                  type="button"
                  className="absolute inset-y-0 right-0 px-3 bg-transparent dark:text-white text-black hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="grid">
          <button
            disabled={loading}
            className="bg-gradient-to-br relative group/btn from-black dark:from-black dark:to-black to-neutral-600  dark:bg-black w-full text-white gap-2 items-center justify-center flex rounded-md h-10 font-medium max-w-32"
            type="submit"
          >
            Submit{" "}
            {loading ? (
              <Loader size={22} className="animate-spin" />
            ) : (
              <ArrowRight size={22} />
            )}
            <BottomGradient />
          </button>
        </CardFooter>
      </form>
    </Card>
  );
}

const BottomGradient = () => (
  <>
    <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
    <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
  </>
);
