"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Eye, EyeOff, Loader, Pencil } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { updatePassword } from "../../../../actions/auth/update-password";
import { updateProfile } from "../../../../actions/auth/update-profile";
import Cookies from "js-cookie";
import { IUser } from "@/interface/user.interface";
import { generateImage, getClientToken, getDecodedUser } from "@/lib/utils";
import Image from "next/image";

const UserProfileForm = ({
  edit,
  setEdit,
  user,
}: {
  edit: boolean;
  setEdit: any;
  user: IUser;
}) => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const token = getClientToken();
  const profile = token ? (getDecodedUser(token) as IUser) : null;

  // change password
  const changePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const previous_password = (
      form.elements.namedItem("oldPassword") as HTMLInputElement
    ).value;

    const new_password = (
      form.elements.namedItem("newPassword") as HTMLInputElement
    ).value;
    const confirmPassword = (
      form.elements.namedItem("confirmPassword") as HTMLInputElement
    ).value;

    if (new_password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }
    try {
      const response = await updatePassword({
        previous_password,
        new_password,
      });
      if (response.error) {
        return toast.error(response?.error);
      }
      toast.success(response?.message);
      console.log(setEdit);
      setEdit(!edit);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // update user
  const updateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const first_name = (
      form.elements.namedItem("first_name") as HTMLInputElement
    ).value;

    const last_name = (form.elements.namedItem("last_name") as HTMLInputElement)
      .value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const bio = (form.elements.namedItem("bio") as HTMLInputElement).value;
    const designation = (
      form.elements.namedItem("designation") as HTMLInputElement
    ).value;

    const formData = new FormData();
    formData.append("first_name", first_name);
    formData.append("last_name", last_name);
    formData.append("email", email);
    formData.append("bio", bio);
    formData.append("designation", designation);
    if (avatar) {
      formData.append("avatar", avatar);
    }

    try {
      const response = await updateProfile(formData);
      if (response.error) {
        return toast.error(response?.error);
      }

      toast.success(response?.message);
      Cookies.set("accessToken", response?.data?.token, {
        expires: 30 * 24 * 60 * 60 * 1000,
      });
      setEdit(!edit);
      location.reload();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle avatar selection and preview
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file)); // Create preview URL for the selected image
    }
  };

  return (
    <div className="grid grid-cols-2 gap-10">
      <form className="space-y-6 max-w-2xl col-span-1" onSubmit={updateUser}>
        <div className="grid gap-2">
          <Label>First Name</Label>
          <Input
            defaultValue={user?.first_name}
            name="first_name"
            required
            id="first_name"
            placeholder="Enter Your First Name"
            type="text"
          />
        </div>
        <div className="grid gap-2">
          <Label>Last Name</Label>
          <Input
            defaultValue={user?.last_name}
            name="last_name"
            required
            id="last_name"
            placeholder="Enter Your Last Name"
            type="text"
          />
        </div>
        <div className="grid gap-2">
          <Label>Profile Avatar</Label>
          <div className="flex flex-col items-start gap-4">
            <div className="relative group">
              <Image
                src={
                  avatarPreview ||
                  (profile?.avatar ? generateImage(profile?.avatar) : "")
                }
                alt="Profile avatar"
                className="rounded-full w-[160px] h-[160px] aspect-square object-cover"
                height={160}
                width={160}
              />

              {/* Hidden file input */}
              <Input
                type="file"
                accept="image/*"
                className="hidden"
                id="avatarInput"
                onChange={handleAvatarChange}
              />

              {/* Edit icon to trigger file input */}
              <button
                type="button"
                onClick={() => document.getElementById("avatarInput")?.click()} // Trigger the hidden input
                className="absolute bottom-0 right-0 bg-black/75 text-white rounded-full p-2"
              >
                <Pencil size={16} />
              </button>
            </div>
          </div>
        </div>
        <div className="grid gap-2">
          <Label>Email</Label>
          <Input
            defaultValue={user?.email}
            name="email"
            required
            placeholder="Email"
            type="email"
          />
        </div>
        <div className="grid gap-2">
          <Label>Bio</Label>
          <Textarea
            defaultValue={user?.bio}
            name="bio"
            placeholder="Enter Your Bio"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label>Designation</Label>
          <Input
            defaultValue={user?.designation}
            name="designation"
            required
            placeholder="Enter Your Designation"
            type="text"
          />
        </div>

        <div>
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
        </div>
      </form>

      <form
        className="space-y-6 max-w-2xl col-span-1"
        onSubmit={changePassword}
      >
        <div className="grid gap-2">
          <Label>Old Password</Label>
          <div className="relative">
            <Input
              placeholder="Enter your old password"
              name="oldPassword"
              type={showOldPassword ? "text" : "password"}
            />
            <Button
              type="button"
              className="absolute inset-y-0 right-0 px-3 bg-transparent dark:text-white text-black hover:bg-transparent"
              onClick={() => setShowOldPassword(!showOldPassword)}
            >
              {showOldPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </Button>
          </div>
        </div>
        <div className="grid gap-2">
          <Label>New Password</Label>
          <div className="relative">
            <Input
              placeholder="Enter your new password"
              name="newPassword"
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
          <Label>Confirm Password</Label>
          <div className="relative">
            <Input
              placeholder="Enter your confirm password"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
            />
            <Button
              type="button"
              className="absolute inset-y-0 right-0 px-3 bg-transparent dark:text-white text-black hover:bg-transparent"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </Button>
          </div>
        </div>
        <div>
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
        </div>
      </form>
    </div>
  );
};

export default UserProfileForm;

const BottomGradient = () => (
  <>
    <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
    <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
  </>
);
