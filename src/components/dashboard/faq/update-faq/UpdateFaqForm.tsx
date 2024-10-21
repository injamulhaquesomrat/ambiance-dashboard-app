"use client";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { updateFaq } from "../../../../../actions/faq/update-faq";
import { Faq } from "../FaqListTable";
import { getFaq } from "../../../../../actions/faq/get-faq";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export function UpdateFaqForm({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [faq, setFaqs] = useState<Faq>();
  useEffect(() => {
    const getFaqData = async () => {
      const response = await getFaq(id);
      if (response?.error) {
        return toast.error(response?.error);
      }
      setFaqs(response?.data);
    };
    getFaqData();
  }, []);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget; // Using currentTarget for form
    const title = (form.elements.namedItem("title") as HTMLInputElement).value;

    const description = (
      form.elements.namedItem("description") as HTMLInputElement
    ).value;

    try {
      const response = await updateFaq(id, { title, description });
      if (response?.error) {
        return toast.error(response?.error);
      }
      toast.success(response?.message);
      router.push("/dashboard/faqs");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto rounded-none md:rounded-2xl shadow-input bg-white dark:bg-transparent">
      <form
        className="my-8 p-6 bg-white dark:bg-[#0A0A0A] rounded-md"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label className="mb-2" htmlFor="title">
              Title
            </Label>
            <Input
              defaultValue={faq?.title || ""}
              id="title"
              name="title"
              placeholder="Enter Title"
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
              defaultValue={faq?.description || ""}
              id="description"
              name="description"
              placeholder="Enter Description"
              required
            />
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

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
