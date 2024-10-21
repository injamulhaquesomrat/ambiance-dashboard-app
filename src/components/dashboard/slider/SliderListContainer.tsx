import { AddUpdateSlider } from "./AddUpdateSlider";

const SliderListContainer = () => {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between space-y-2 mb-6">
        <h2 className="text-3xl font-bold tracking-tight">All Slider</h2>
      </div>
      <AddUpdateSlider />
    </div>
  );
};

export default SliderListContainer;
