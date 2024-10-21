"use client";
import React, { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { TagsInput } from "react-tag-input-component";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Loader } from "lucide-react";
import { addProject } from "../../../../../actions/projects/create-projects";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Main AddProjectForm component
export function AddProjectForm() {
  // State for post images
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [projectImages, setProjectImages] = useState<File[]>([]);
  const [projectImagesPreview, setProjectImagesPreview] = useState<string[]>(
    []
  );
  const [skills, setSkills] = useState<string[]>([]);

  // Handlers for images
  const handleProjectImages = useCallback((acceptedFiles: File[]) => {
    setProjectImages((prev) => [...prev, ...acceptedFiles]);
    setProjectImagesPreview((prev) => [
      ...prev,
      ...acceptedFiles.map((file) => URL.createObjectURL(file)),
    ]);
  }, []);

  const removeProjectImage = (index: number) => {
    setProjectImages((prev) => prev.filter((_, i) => i !== index));
    setProjectImagesPreview((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const form = e.currentTarget;
    const title = (form.elements.namedItem("title") as HTMLInputElement).value;

    const url = (form.elements.namedItem("url") as HTMLInputElement).value;
    const subject = (form.elements.namedItem("subject") as HTMLInputElement)
      .value;
    const postDescription = (
      form.elements.namedItem("postDescription") as HTMLInputElement
    ).value;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("url", url);
    formData.append("subject", subject);
    formData.append("description", postDescription);

    projectImages.forEach((image) => formData.append("images", image));
    skills.forEach((skill) => formData.append("skills", skill));

    try {
      const response = await addProject(formData);
      if (response.error) {
        return toast.error(response?.error);
      }
      toast.success(response?.message);
      router.push("/dashboard/projects");
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
    onDrop: handleProjectImages,
    accept: { "image/*": [] },
    multiple: true,
  });

  return (
    <div className="w-full mx-auto shadow-input p-6 bg-white dark:bg-[#0A0A0A] rounded-md">
      <form className=" space-y-10" onSubmit={handleSubmit}>
        {/* Title */}
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label className="mb-2" htmlFor="project_title">
              Project Title
            </Label>
            <Input
              id="project_title"
              name="title"
              placeholder="Enter Project Title"
              type="text"
              required
            />
          </LabelInputContainer>
        </div>
        {/* subject */}
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label className="mb-2" htmlFor="project_subject">
              Project Subject
            </Label>
            <Input
              id="project_subject"
              name="subject"
              placeholder="Enter Project Subject"
              type="text"
              required
            />
          </LabelInputContainer>
        </div>
        {/* url */}
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label className="mb-2" htmlFor="project_url">
              Project URL
            </Label>
            <Input
              id="project_url"
              name="url"
              placeholder="Enter Project URL"
              type="text"
              required
            />
          </LabelInputContainer>
        </div>

        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label className="mb-2">Project Images</Label>
            <div>
              <div
                {...getPostImageRootProps()}
                className="border border-dashed px-4 cursor-pointer rounded py-20"
              >
                <input {...getPostImageInputProps()} />
                <p>Drag and drop some files here, or click to select files</p>
              </div>
              {projectImagesPreview.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {projectImagesPreview.map((image, index) => (
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

        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label className="mb-2" htmlFor="skills">
              Skills
            </Label>
            {/* skills input */}
            <div className="bg-white dark:bg-background rounded border">
              <TagsInput
                value={skills}
                onChange={setSkills}
                name="skills"
                placeHolder="Enter skills"
                classNames={{
                  input:
                    "dark:bg-background dark:text-white bg-white text-black border dark:border-gray-700 border-gray-300 rounded p-2",
                  tag: "dark:bg-gray-800 bg-gray-200 text-black dark:text-white rounded text-sm gap-2 ml-2",
                }}
              />
            </div>
          </LabelInputContainer>
        </div>

        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label className="mb-2" htmlFor="post-description">
              Project Description
            </Label>
            <Textarea
              id="post-description"
              name="postDescription"
              placeholder="Enter Post Description"
              required
            />
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
