"use client";
import React from "react";
import { AddServiceForm } from "./AddServiceForm";

const AddServiceContainer = () => {

  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between mb-6 space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Add Service</h2>
      </div>
      <AddServiceForm />
    </div>
  );
};

export default AddServiceContainer;
