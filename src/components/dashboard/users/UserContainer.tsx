import { UserContentTable } from "@/components/user-content";

const UserContainer = () => {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Users</h2>
      </div>
      <UserContentTable />
    </div>
  );
};

export default UserContainer;
