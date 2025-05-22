export interface SignupResponse {
  token: string;
  userId: string;
}
export type BulkResponse = {
  tasks: Task[];
};

export type Task = {
  id: number;
  title: string;
  description: string;
  status: "PENDING" | "DONE";
  priority: number;
  startDate: Date;
  endDate: Date;
  updatedDate: Date;
};

export const sortDropDown = [
  {
    title: "Start-Date ASC",
    value: "startDate-asc",
  },
  {
    title: "Start-Date DESC",
    value: "startDate-desc",
  },
  {
    title: "End-Date ASC",
    value: "endDate-asc",
  },
  {
    title: "End-Date DESC",
    value: "endDate-desc",
  },
];

export const statusDropDown = [
  {
    title: "DONE",
    value: "DONE",
  },
  {
    title: "PENDING",
    value: "PENDING",
  },
];

export const priorityDropDown = [
  {
    title: "1",
    value: 1,
  },
  {
    title: "2",
    value: 2,
  },
  {
    title: "3",
    value: 3,
  },
  {
    title: "4",
    value: 4,
  },
  {
    title: "5",
    value: 5,
  },
];
