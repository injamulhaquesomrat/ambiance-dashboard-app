"use client";
import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { addService } from "../../../../../actions/service/create-service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader } from "lucide-react";

export function AddServiceForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [postImages, setPostImages] = useState<File[]>([]);
  const [postImagesPreview, setPostImagesPreview] = useState<string[]>([]);
  const [postBanner, setPostBanner] = useState<File | null>(null);
  const [postBannerPreview, setPostBannerPreview] = useState<string | null>(
    null
  );
  const [postThumbnail, setPostThumbnail] = useState<File | null>(null);
  const [postThumbnailPreview, setPostThumbnailPreview] = useState<
    string | null
  >(null);

  const handlePostImages = useCallback((acceptedFiles: File[]) => {
    setPostImages((prev) => [...prev, ...acceptedFiles]);
    setPostImagesPreview((prev) => [
      ...prev,
      ...acceptedFiles.map((file) => URL.createObjectURL(file)),
    ]);
  }, []);

  const handlePostBanner = useCallback((acceptedFiles: File[]) => {
    const bannerFile = acceptedFiles[0]; // Only allow one banner
    setPostBanner(bannerFile);
    setPostBannerPreview(URL.createObjectURL(bannerFile));
  }, []);
  const handlePostThumbnail = useCallback((acceptedFiles: File[]) => {
    const thumbnailFile = acceptedFiles[0]; // Only allow one banner
    setPostThumbnail(thumbnailFile);
    setPostThumbnailPreview(URL.createObjectURL(thumbnailFile));
  }, []);

  const removePostImage = (index: number) => {
    setPostImages((prev) => prev.filter((_, i) => i !== index));
    setPostImagesPreview((prev) => prev.filter((_, i) => i !== index));
  };

  const removePostBanner = () => {
    setPostBanner(null);
    setPostBannerPreview(null);
  };
  const removePostThumbnail = () => {
    setPostThumbnail(null);
    setPostThumbnailPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const title = (form.elements.namedItem("title") as HTMLInputElement).value;

    const description = (
      form.elements.namedItem("description") as HTMLInputElement
    ).value;
    const reviews = (form.elements.namedItem("reviews") as HTMLInputElement)
      .value;
    const rating = (form.elements.namedItem("rating") as HTMLInputElement)
      .value;

    const formData = new FormData();
    formData.append("title", title);
    postImages.forEach((image) => formData.append("images", image));

    formData.append("banner", postBanner as any);

    formData.append("thumbnail", postThumbnail as any);

    formData.append("description", description);
    formData.append("reviews", reviews);
    formData.append("rating", rating);

    try {
      const response = await addService(formData);
      if (response?.error) {
        return toast.error(response?.error);
      }
      toast.success(response?.message);
      router.push("/dashboard/services");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const {
    getRootProps: getPostImageRootProps,
    getInputProps: getPostImageInputProps,
  } = useDropzone({
    onDrop: handlePostImages,
    accept: { "image/*": [] },
    multiple: true,
  });

  const {
    getRootProps: getPostBannerRootProps,
    getInputProps: getPostBannerInputProps,
  } = useDropzone({
    onDrop: handlePostBanner,
    accept: { "image/*": [] },
    multiple: false,
  });

  const {
    getRootProps: getPostThumbnailRootProps,
    getInputProps: getPostThumbnailInputProps,
  } = useDropzone({
    onDrop: handlePostThumbnail,
    accept: { "image/*": [] },
    multiple: false,
  });

  return (
    <div className="w-full mx-auto  shadow-input p-6 bg-white dark:bg-[#0A0A0A] rounded-md">
      <form className="space-y-10" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label className="mb-2" htmlFor="title">
              Title
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter Service Title"
              type="text"
              required
            />
          </LabelInputContainer>
        </div>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label className="mb-2" htmlFor="description">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Enter Service Description"
              required
            />
          </LabelInputContainer>
        </div>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label className="mb-2">Banner</Label>
            <div>
              <div
                {...getPostBannerRootProps()}
                className="border border-dashed rounded px-4 cursor-pointer py-10"
              >
                <input {...getPostBannerInputProps()} />
                <p>Drag n drop a banner image, or click to select a file</p>
              </div>
              {postBannerPreview && (
                <div className="relative mt-4 w-fit">
                  <Image
                    height={160}
                    width={80}
                    src={postBannerPreview}
                    alt="Banner Preview"
                    className="w-40 h-20 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={removePostBanner}
                    className="absolute top-0 right-0 h-6 w-6 flex items-center justify-center text-lg bg-black/50 hover:bg-black duration-300 text-white rounded-full"
                  >
                    &times;
                  </button>
                </div>
              )}
            </div>
          </LabelInputContainer>
        </div>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label className="mb-2">Thumbnail</Label>
            <div>
              <div
                {...getPostThumbnailRootProps()}
                className="border border-dashed rounded px-4 cursor-pointer py-10"
              >
                <input {...getPostThumbnailInputProps()} />
                <p>Drag n drop a banner image, or click to select a file</p>
              </div>
              {postThumbnailPreview && (
                <div className="relative mt-4 w-fit">
                  <Image
                    height={160}
                    width={80}
                    src={postThumbnailPreview}
                    alt="Banner Preview"
                    className="w-40 h-20 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={removePostThumbnail}
                    className="absolute top-0 right-0 h-6 w-6 flex items-center justify-center text-lg bg-black/50 hover:bg-black duration-300 text-white rounded-full"
                  >
                    &times;
                  </button>
                </div>
              )}
            </div>
          </LabelInputContainer>
        </div>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label className="mb-2" htmlFor="reviews">
              Reviews
            </Label>
            <Input
              id="reviews"
              name="reviews"
              placeholder="Enter Reviews"
              type="number"
              required
            />
          </LabelInputContainer>
        </div>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label className="mb-2" htmlFor="rating">
              Rating
            </Label>
            <Input
              id="rating"
              name="rating"
              placeholder="Enter Rating"
              type="number"
              required
            />
          </LabelInputContainer>
        </div>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label className="mb-2">Service Images</Label>
            <div>
              <div
                {...getPostImageRootProps()}
                className="border border-dashed px-4 cursor-pointer rounded py-20"
              >
                <input {...getPostImageInputProps()} />
                <p>Drag n drop some files here, or click to select files</p>
              </div>
              {postImagesPreview.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {postImagesPreview.map((image, index) => (
                    <div key={index} className="relative">
                      <Image
                        height={80}
                        width={80}
                        src={image}
                        alt={`Preview ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removePostImage(index)}
                        className="absolute top-0 right-0 h-6 w-6 flex items-center justify-center text-lg bg-black/50 hover:bg-black duration-300 text-white p-1 rounded-full"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </LabelInputContainer>
        </div>

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
      </form>
    </div>
  );
}

const BottomGradient = () => (
  <>
    <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
    <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
  </>
);

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("flex flex-col space-y-2 w-full", className)}>
    {children}
  </div>
);
