"use client";
import { FaEdit } from "react-icons/fa";

import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaSortAlphaDownAlt } from "react-icons/fa";
import { Switch } from "./ui/switch";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { DatePicker } from "./DatePicker";
import { useState } from "react";
import LoadingComponent from "./ui/LoadingComponent";

export function EditDialogBox({ task }: { task: any }) {
  const [title, setTitle] = useState<string | null>();
  const [description, setDescription] = useState<string | null>();
  const [status, setStatus] = useState<string | null>();
  const [priority, setPriority] = useState<number | null>();
  const [startDate, setStartDate] = useState<Date | null>();
  const [endDate, setEndDate] = useState<Date | null>();
  const [error, setError] = useState<string | null>();
  const [loading, setLoading] = useState(false);
  const [IsStartDateValid, setIsStartDateValid] = useState(true);
  const [IsEndDateValid, setIsEndDateValid] = useState(true);
  const [open, setOpen] = useState(false);

  const sendRequest = async () => {
    if (
      !title ||
      !status ||
      !description ||
      !priority ||
      !startDate ||
      !endDate
    ) {
      setError("Select atlest one field");
    }
    if (
      IsStartDateValid &&
      IsEndDateValid &&
      (title || status || description || priority)
    ) {
      setLoading(true);
      setError(null);
      axios
        .put(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/task/${task.id}`,
          {
            title: title,
            description: description,
            status: status,
            startDate: startDate,
            endDate: endDate,
            priority: priority,
            updatedDate: new Date(),
          },
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        )
        .then((res) => {
          if (res.status >= 200 && res.status < 300) {
            setLoading(false);
            setOpen(false);
            window.location.reload();
          }
        })
        .catch((err) => {
          console.error("Error occurred:", err.response?.data || err.message);
          setError(
            err.response?.data?.error ||
              "Something went wrong. Please try again."
          );
          setLoading(false);
        });
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="p-2">
          <FaEdit className="text-lg text-zinc-700 hover:text-zinc-950" />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] ">
        {loading && (
          <div className="absolute z-50 flex justify-center items-center w-full h-full bg-[#796e6e63]">
            <LoadingComponent />
          </div>
        )}
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4 ">
          {error && <p className="text-red-700 text-xs text-center">{error}</p>}
          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="title">Title*</Label>
              <Input
                id="title"
                type="text"
                placeholder="Go To Gym"
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                type="text"
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            </div>
            <div className="flex gap-5 justify-between items-center">
              <div className="flex text-sm gap-2">
                <h2>PENDING</h2>
                <Switch
                  onCheckedChange={(e) => {
                    if (e) {
                      setStatus("DONE");
                    } else {
                      setStatus("PENDING");
                    }
                  }}
                />
                <h2>DONE</h2>
              </div>
              <div className="space-y-1">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className={`${
                      priority ? "bg-zinc-300" : ""
                    } px-4 py-1 outline-none rounded-lg hover:bg-zinc-200`}
                  >
                    <div className="flex justify-center items-center gap-1">
                      <FaSortAlphaDownAlt />
                      Priority
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {[1, 2, 3, 4, 5].map((item) => {
                      return (
                        <DropdownMenuItem
                          key={item}
                          onClick={() => {
                            setPriority(item);
                          }}
                        >
                          {item}
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="flex gap-5 justify-between">
              <div className="flex flex-col">
                <label htmlFor="startDate">Start-Date*</label>
                <DatePicker
                  onSelect={(date: any) => {
                    const startDateValid = Boolean(date >= task.startDate);
                    if (startDateValid) {
                      setIsStartDateValid(startDateValid);
                      setStartDate(date);
                    }
                  }}
                />
                {!IsStartDateValid && (
                  <p className="text-red-700 text-xs">
                    Start-Date is required!
                  </p>
                )}
              </div>
              <div className="flex flex-col">
                <label htmlFor="endDate">End-Date*</label>
                <DatePicker
                  onSelect={(date: any) => {
                    const endDateValid = Boolean(date >= task.startDate);
                    setIsEndDateValid(endDateValid);
                    if (endDateValid) {
                      setEndDate(date);
                    }
                  }}
                />
                {!IsEndDateValid && (
                  <p className="text-red-700 text-xs">End-Date is required!</p>
                )}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={sendRequest}>
            Edit Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditDialogBox;
