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
import { ArrowRight, Loader } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { forgotPassword } from "../../../../../actions/auth/forgot-password";

export function ForgetPassword() {
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value as string;;

    try {
      const response = await forgotPassword({ email });
      if (response.error) {
        return toast.error(response?.error);
      }
      toast.success(response?.message);
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
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>Enter your email below to confirm</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" required type="email" placeholder="example@student.com" />
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
