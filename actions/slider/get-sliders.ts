/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import handleAxiosError from "@/handlers/axios/error";
import { ErrorResponse } from "@/interface/error";
import axios from "@/lib/axios";
import { AxiosError } from "axios";

export const getSliderByType = async (selectedType: string) => {
  try {
    const response = await axios.get(`/slider/get-slider?type=${selectedType}`);
    return response.data;
  } catch (error: any) {
    return handleAxiosError(error as AxiosError<ErrorResponse>);
  }
};
