"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { getAllSocial } from "../../../../actions/social/get-all-social";
import { updateSocial } from "../../../../actions/social/update-social";
import { createSocial } from "../../../../actions/social/create-social";

export type TOptions = {
  _id: string;
  name: string;
  url: string;
  created_by: {
    _id: string;
    first_name: string;
    last_name: string;
    avatar: string;
  };
  createdAt: string;
  updatedAt: string;
};

const SocialListTable = () => {
  const [options, setOptions] = useState<TOptions[]>([]);
  const [refetch, setRefetch] = useState<boolean>(false);
  const [facebook, setFacebook] = useState<TOptions | null>(null);
  const [twitter, setTwitter] = useState<TOptions | null>(null);
  const [instagram, setInstagram] = useState<TOptions | null>(null);
  const [LinkedIn, setLinkedIn] = useState<TOptions | null>(null);
  const [pinterest, setPinterest] = useState<TOptions | null>(null);
  const [googleBusiness, setGoogleBusiness] = useState<TOptions | null>(null);
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<Record<string, boolean>>({
    Facebook: false,
    Twitter: false,
    Instagram: false,
    LinkedIn: false,
    Pinterest: false,
  });

  // get all socials data
  useEffect(() => {
    const getAllOptionsData = async () => {
      const response = await getAllSocial();
      setOptions(response?.data);
    };
    getAllOptionsData();
  }, [refetch]);

  // update socials data
  useEffect(() => {
    const updateSocial = () => {
      setFacebook(options.find((option) => option.name === "Facebook") || null);
      setTwitter(options.find((option) => option.name === "Twitter") || null);
      setInstagram(
        options.find((option) => option.name === "Instagram") || null
      );
      setLinkedIn(options.find((option) => option.name === "LinkedIn") || null);
      setPinterest(
        options.find((option) => option.name === "Pinterest") || null
      );
      setGoogleBusiness(
        options.find((option) => option.name === "Google Business") || null
      );
    };
    updateSocial();
  }, [options]);

  // handle submit for socials
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    name: string,
    id: string
  ) => {
    e.preventDefault();
    if (name === "Google Business") {
      setGoogleLoading(true);
    } else {
      setLoading((prev) => ({ ...prev, [name]: true })); // Set loading to true for the current option
    }
    const form = e.currentTarget;
    const value = (form.elements.namedItem(name) as HTMLInputElement).value;

    if (id) {
      console.log({ name, value });
      try {
        const response = await updateSocial(id, { name, url: value });
        if (response?.error) {
          return toast.error(response?.error);
        }
        toast.success(response?.message);
        setRefetch(!refetch);
      } catch (error) {
        console.log(error);
      } finally {
        if (name === "Google Business") {
          setGoogleLoading(false);
        } else {
          setLoading((prev) => ({ ...prev, [name]: false })); // Set loading to false after the request is complete
        }
      }
    } else {
      try {
        const response = await createSocial({ name, url: value });
        if (response?.error) {
          toast.error(response?.error);
        }
        toast.success(response?.message);
        setRefetch(!refetch);
      } catch (error) {
        console.log(error);
      } finally {
        if (name === "Google Business") {
          setGoogleLoading(false);
        } else {
          setLoading((prev) => ({ ...prev, [name]: false })); // Set loading to false after the request is complete
        }
      }
    }
  };

  return (
    <div className="mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white dark:bg-[#0A0A0A] rounded-md">
        <form
          onSubmit={(e) => handleSubmit(e, "Facebook", facebook?._id || "")}
        >
          <div className="col-span-1 space-y-3">
            <Label htmlFor="facebook">Facebook</Label>
            <Input
              required
              name="Facebook"
              type="text"
              placeholder="Enter the Facebook URL"
              defaultValue={facebook?.url || ""}
            />
            <div className="space-x-3">
              {facebook?.url ? (
                <Button disabled={loading["Facebook"]}>
                  {loading["Facebook"] ? "Updating..." : "Update"}
                </Button>
              ) : (
                <Button disabled={loading["Facebook"]}>
                  {loading["Facebook"] ? "Creating..." : "Create"}
                </Button>
              )}
            </div>
          </div>
        </form>

        <form onSubmit={(e) => handleSubmit(e, "Twitter", twitter?._id || "")}>
          <div className="col-span-1 space-y-3">
            <Label htmlFor="Twitter">Twitter</Label>
            <Input
              required
              name="Twitter"
              type="text"
              placeholder="Enter the Twitter URL"
              defaultValue={twitter?.url || ""}
            />
            <div className="space-x-3">
              {twitter?.url ? (
                <Button disabled={loading["Twitter"]}>
                  {loading["Twitter"] ? "Updating..." : "Update"}
                </Button>
              ) : (
                <Button disabled={loading["Twitter"]}>
                  {loading["Twitter"] ? "Creating..." : "Create"}
                </Button>
              )}
            </div>
          </div>
        </form>

        <form
          onSubmit={(e) => handleSubmit(e, "Instagram", instagram?._id || "")}
        >
          <div className="col-span-1 space-y-3">
            <Label htmlFor="instagram">Instagram</Label>
            <Input
              required
              name="Instagram"
              type="text"
              placeholder="Enter the Instagram URL"
              defaultValue={instagram?.url || ""}
            />
            <div className="space-x-3">
              {instagram?.url ? (
                <Button disabled={loading["Instagram"]}>
                  {loading["Instagram"] ? "Updating..." : "Update"}
                </Button>
              ) : (
                <Button disabled={loading["Instagram"]}>
                  {loading["Instagram"] ? "Creating..." : "Create"}
                </Button>
              )}
            </div>
          </div>
        </form>

        <form
          onSubmit={(e) => handleSubmit(e, "LinkedIn", LinkedIn?._id || "")}
        >
          <div className="col-span-1 space-y-3">
            <Label htmlFor="LinkedIn">LinkedIn</Label>
            <Input
              required
              name="LinkedIn"
              type="text"
              placeholder="Enter the LinkedIn URL"
              defaultValue={LinkedIn?.url || ""}
            />
            <div className="space-x-3">
              {LinkedIn?.url ? (
                <Button disabled={loading["LinkedIn"]}>
                  {loading["LinkedIn"] ? "Updating..." : "Update"}
                </Button>
              ) : (
                <Button disabled={loading["LinkedIn"]}>
                  {loading["LinkedIn"] ? "Creating..." : "Create"}
                </Button>
              )}
            </div>
          </div>
        </form>

        <form
          onSubmit={(e) => handleSubmit(e, "Pinterest", pinterest?._id || "")}
        >
          <div className="col-span-1 space-y-3">
            <Label htmlFor="pinterest">Pinterest</Label>
            <Input
              required
              name="Pinterest"
              type="text"
              placeholder="Enter the Pinterest URL"
              defaultValue={pinterest?.url || ""}
            />
            <div className="space-x-3">
              {pinterest?.url ? (
                <Button disabled={loading["Pinterest"]}>
                  {loading["Pinterest"] ? "Updating..." : "Update"}
                </Button>
              ) : (
                <Button disabled={loading["Pinterest"]}>
                  {loading["Pinterest"] ? "Creating..." : "Create"}
                </Button>
              )}
            </div>
          </div>
        </form>

        <form
          onSubmit={(e) =>
            handleSubmit(e, "Google Business", googleBusiness?._id || "")
          }
        >
          <div className="col-span-1 space-y-3">
            <Label htmlFor="google-business">Google Business</Label>
            <Input
              required
              name="Google Business"
              type="text"
              placeholder="Enter the Google Business URL"
              defaultValue={googleBusiness?.url || ""}
            />
            <div className="space-x-3">
              {googleBusiness?.url ? (
                <Button disabled={googleLoading}>
                  {googleLoading ? "Updating..." : "Update"}
                </Button>
              ) : (
                <Button disabled={googleLoading}>
                  {googleLoading ? "Creating..." : "Create"}
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SocialListTable;
