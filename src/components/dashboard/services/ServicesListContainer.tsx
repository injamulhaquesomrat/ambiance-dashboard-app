import { ServicesListTable } from "./ServicesListTable";

const ServiceListContainer = () => {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between space-y-2 mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Services</h2>
      </div>
      <ServicesListTable />
    </div>
  );
};

export default ServiceListContainer;
