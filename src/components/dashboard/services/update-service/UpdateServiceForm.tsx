"use client";
import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { cn, generateImage } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Loader } from "lucide-react";
import { getService } from "../../../../../actions/service/get-service";
import { IService } from "@/interface/service.interface";
import { toast } from "sonner";
import { editService } from "../../../../../actions/service/edit-service";
import { useRouter } from "next/navigation";

export function UpdateServiceForm({ id }: { id: string }) {
  const router = useRouter();
  const [postImages, setPostImages] = useState<File[]>([]);
  const [serviceImagesPreview, setServiceImagesPreview] = useState<string[]>(
    []
  );
  const [serviceBanner, setServiceBanner] = useState<File | null>(null);
  const [serverBanner, setServerBanner] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imagesToRemove, setImagesToRemove] = useState<string[]>([]);
  const [serviceBannerPreview, setServiceBannerPreview] = useState<
    string | null
  >(null);
  const [serverImagesPreview, setServerImagesPreview] = useState<string[]>([]); //
  const [postThumbnail, setPostThumbnail] = useState<File | null>(null);
  const [serverThumbnail, setServerThumbnail] = useState<string | null>(null);
  const [postThumbnailPreview, setPostThumbnailPreview] = useState<
    string | null
  >(null);

  const [service, setService] = useState<IService | null>(null);

  // Fetch and set the project data
  useEffect(() => {
    const getServiceData = async () => {
      setLoading(true);
      try {
        const response = await getService(id);
        if (response?.error) {
          toast.error(response?.error);
        } else {
          setService(response?.data);
          setServerThumbnail(response?.data?.thumbnail);
          setServerBanner(response?.data?.banner);
          // Set existing images
          if (response?.data?.images) {
            setServerImagesPreview(response.data.images);
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getServiceData();
  }, [id]);

  const handlePostImages = useCallback((acceptedFiles: File[]) => {
    setPostImages((prev) => [...prev, ...acceptedFiles]);
    setServiceImagesPreview((prev) => [
      ...prev,
      ...acceptedFiles.map((file) => URL.createObjectURL(file)),
    ]);
  }, []);

  const handlePostBanner = useCallback((acceptedFiles: File[]) => {
    const bannerFile = acceptedFiles[0]; // Only allow one banner
    setServiceBanner(bannerFile);
    setServiceBannerPreview(URL.createObjectURL(bannerFile));
  }, []);
  const handlePostThumbnail = useCallback((acceptedFiles: File[]) => {
    const thumbnailFile = acceptedFiles[0]; // Only allow one banner
    setPostThumbnail(thumbnailFile);
    setPostThumbnailPreview(URL.createObjectURL(thumbnailFile));
  }, []);

  const removePostImage = (index: number) => {
    setPostImages((prev) => prev.filter((_, i) => i !== index));
    setServiceImagesPreview((prev) => prev.filter((_, i) => i !== index));
  };

  const removeServerBanner = () => {
    setServerBanner(null);
    setServiceBannerPreview(null);
  };

  const removeServerThumbnail = () => {
    setServerThumbnail(null);
    setPostThumbnailPreview(null);
  };

  const removeServerImage = (index: number, imagePath: string) => {
    imagesToRemove.push(imagePath);
    setServerImagesPreview((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!postThumbnail && !serverThumbnail) {
      return toast.error("Thumbnail Is Required");
    }
    if (!serviceBanner && !serverBanner) {
      return toast.error("Banner Is Required");
    }

    setIsLoading(true);
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
    imagesToRemove.forEach((image) => formData.append("imagesToRemove", image));
    formData.append("banner", serviceBanner as any);
    formData.append("thumbnail", postThumbnail as any);
    formData.append("description", description);
    formData.append("reviews", reviews);
    formData.append("rating", rating);

    try {
      const response = await editService(id, formData);
      if (response?.error) {
        return toast.error(response?.error);
      }
      toast.success(response?.message);
      router.push("/dashboard/services");
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

  const {
    getRootProps: getPostThumbnailRootProps,
    getInputProps: getPostThumbnailInputProps,
  } = useDropzone({
    onDrop: handlePostThumbnail,
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
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label className="mb-2" htmlFor="title">
              Title
            </Label>
            <Input
              defaultValue={service?.title}
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
              defaultValue={service?.description}
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
              {serviceBannerPreview || serverBanner ? (
                <div className="relative mt-4 w-fit">
                  <Image
                    height={160}
                    width={80}
                    src={
                      serviceBannerPreview ||
                      (serverBanner ? generateImage(serverBanner) : "")
                    }
                    alt="Banner Preview"
                    className="w-40 h-20 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={removeServerBanner}
                    className="absolute top-0 right-0 h-6 w-6 flex items-center justify-center text-lg bg-black/50 hover:bg-black duration-300 text-white rounded-full"
                  >
                    &times;
                  </button>
                </div>
              ) : null}
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
                <p>Drag n drop a thumbnail image, or click to select a file</p>
              </div>
              {postThumbnailPreview || serverThumbnail ? (
                <div className="relative mt-4 w-fit">
                  <Image
                    height={160}
                    width={80}
                    src={
                      postThumbnailPreview ||
                      (serverThumbnail ? generateImage(serverThumbnail) : "")
                    }
                    alt="Banner Preview"
                    className="w-40 h-20 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={removeServerThumbnail}
                    className="absolute top-0 right-0 h-6 w-6 flex items-center justify-center text-lg bg-black/50 hover:bg-black duration-300 text-white rounded-full"
                  >
                    &times;
                  </button>
                </div>
              ) : null}
            </div>
          </LabelInputContainer>
        </div>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label className="mb-2" htmlFor="reviews">
              Reviews
            </Label>
            <Input
              defaultValue={service?.reviews}
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
              defaultValue={service?.rating}
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
                {serviceImagesPreview.length > 0 &&
                  serviceImagesPreview.map((image, index) => (
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
            </div>
          </LabelInputContainer>
        </div>

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
