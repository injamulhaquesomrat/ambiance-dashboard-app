"use client";
import { Button } from "@/components/ui/button";
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
import Link from "next/link";
import { loginAdmin } from "../../../../../actions/auth/login-admin";
import { toast } from "sonner";
import { useState } from "react";
import { Eye, EyeOff, Loader } from "lucide-react";
import { useRouter } from "next/navigation";

export function Login() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  //Form Submit Handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget as HTMLFormElement;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;
    try {
      const response = await loginAdmin({
        email,
        password,
      });
      if (response.error) {
        return toast.error(response?.error);
      }
      location.reload();
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
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your email below to login</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {/* <div className="grid grid-cols-2 gap-6">
          <Button variant="outline">
            <Icons.gitHub className="mr-2 h-4 w-4" />
            Github
          </Button>
          <Button variant="outline">
            <Icons.google className="mr-2 h-4 w-4" />
            Google
          </Button>
        </div> */}
          {/* <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div> */}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="example@student.com"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
              placeholder="Enter Your Password"
                name="password"
                id="password"
                type={showPassword ? "text" : "password"}
              />
              <Button
                type="button"
                className="absolute inset-y-0 right-0 px-3 bg-transparent dark:text-white text-black hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="grid">
          <Button disabled={loading} className="w-full">
            Login{" "}
            {loading && <Loader className="animate-spin ml-2" size={22} />}
          </Button>
          <small className="text-center mt-4">
            Don&apos;t have an acoount?{" "}
            <Link
              className="underline hover:no-underline hover:text-[#22c55e]"
              href={"/sign-up"}
            >
              Signup
            </Link>
          </small>
          <small className="text-center mt-4">
            <Link
              className="underline hover:no-underline hover:text-[#22c55e]"
              href={"/forgot-password"}
            >
              Forgot password?
            </Link>
          </small>
        </CardFooter>
      </form>
    </Card>
  );
}
