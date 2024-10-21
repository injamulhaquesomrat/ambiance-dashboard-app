import { FaqListTable } from "./FaqListTable";

const FaqListContainer = () => {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between space-y-2 mb-6">
        <h2 className="text-3xl font-bold tracking-tight">FAQs</h2>
      </div>
      <FaqListTable />
    </div>
  );
};

export default FaqListContainer;
