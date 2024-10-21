import { cookies } from "next/headers";

export const getServerToken = () => {
    const token = cookies().get("accessToken")?.value;
    if (token) {
      return token;
    } else {
      return null;
    }
  };
  