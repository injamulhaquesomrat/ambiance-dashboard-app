import { permanentRedirect } from "next/navigation";

const page = () => {
  return permanentRedirect("/dashboard");
};

export default page;
