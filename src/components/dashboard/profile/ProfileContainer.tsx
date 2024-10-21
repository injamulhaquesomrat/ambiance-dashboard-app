import ProfileDetails from "./ProfileDetails";

const ProfileContainer = () => {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
      </div>
      <ProfileDetails />
    </div>
  );
};

export default ProfileContainer;
