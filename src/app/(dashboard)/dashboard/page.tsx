import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import DashboardOverview from "@/components/dashboardOverview";
import PlaceholderContent from "@/components/placeholder-content";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { permanentRedirect } from "next/navigation";

const data = [
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    id: "489e1d42",
    amount: 125,
    status: "processing",
    email: "example@gmail.com",
  },
];

const DashboardPage = () => {
  return permanentRedirect("/dashboard/posts");
  // <AdminPanelLayout>
  //   <ContentLayout title="Dashboard">
  //     <Breadcrumb>
  //       <BreadcrumbList>
  //         <BreadcrumbItem>
  //           <BreadcrumbLink asChild>
  //             <Link href="/">Home</Link>
  //           </BreadcrumbLink>
  //         </BreadcrumbItem>
  //         <BreadcrumbSeparator />
  //         <BreadcrumbItem>
  //           <BreadcrumbPage>Dashboard</BreadcrumbPage>
  //         </BreadcrumbItem>
  //       </BreadcrumbList>
  //     </Breadcrumb>
  //     {/* <PlaceholderContent /> */}
  //     <DashboardOverview />
  //   </ContentLayout>
  // </AdminPanelLayout>
};

export default DashboardPage;
