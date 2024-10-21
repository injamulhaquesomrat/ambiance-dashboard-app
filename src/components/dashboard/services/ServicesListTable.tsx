"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { DataTablePagination } from "@/components/table-pagination";
import { deleteService } from "../../../../actions/service/delete-service";
import { getAllService } from "../../../../actions/service/get-all-services";
import { toast } from "sonner";
import { IService } from "@/interface/service.interface";
import { generateImage } from "@/lib/utils";

export function ServicesListTable() {
  const [services, setServices] = React.useState<IService[] | []>([]);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [refetch, setRefetch] = React.useState<boolean>(false);

  //get All The Post And set To Post State
  React.useEffect(() => {
    const getAllServiceData = async () => {
      try {
        const response = await getAllService();

        setServices(response?.data);
      } catch (error) {
        console.log(error);
      }
    };
    getAllServiceData();
  }, [refetch]);

  //Delete Service Handler
  const handleDeleteProject = async (id: string) => {
    const response = await deleteService(id);
    if (response?.error) {
      return toast.error(response?.error);
    }
    toast.success(response?.message);
    setRefetch(true);
  };

  const data: IService[] = services ?? [];

  const columns: ColumnDef<IService>[] = [
    {
      accessorKey: "thumbnail",
      header: "Thumbnail",
      cell: ({ row }) => (
        <div>
          <Image
            height={16}
            width={60}
            src={generateImage(row.getValue("thumbnail"))}
            alt={`Thumbnail`}
          />
        </div>
      ),
    },
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Title
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("title")}</div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div className="capitalize line-clamp-2">
          {row.getValue("description")}
        </div>
      ),
    },
    // {
    //   accessorKey: "banner",
    //   header: "Post Banner",
    //   cell: ({ row }) => (
    //     <div>
    //       <Image
    //         height={16}
    //         width={60}
    //         src={generateImage(row.getValue("banner"))}
    //         alt={`Post Banner`}
    //       />
    //     </div>
    //   ),
    // },

    {
      accessorKey: "reviews",
      header: "Reviews",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("reviews")}</div>
      ),
    },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("rating")}</div>
      ),
    },
    // {
    //   accessorKey: "images",
    //   header: "Images",
    //   cell: ({ row }) => (
    //     <div className="flex">
    //       {(row.getValue("images") as string[]).map(
    //         (Img: string, index: number) => (
    //           <Image
    //             height={16}
    //             width={60}
    //             key={index}
    //             src={generateImage(Img)}
    //             alt={`Image ${index}`}
    //           />
    //         )
    //       )}
    //     </div>
    //   ),
    // },
    {
      accessorKey: "created_by",
      header: "Created By",
      cell: ({ row }) => {
        const createdBy = row.original.created_by;
        return (
          <div className="capitalize">
            {createdBy?.first_name} {createdBy?.last_name}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Action",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Link
                href={`/dashboard/services/${row?.original?._id}/update-service`}
              >
                <DropdownMenuItem className="cursor-pointer">
                  Edit
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem
                onClick={() => handleDeleteProject(row?.original?._id)}
                className="cursor-pointer"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full py-4 p-6 bg-white dark:bg-[#0A0A0A] rounded-md">
      <div className="flex items-center py-4">
        {/* <Input
          placeholder="Filter company names..."
          value={
            (table.getColumn("companyName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("companyName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        /> */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
