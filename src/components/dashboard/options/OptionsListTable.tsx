"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useEffect, useRef, useState } from "react";
import { getAllOptions } from "../../../../actions/options/get-all-options";
import { Textarea } from "@/components/ui/textarea";
import { updateOption } from "../../../../actions/options/update-option";
import { toast } from "sonner";
import { createOptions } from "../../../../actions/options/create-options";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useTheme } from "next-themes";

export type TOptions = {
  _id: string;
  name: string;
  value: string;
  created_by: {
    _id: string;
    first_name: string;
    last_name: string;
    avatar: string;
  };
  createdAt: string;
  updatedAt: string;
};

const OptionsListTable = () => {
  const { setTheme, theme } = useTheme();
  const privacyEditorRef = useRef<ClassicEditor | null>(null);
  const termsEditorRef = useRef<ClassicEditor | null>(null);
  const [options, setOptions] = useState<TOptions[]>([]);
  const [refetch, setRefetch] = useState<boolean>(false);
  const [siteUrl, setSiteUrl] = useState<TOptions | null>(null);
  const [siteTitle, setSiteTitle] = useState<TOptions | null>(null);
  const [contact, setContact] = useState<TOptions | null>(null);
  const [email, setEmail] = useState<TOptions | null>(null);
  const [privacyPolicy, setPrivacyPolicy] = useState<TOptions | null>();
  const [termsAndConditions, setTermsAndConditions] =
    useState<TOptions | null>();
  const [editedPrivacyPolicy, setEditedPrivacyPolicy] = useState<string>();
  const [editedTermsAndCondition, setEditedTermsAndCondition] =
    useState<string>();
  const [loading, setLoading] = useState<Record<string, boolean>>({
    "site-url": false,
    "site-title": false,
    contact: false,
    email: false,
    "privacy-policy": false,
    "terms-conditions": false,
  });

  useEffect(() => {
    const getAllOptionsData = async () => {
      const response = await getAllOptions();
      setOptions(response?.data);
    };
    getAllOptionsData();
  }, [refetch]);

  useEffect(() => {
    const updateOptions = () => {
      setSiteUrl(options.find((option) => option.name === "site-url") || null);
      setSiteTitle(
        options.find((option) => option.name === "site-title") || null
      );
      setContact(options.find((option) => option.name === "contact") || null);
      setEmail(options.find((option) => option.name === "email") || null);
      setPrivacyPolicy(
        options.find((option) => option.name === "privacy-policy") || null
      );
      setTermsAndConditions(
        options.find((option) => option.name === "terms-conditions") || null
      );
    };
    updateOptions();
  }, [options]);

  useEffect(() => {
    const applyThemeStyles = (
      editorRef: React.MutableRefObject<ClassicEditor | null>
    ) => {
      if (editorRef.current) {
        const editor = editorRef.current;
        editor.editing.view.change((writer) => {
          if (theme === "dark") {
            writer.setStyle(
              "background-color",
              "#000000",
              editor.editing.view.document.getRoot() as any
            );
            writer.setStyle(
              "color",
              "#ffffff",
              editor.editing.view.document.getRoot() as any
            );
          } else {
            writer.setStyle(
              "background-color",
              "#ffffff",
              editor.editing.view.document.getRoot() as any
            );
            writer.setStyle(
              "color",
              "#000000",
              editor.editing.view.document.getRoot() as any
            );
          }
        });
      }
    };

    // Apply theme for both editors
    applyThemeStyles(privacyEditorRef);
    applyThemeStyles(termsEditorRef);
  }, [theme]);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    name: string,
    id: string
  ) => {
    e.preventDefault();
    setLoading((prev) => ({ ...prev, [name]: true })); // Set loading to true for the current option
    const form = e.currentTarget;
    let value = "";
    if (name === "privacy-policy") {
      value = editedPrivacyPolicy as string;
    } else if (name === "terms-conditions") {
      value = editedTermsAndCondition as string;
    } else {
      value = (form.elements.namedItem(name) as HTMLInputElement).value;
    }

    if (id) {
      try {
        const response = await updateOption(id, { name, value });
        if (response?.error) {
          toast.error(response?.error);
        }
        toast.success(response?.message);
        setRefetch(!refetch);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading((prev) => ({ ...prev, [name]: false })); // Set loading to false after the request is complete
      }
    } else {
      try {
        const response = await createOptions({ name, value });
        if (response?.error) {
          toast.error(response?.error);
        }
        toast.success(response?.message);
        setRefetch(!refetch);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading((prev) => ({ ...prev, [name]: false })); // Set loading to false after the request is complete
      }
    }
  };

  return (
    <div className="mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white dark:bg-[#0A0A0A] rounded-md">
        <form onSubmit={(e) => handleSubmit(e, "site-url", siteUrl?._id || "")}>
          <div className="col-span-1 space-y-3">
            <Label htmlFor="">Site URL</Label>
            <Input
              required
              name="site-url"
              type="text"
              placeholder="Enter the site URL"
              defaultValue={siteUrl?.value || ""}
            />
            <div className="space-x-3">
              {siteUrl?.value ? (
                <Button disabled={loading["site-url"]}>
                  {loading["site-url"] ? "Updating..." : "Update"}
                </Button>
              ) : (
                <Button disabled={loading["site-url"]}>
                  {loading["site-url"] ? "Creating..." : "Create"}
                </Button>
              )}
            </div>
          </div>
        </form>

        <form
          onSubmit={(e) => handleSubmit(e, "site-title", siteTitle?._id || "")}
        >
          <div className="col-span-1 space-y-3">
            <Label htmlFor="">Site Title</Label>
            <Input
              required
              name="site-title"
              type="text"
              placeholder="Enter the site title"
              defaultValue={siteTitle?.value || ""}
            />
            <div className="space-x-3">
              {siteTitle?.value ? (
                <Button disabled={loading["site-title"]}>
                  {loading["site-title"] ? "Updating..." : "Update"}
                </Button>
              ) : (
                <Button disabled={loading["site-title"]}>
                  {loading["site-title"] ? "Creating..." : "Create"}
                </Button>
              )}
            </div>
          </div>
        </form>

        <form onSubmit={(e) => handleSubmit(e, "contact", contact?._id || "")}>
          <div className="col-span-1 space-y-3">
            <Label htmlFor="">Contact</Label>
            <Input
              required
              name="contact"
              type="text"
              placeholder="Enter the contact information"
              defaultValue={contact?.value || ""}
            />
            <div className="space-x-3">
              {contact?.value ? (
                <Button disabled={loading["contact"]}>
                  {loading["contact"] ? "Updating..." : "Update"}
                </Button>
              ) : (
                <Button disabled={loading["contact"]}>
                  {loading["contact"] ? "Creating..." : "Create"}
                </Button>
              )}
            </div>
          </div>
        </form>

        <form onSubmit={(e) => handleSubmit(e, "email", email?._id || "")}>
          <div className="col-span-1 space-y-3">
            <Label htmlFor="">Email</Label>
            <Input
              required
              name="email"
              type="email"
              placeholder="Enter the email address"
              defaultValue={email?.value || ""}
            />
            <div className="space-x-3">
              {email?.value ? (
                <Button disabled={loading["email"]}>
                  {loading["email"] ? "Updating..." : "Update"}
                </Button>
              ) : (
                <Button disabled={loading["email"]}>
                  {loading["email"] ? "Creating..." : "Create"}
                </Button>
              )}
            </div>
          </div>
        </form>

        {/* Privacy Policy Form */}
        <form
          onSubmit={(e) =>
            handleSubmit(e, "privacy-policy", privacyPolicy?._id || "")
          }
        >
          <div className="col-span-1 space-y-3">
            <Label htmlFor="">Privacy Policy</Label>
            <CKEditor
              config={{
                toolbar: [
                  "heading",
                  "|",
                  "bold",
                  "italic",
                  "link",
                  "bulletedList",
                  "numberedList",
                  "blockQuote",
                  "undo",
                  "redo",
                ],
              }}
              onReady={(editor) => {
                privacyEditorRef.current = editor;
                editor.editing.view.change((writer) => {
                  writer.setStyle(
                    "height",
                    "300px",
                    editor.editing.view.document.getRoot() as any
                  );

                  if (theme === "dark") {
                    writer.setStyle(
                      "background-color",
                      "#000000",
                      editor.editing.view.document.getRoot() as any
                    );
                    writer.setStyle(
                      "color",
                      "#ffffff",
                      editor.editing.view.document.getRoot() as any
                    );
                  } else {
                    writer.setStyle(
                      "background-color",
                      "#ffffff",
                      editor.editing.view.document.getRoot() as any
                    );
                    writer.setStyle(
                      "color",
                      "#000000",
                      editor.editing.view.document.getRoot() as any
                    );
                  }
                });
              }}
              editor={ClassicEditor}
              data={privacyPolicy?.value || ""}
              onChange={(event, editor) => {
                const data = editor.getData();
                setEditedPrivacyPolicy(data);
              }}
            />
            <div className="space-x-3">
              {privacyPolicy?.value ? (
                <Button disabled={loading["privacy-policy"]}>
                  {loading["privacy-policy"] ? "Updating..." : "Update"}
                </Button>
              ) : (
                <Button disabled={loading["privacy-policy"]}>
                  {loading["privacy-policy"] ? "Creating..." : "Create"}
                </Button>
              )}
            </div>
          </div>
        </form>

        {/* Terms & Conditions Form */}
        <form
          onSubmit={(e) =>
            handleSubmit(e, "terms-conditions", termsAndConditions?._id || "")
          }
        >
          <div className="col-span-1 space-y-3">
            <Label htmlFor="">Terms & Conditions</Label>
            <CKEditor
              config={{
                toolbar: [
                  "heading",
                  "|",
                  "bold",
                  "italic",
                  "link",
                  "bulletedList",
                  "numberedList",
                  "blockQuote",
                  "undo",
                  "redo",
                ],
              }}
              onReady={(editor) => {
                termsEditorRef.current = editor;
                editor.editing.view.change((writer) => {
                  writer.setStyle(
                    "height",
                    "300px",
                    editor.editing.view.document.getRoot() as any
                  );

                  if (theme === "dark") {
                    writer.setStyle(
                      "background-color",
                      "#000000",
                      editor.editing.view.document.getRoot() as any
                    );
                    writer.setStyle(
                      "color",
                      "#ffffff",
                      editor.editing.view.document.getRoot() as any
                    );
                  } else {
                    writer.setStyle(
                      "background-color",
                      "#ffffff",
                      editor.editing.view.document.getRoot() as any
                    );
                    writer.setStyle(
                      "color",
                      "#000000",
                      editor.editing.view.document.getRoot() as any
                    );
                  }
                });
              }}
              editor={ClassicEditor}
              data={termsAndConditions?.value || ""}
              onChange={(event, editor) => {
                const data = editor.getData();
                setEditedTermsAndCondition(data);
              }}
            />
            <div className="space-x-3">
              {termsAndConditions?.value ? (
                <Button disabled={loading["terms-conditions"]}>
                  {loading["terms-conditions"] ? "Updating..." : "Update"}
                </Button>
              ) : (
                <Button disabled={loading["terms-conditions"]}>
                  {loading["terms-conditions"] ? "Creating..." : "Create"}
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OptionsListTable;
