import { AddFaqForm } from "./AddFaqForm";

const AddFaqContainer = () => {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between mb-6 space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Add FAQ</h2>
      </div>
      <AddFaqForm />
    </div>
  );
};

export default AddFaqContainer;
