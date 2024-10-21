import { ProjectListTable } from "./ProjectListTable";

const ProjectListContainer = () => {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between space-y-2 mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
      </div>
      <ProjectListTable />
    </div>
  );
};

export default ProjectListContainer;
