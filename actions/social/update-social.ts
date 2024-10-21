/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import handleAxiosError from "@/handlers/axios/error";
import { ErrorResponse } from "@/interface/error";
import axios from "@/lib/axios";
import { AxiosError } from "axios";

export const updateSocial = async (
  id: string,
  data: { name: string; url: string }
) => {
  console.log(data);
  try {
    const response = await axios.put(`/social/update-social/${id}`, data);
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    console.log(error?.response?.data);
    return handleAxiosError(error as AxiosError<ErrorResponse>);
  }
};
