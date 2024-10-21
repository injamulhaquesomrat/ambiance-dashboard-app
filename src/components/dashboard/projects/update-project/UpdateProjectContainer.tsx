"use client";
import React from "react";
import { UpdateProjectForm } from "./UpdateProjectForm";

const UpdateProjectContainer = ({ id }: { id: string }) => {


  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Update Project</h2>
      </div>
      <UpdateProjectForm id={id} />
    </div>
  );
};

export default UpdateProjectContainer;
