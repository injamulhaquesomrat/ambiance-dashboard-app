import { UserContentTable } from "@/components/user-content";
import SocialsListTable from "./SocialsListTable";

const SocialListContainer = () => {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Socials</h2>
      </div>
      <SocialsListTable />
    </div>
  );
};

export default SocialListContainer;
