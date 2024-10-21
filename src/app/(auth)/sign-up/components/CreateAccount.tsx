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
import { Eye, EyeOff, Loader } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { registerAdmin } from "../../../../../actions/auth/register-admin";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function CreateAccount() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget as HTMLFormElement;
    const first_name = (
      form.elements.namedItem("first_name") as HTMLInputElement
    ).value;
    const last_name = (form.elements.namedItem("last_name") as HTMLInputElement)
      .value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;
    try {
      const response = await registerAdmin({
        first_name,
        last_name,
        email,
        password,
      });
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
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
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
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div> */}
          {/* </div> */}
          <div className="grid gap-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="first_name"
              type="text"
              required
              placeholder="Enter First Name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="last_name"
              type="text"
              required
              placeholder="Enter Last Name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="m@example@student.com"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                placeholder="Enter Password"
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
          <Button disabled={loading} type="submit" className="w-full">
            Create account{" "}
            {loading && <Loader className="animate-spin ml-2" size={22} />}
          </Button>

          <small className="text-center mt-4">
            Already have an acoount?{" "}
            <Link
              className="underline hover:no-underline hover:text-[#22c55e]"
              href={"/sign-in"}
            >
              Login
            </Link>
          </small>
        </CardFooter>
      </form>
    </Card>
  );
}
