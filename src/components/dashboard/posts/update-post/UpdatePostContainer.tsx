import React from "react";
import { UpdatePostForm } from "./UpdatePostForm";

const UpdatePostContainer = ({id}:{id:string}) => {

  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Update Post</h2>
      </div>
      <UpdatePostForm id={id} />
    </div>
  );
};

export default UpdatePostContainer;
