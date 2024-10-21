import { getServerToken } from "@/lib/get-server-token";
import { redirect } from "next/navigation";
import { FC, ReactNode } from "react";

const AuthLayout: FC<{ children: ReactNode }> = ({ children }) => {
    const token = getServerToken();
    if(token){
        redirect("/dashboard")
    }
  return <div className="auth-layout">{children}</div>;
};

export default AuthLayout;
