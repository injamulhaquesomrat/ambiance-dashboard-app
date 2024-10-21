/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import handleAxiosError from "@/handlers/axios/error";
import { ErrorResponse } from "@/interface/error";
import axios from "@/lib/axios";
import { AxiosError } from "axios";

export const forgotPassword = async (data: {email:string}) => {
  try {
    const response = await axios.post(`/auth/forget-password`, data);
    console.log(response?.data);
    return response.data;
  } catch (error: any) {
    console.log(error?.data);
    return handleAxiosError(error as AxiosError<ErrorResponse>);
  }
};
