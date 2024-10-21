/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import handleAxiosError from "@/handlers/axios/error";
import { ErrorResponse } from "@/interface/error";
import axios from "@/lib/axios";
import { AxiosError } from "axios";

export const getAllService = async () => {
  try {
    const response = await axios.get(`/service/get-all-service`);
    return response.data;
  } catch (error: any) {
;
    return handleAxiosError(error as AxiosError<ErrorResponse>);
  }
};