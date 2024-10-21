import { LinkPreview } from "../ui/link-preview";
import { useEffect, useState } from "react";
import { TOptions } from "../dashboard/options/OptionsListTable";
import Link from "next/link";
import { getOption } from "../../../actions/options/get-option";

export function Footer() {
  const [siteUrl, setSiteUrl] = useState<TOptions | null>(null);
  const [setTitle, setSiteTitle] = useState<TOptions | null>(null);
  useEffect(() => {
    const getSiteUrlData = async () => {
      try {
        const response = await getOption("site-url");
        const titleResponse = await getOption("site-title");
        setSiteUrl(response?.data);
        setSiteTitle(titleResponse?.data);
      } catch (error) {
        console.log(error);
      }
    };
    getSiteUrlData();
  }, []);
  return (
    <div className="z-20 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-4 md:mx-8 flex h-14 items-center">
        <div className="text-xs md:text-sm leading-loose text-muted-foreground text-left">
          © {new Date().getFullYear()} -{" "}
          <Link
            href={siteUrl?.value! || "#"}
            className="font-medium hover:dark:text-primary hover:trans"
          >
            {setTitle?.value}
          </Link>{" "}
          All Rights Reserved.
        </div>
      </div>
    </div>
  );
}
