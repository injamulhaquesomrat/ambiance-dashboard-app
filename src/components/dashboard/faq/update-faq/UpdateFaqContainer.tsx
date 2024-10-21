import { UpdateFaqForm } from "./UpdateFaqForm";

const UpdateFaqContainer = ({ id }: { id: string }) => {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Update FAQ</h2>
      </div>
      <UpdateFaqForm id={id}/>
    </div>
  );
};

export default UpdateFaqContainer;
