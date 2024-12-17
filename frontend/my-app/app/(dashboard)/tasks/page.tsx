"use client";
import { MdOutlinePendingActions } from "react-icons/md";
import { FaFilter } from "react-icons/fa";
import { MdOutlinePriorityHigh } from "react-icons/md";
import { FaSortAlphaDownAlt } from "react-icons/fa";
import { Checkbox } from "@/components/ui/checkbox";
import DateFormat from "@/components/ui/dateFormat";
import LoadingComponent from "@/components/ui/LoadingComponent";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import getTasks from "@/lib/actions/getTasks";
import {
  priorityDropDown,
  sortDropDown,
  statusDropDown,
  Task,
} from "@/lib/types";
import { useEffect, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CreateDialog } from "@/components/CreateDialog";
import EditDialogBox from "@/components/EditDialog";

type filter = {
  order: string | null;
  status: string | null;
  priority: number | null;
};
const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedId] = useState<number[]>([]);
  const [filter, setFilter] = useState<filter>({
    order: null,
    status: null,
    priority: null,
  });
  console.log(tasks);

  const sendDeleteRequest = () => {
    if (!selectedIds) {
      setError("no id selected");
      alert(error);
      return;
    }
    if (selectedIds) {
      axios({
        method: "delete",
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/task`,
        headers: {
          Authorization: localStorage.getItem("token"),
        },
        data: { ids: selectedIds },
      })
        .then((res) => {
          console.log("Tasks deleted:", res.data);
          window.location.reload();
        })
        .catch((err) => {
          console.error("Error occurred:", err.response?.data || err.message);
        });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError("");
        const response: any = await getTasks(filter);
        console.log(response.tasks);
        if (response) {
          const sortedTasks = response.tasks.sort(
            (a: any, b: any) => b.taskId - a.taskId
          );
          setTasks(sortedTasks);
        }
        if (response.tasks.length == 0) {
          setError("No Task Found with this filter");
        }
      } catch (e) {
        setError(`Failed to load tasks.`);
        setTasks([]);
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filter]);

  if (loading) {
    return (
      <div className="w-full h-full">
        <LoadingComponent />
      </div>
    );
  }
  return (
    <div>
      <div className="border py-2 px-10 flex justify-between items-end gap-2">
        <div className="flex gap-2 ">
          <CreateDialog />
          <Button className="bg-red-600" onClick={sendDeleteRequest}>
            Delete Selected
          </Button>
        </div>

        <div>
          <DropdownMenu>
            <DropdownMenuTrigger
              className="px-4 py-1 outline-none rounded-lg hover:bg-zinc-200"
              onClick={() => {
                setFilter({
                  status: null,
                  order: null,
                  priority: null,
                });
              }}
            >
              <div className="flex justify-center items-center gap-1">
                <FaFilter />
                Clear Filter
              </div>
            </DropdownMenuTrigger>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger
              className={`${
                filter.order ? "bg-zinc-300" : ""
              } px-4 py-1 outline-none rounded-lg hover:bg-zinc-200`}
            >
              <div className={`flex justify-center items-center gap-1`}>
                <FaSortAlphaDownAlt />
                Sort
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {sortDropDown.map((item, index) => {
                return (
                  <DropdownMenuItem
                    key={index}
                    onClick={() => {
                      setFilter((prev) => ({
                        ...prev,
                        order: item.value,
                      }));
                    }}
                  >
                    {item.title}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger
              className={`${
                filter.status ? "bg-zinc-300" : ""
              } px-4 py-1 outline-none rounded-lg hover:bg-zinc-200`}
            >
              <div className="flex justify-center items-center gap-1">
                <MdOutlinePendingActions />
                Status
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {statusDropDown.map((item, index) => {
                return (
                  <DropdownMenuItem
                    key={index}
                    onClick={() => {
                      setFilter((prev) => ({
                        ...prev,
                        status: item.value,
                      }));
                    }}
                  >
                    {item.title}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger
              className={`${
                filter.priority ? "bg-zinc-300" : ""
              } px-4 py-1 outline-none rounded-lg hover:bg-zinc-200`}
            >
              <div className="flex justify-center items-center gap-1">
                <MdOutlinePriorityHigh />
                Priority
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {priorityDropDown.map((item, index) => {
                return (
                  <DropdownMenuItem
                    key={index}
                    onClick={() => {
                      setFilter((prev) => ({
                        ...prev,
                        priority: item.value,
                      }));
                    }}
                  >
                    {item.title}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div>
        <Table>
          <TableCaption>{error}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">
                <Checkbox
                  onCheckedChange={(e) => {
                    if (e) {
                      const ids = tasks.map((item) => item.id);
                      setSelectedId(ids);
                    } else {
                      setSelectedId([]);
                    }
                  }}
                />
              </TableHead>
              <TableHead>Task Id</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Updated Date</TableHead>
              <TableHead>Edit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((item, index) => {
              return (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    <Checkbox
                      checked={selectedIds.includes(item.id)}
                      onCheckedChange={(e) => {
                        if (e) {
                          setSelectedId((prev) => [...prev, item.id]);
                        } else {
                          setSelectedId((prev) =>
                            prev.filter((id) => id !== item.id)
                          );
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>{index}</TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>{item.priority}</TableCell>
                  <TableCell>
                    <DateFormat date={item.startDate} />
                  </TableCell>
                  <TableCell>
                    <DateFormat date={item.endDate} />
                  </TableCell>
                  <TableCell>
                    <DateFormat date={item.updatedDate} />
                  </TableCell>
                  <TableCell>
                    <EditDialogBox task={item} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Tasks;
