"use client";
import React from "react";
import { AddProjectForm } from "./AddProjectForm";

const AddProjectContainer = () => {

  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between mb-6 space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Add Project</h2>
      </div>
      <AddProjectForm />
    </div>
  );
};

export default AddProjectContainer;
