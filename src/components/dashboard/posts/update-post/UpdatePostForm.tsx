"use client";
import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { cn, generateImage } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { IPosts } from "@/interface/post.interface";
import { toast } from "sonner";
import { getPost } from "../../../../../actions/post/get-post";
import { editPost } from "../../../../../actions/post/edit-post";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export function UpdatePostForm({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [images, setImages] = useState<File[]>([]); // New images
  const [postImagesPreview, setPostImagesPreview] = useState<string[]>([]); // Local previews for new images
  const [serverImagesPreview, setServerImagesPreview] = useState<string[]>([]); // Previews for images from server
  const [banner, setBanner] = useState<File | null>(null);
  const [postBannerPreview, setPostBannerPreview] = useState<string | null>(
    null
  );
  const [serverBannerPreview, setServerBannerPreview] = useState<string | null>(
    null
  );
  const [imagesToRemove, setImagesToRemove] = useState<string[]>([]);
  const [post, setPost] = useState<IPosts | null>(null);
  // Fetch and set the post data
  useEffect(() => {
    const getPostData = async () => {
      setLoading(true);
      try {
        const response = await getPost(id);
        if (response?.error) {
          toast.error(response?.error);
        }
        setPost(response?.data);
        // Set post images and banner previews from the server
        if (response?.data?.images) {
          setServerImagesPreview(response.data.images);
        }
        if (response?.data?.banner) {
          setServerBannerPreview(response.data.banner);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getPostData();
  }, [id]);

  const handlePostImages = useCallback((acceptedFiles: File[]) => {
    setImages((prev) => [...prev, ...acceptedFiles]); // Store new images
    setPostImagesPreview((prev) => [
      ...prev,
      ...acceptedFiles.map((file) => URL.createObjectURL(file)), // Create preview for new images
    ]);
  }, []);

  const handlePostBanner = useCallback((acceptedFiles: File[]) => {
    const bannerFile = acceptedFiles[0]; // Only allow one banner
    setBanner(bannerFile);
    setPostBannerPreview(URL.createObjectURL(bannerFile)); // Preview for banner
  }, []);

  const removePostImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPostImagesPreview((prev) => prev.filter((_, i) => i !== index));
  };

  const removeServerImage = (index: number, imagePath: string) => {
    imagesToRemove.push(imagePath);
    setServerImagesPreview((prev) => prev.filter((_, i) => i !== index));
  };

  const removePostBanner = () => {
    setBanner(null);
    setPostBannerPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const form = e.currentTarget;
    const title = (form.elements.namedItem("title") as HTMLInputElement).value;
    const subtitle = (form.elements.namedItem("subtitle") as HTMLInputElement)
      .value;
    const description = (
      form.elements.namedItem("description") as HTMLInputElement
    ).value;

    const formData = new FormData();
    formData.append("title", title);

    // Append images
    // Array.from(images).forEach((image) => formData.append("images", image)); // Append each file with the same key "images[]"
    for (const file of images) {
      formData.append("images", file);
    }

    // Append banner if available
    if (banner) {
      formData.append("banner", banner);
    }

    // Append subtitle and description
    formData.append("subtitle", subtitle);
    formData.append("description", description);

    // Append images to remove
    imagesToRemove.forEach((image) => formData.append("imagesToRemove", image)); // Append each image path with the same key "imagesToRemove[]"
    try {
      const response = await editPost(id, formData);
      if (response?.error) {
        return toast.error(response?.error);
      }
      toast.success(response?.message);
      router.push("/dashboard/posts");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
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

  if (loading) {
    return (
      <h1 className="flex items-center justify-center gap-2 min-h-[70vh] mx-auto">
        Loading <Loader className="animate-spin" size={24} />
      </h1>
    );
  }

  return (
    <div className="w-full mx-auto rounded-none md:rounded-2xl shadow-input bg-white dark:bg-transparent">
      <form
        className="my-8 space-y-10 p-6 bg-white dark:bg-[#0A0A0A] rounded-md"
        onSubmit={handleSubmit}
      >
        {/* Post Title */}
        <LabelInputContainer>
          <Label className="mb-2" htmlFor="post_title">
            Post Title
          </Label>
          <Input
            id="post_title"
            name="title"
            placeholder="Enter Post Title"
            type="text"
            required
            defaultValue={post?.title || ""}
          />
        </LabelInputContainer>

        {/* Post Images */}
        <LabelInputContainer>
          <Label className="mb-2">Post Images</Label>
          <div
            {...getPostImageRootProps()}
            className="border border-dashed px-4 cursor-pointer rounded py-20"
          >
            <input {...getPostImageInputProps()} />
            <p>Drag n drop some files here, or click to select files</p>
          </div>
          {/* Preview for server images */}
          <div className="flex items-center gap-2 pt-2">
            {serverImagesPreview.length > 0 &&
              serverImagesPreview.map((image, index) => (
                <div key={index} className="relative">
                  <Image
                    height={80}
                    width={80}
                    src={generateImage(image)}
                    alt={`Server Preview ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeServerImage(index, image)}
                    className="absolute top-0 right-0 h-6 w-6 flex items-center justify-center text-lg bg-black/50 hover:bg-black duration-300 text-white p-1 rounded-full"
                  >
                    &times;
                  </button>
                </div>
              ))}

            {/* Preview for new images */}
            {postImagesPreview.length > 0 &&
              postImagesPreview.map((image, index) => (
                <div key={index} className="relative">
                  <Image
                    height={80}
                    width={80}
                    src={image} // Directly use URL.createObjectURL for local previews
                    alt={`New Preview ${index + 1}`}
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
        </LabelInputContainer>

        {/* Post Banner */}
        <LabelInputContainer>
          <Label className="mb-2">Post Banner</Label>
          <div
            {...getPostBannerRootProps()}
            className="border border-dashed rounded px-4 cursor-pointer py-10"
          >
            <input {...getPostBannerInputProps()} />
            <p>Drag n drop a banner image, or click to select a file</p>
          </div>
          {postBannerPreview || serverBannerPreview ? (
            <div className="relative mt-4 w-fit">
              <Image
                height={160}
                width={80}
                src={
                  postBannerPreview ||
                  (serverBannerPreview
                    ? generateImage(serverBannerPreview)
                    : "")
                }
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
          ) : null}
        </LabelInputContainer>

        {/* Post Subtitle */}
        <LabelInputContainer>
          <Label className="mb-2" htmlFor="post_subtitle">
            Post Subtitle
          </Label>
          <Input
            id="post_subtitle"
            name="subtitle"
            placeholder="Enter Post Subtitle"
            type="text"
            defaultValue={post?.subtitle || ""}
          />
        </LabelInputContainer>

        {/* Post Description */}
        <LabelInputContainer>
          <Label className="mb-2" htmlFor="post_description">
            Post Description
          </Label>
          <Textarea
            id="post_description"
            name="description"
            placeholder="Enter Post Description"
            defaultValue={post?.description || ""}
          />
        </LabelInputContainer>

        {/* Submit Button */}
        <button
          disabled={isLoading}
          className="bg-gradient-to-br relative group/btn from-black dark:from-black dark:to-black to-neutral-600  dark:bg-black w-full text-white gap-2 items-center justify-center flex rounded-md h-10 font-medium max-w-32"
          type="submit"
        >
          Submit{" "}
          {isLoading ? (
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

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

// Helper component for form field styling consistency
const LabelInputContainer = ({ children }: { children: React.ReactNode }) => {
  return <div className="grid gap-1">{children}</div>;
};
