import OptionsListTable from "./OptionsListTable";

const OptionsListContainer = () => {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Options</h2>
      </div>
      <OptionsListTable />
    </div>
  );
};

export default OptionsListContainer;
