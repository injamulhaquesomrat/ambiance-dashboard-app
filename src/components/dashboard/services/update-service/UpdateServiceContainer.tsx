"use client";
import React from "react";
import { UpdateServiceForm } from "./UpdateServiceForm";

const UpdateServiceContainer = ({ id }: { id: string }) => {

  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Update Service</h2>
      </div>
      <UpdateServiceForm id={id} />
    </div>
  );
};

export default UpdateServiceContainer;
