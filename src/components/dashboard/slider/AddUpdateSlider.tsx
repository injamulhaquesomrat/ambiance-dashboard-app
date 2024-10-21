"use client";
import React, { useCallback, useEffect, useState } from "react";
import { cn, generateImage } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { ArrowRight, Loader } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { getSliderByType } from "../../../../actions/slider/get-sliders";
import { addSlider } from "../../../../actions/slider/create-slider";

// Main AddProjectForm component
export function AddUpdateSlider() {
  // State for post images
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sliderImages, setSliderImages] = useState<File[]>([]);
  const [sliderImagesPreview, setSliderImagesPreview] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>("hero");
  const [refetch, setRefetch] = React.useState<boolean>(false);

  // get sliders according to type
  useEffect(() => {
    const getSlider = async () => {
      try {
        const response = await getSliderByType(selectedType);
        setSliderImages(response?.data[0]?.images);
        setSliderImagesPreview(response?.data[0]?.images);
      } catch (error) {
        console.log(error);
      }
    };
    getSlider();
  }, [selectedType, refetch]);

  // Handlers for images
  const handlesliderImages = useCallback((acceptedFiles: File[]) => {
    setSliderImages((prev) => [...prev, ...acceptedFiles]);
    setSliderImagesPreview((prev) => [
      ...prev,
      ...acceptedFiles.map((file) => URL.createObjectURL(file)),
    ]);
  }, []);

  // remove images
  const removeProjectImage = async (index: number) => {
    const formData = new FormData();
    const imagesToRemove = sliderImages.filter((_, i) => i === index);

    formData.append("type", selectedType);
    imagesToRemove.forEach((image) => formData.append("imagesToRemove", image));

    // update slider
    try {
      const response = await addSlider(formData);
      if (response.error) {
        return toast.error(response?.error);
      }
      toast.success(response?.message);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }

    setSliderImages((prev) => prev.filter((_, i) => i !== index));
    setSliderImagesPreview((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();

    formData.append("type", selectedType);
    sliderImages.forEach((image) => {
      if (image instanceof File) {
        formData.append("images", image);
      }
    });

    try {
      const response = await addSlider(formData);
      if (response.error) {
        return toast.error(response?.error);
      }
      setRefetch(!refetch);
      toast.success(response?.message);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
    // Debugging purposes
    console.log();
  };

  const {
    getRootProps: getPostImageRootProps,
    getInputProps: getPostImageInputProps,
  } = useDropzone({
    onDrop: handlesliderImages,
    accept: { "image/*": [] },
    multiple: true,
  });

  return (
    <div className="w-full mx-auto shadow-input p-6 bg-white dark:bg-[#0A0A0A] rounded-md">
      <form className=" space-y-10" onSubmit={handleSubmit}>
        {/* type */}
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label className="mb-2" htmlFor="project_type">
              Slider Type
            </Label>
            <Select
              name="type"
              value={selectedType}
              onValueChange={(value) => setSelectedType(value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select slider type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Types</SelectLabel>
                  <SelectItem value="hero">Hero</SelectItem>
                  <SelectItem value="post">Post</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </LabelInputContainer>
        </div>

        {/* images */}
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label className="mb-2">Slider Images</Label>
            <div>
              <div
                {...getPostImageRootProps()}
                className="border border-dashed px-4 cursor-pointer rounded py-20"
              >
                <input {...getPostImageInputProps()} />
                <p>Drag and drop some files here, or click to select files</p>
              </div>
              {sliderImagesPreview.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {sliderImagesPreview.map((image, index) => (
                    <div key={index} className="relative">
                      {image.startsWith("blob") ? (
                        <Image
                          height={80}
                          width={80}
                          src={image}
                          alt={`Preview ${index + 1}`}
                          className="w-20 h-20 object-cover rounded-md"
                        />
                      ) : (
                        <Image
                          height={80}
                          width={80}
                          src={generateImage(image)}
                          alt={`Preview ${index + 1}`}
                          className="w-20 h-20 object-cover rounded-md"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => removeProjectImage(index)}
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
