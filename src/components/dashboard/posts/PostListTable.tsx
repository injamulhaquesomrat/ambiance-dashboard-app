"use client";
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

import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
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
import { getAllPost } from "../../../../actions/post/get-all-post";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { generateImage } from "@/lib/utils";
import { deletePost } from "../../../../actions/post/delete-post";
import { IPosts } from "@/interface/post.interface";

export function PostListTable() {
  // Explicitly define the state type as an array of Companies
  const [posts, setPosts] = useState<IPosts[] | []>([]);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [refetch, setRefetch] = useState<boolean>(false);

  //get All The Post And set To Post State
  useEffect(() => {
    const getAllPosts = async () => {
      try {
        const response = await getAllPost();
        setPosts(response?.data);
      } catch (error) {
        console.log(error);
      }
    };
    getAllPosts();
  }, [refetch]);

  const handleDeletePost = async (id: string) => {
    const response = await deletePost(id);
    if (response?.error) {
      return toast.error(response?.error);
    }
    toast.success(response?.message);
    setRefetch(true);
  };

  const data: IPosts[] = posts ?? [];

  const columns: ColumnDef<IPosts>[] = [
    {
      accessorKey: "banner",
      header: "Post Banner",
      cell: ({ row }) => (
        <div>
          <Image
            height={16}
            width={60}
            src={generateImage(row.getValue("banner"))}
            alt={`Post Banner`}
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
            Post Title
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("title")}</div>
      ),
    },
    // {
    //   accessorKey: "images",
    //   header: "Post Images",
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
      accessorKey: "description",
      header: "Post Description",
      cell: ({ row }) => (
        <div className="capitalize line-clamp-2">
          {row.getValue("description")}
        </div>
      ),
    },
    {
      accessorKey: "subtitle",
      header: "Post Subtitle",
      cell: ({ row }) => (
        <div className="capitalize line-clamp-2">
          {row.getValue("subtitle")}
        </div>
      ),
    },
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
              <Link href={`/dashboard/posts/${row?.original?._id}/update-post`}>
                <DropdownMenuItem className="cursor-pointer">
                  Edit
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem
                onClick={() => handleDeletePost(row?.original?._id)}
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
    <div className="w-full p-6 bg-white dark:bg-[#0A0A0A] rounded-md">
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
            {table.getRowModel().rows.length > 0 ? (
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
