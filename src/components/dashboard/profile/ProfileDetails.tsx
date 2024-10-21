"use client";
import { FilePenLine } from "lucide-react";
import React, { useState } from "react";
import UserProfileForm from "./ProfileForm";
import { Button } from "@/components/ui/button";
import { generateImage, getClientToken, getDecodedUser } from "@/lib/utils";
import Image from "next/image";
import { IUser } from "@/interface/user.interface";

const ProfileDetails = () => {
  const [edit, setEdit] = useState(false);
  const token = getClientToken();
  const profile = token ? (getDecodedUser(token) as IUser) : null;

  return (
    <div className="mt-10">
      <div className="space-y-4">
        {!edit && (
          <Button
            onClick={() => setEdit(true)}
            className="dark:text-white gap-2 hover:bg-secondary hover:text-black border bg-black rounded w-fit cursor-pointer"
          >
            Edit Profile
            <FilePenLine className="size-4" />
          </Button>
        )}
        {edit && (
          <Button
            onClick={() => setEdit(false)}
            className="dark:text-white gap-2 hover:bg-secondary hover:text-black border bg-black rounded w-fit cursor-pointer"
          >
            Cancel
            <FilePenLine className="size-4" />
          </Button>
        )}
        {!edit ? (
          <>
            <Image
              src={profile?.avatar ? generateImage(profile?.avatar) : ""}
              alt="profile image"
              className="rounded-full w-[160px] h-[160px] aspect-square object-cover"
              height={300}
              width={300}
            />
            <h6 className="text-2xl capitalize">
              {profile?.first_name} {profile?.last_name}
            </h6>
            <p>{profile?.designation}</p>
            <p>{profile?.email}</p>
            <p>{profile?.bio}</p>
          </>
        ) : (
          <UserProfileForm setEdit={setEdit} edit={edit} user={profile!} />
        )}
      </div>
    </div>
  );
};

export default ProfileDetails;
