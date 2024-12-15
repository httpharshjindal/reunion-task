"use client";
import axios from "axios";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useEffect, useState } from "react";
import LoadingComponent from "@/components/ui/LoadingComponent";
const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/stats`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((res: any) => {
        console.log(res.data.stats);
        setStats(res.data.stats);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching stats:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full">
        <LoadingComponent />
      </div>
    );
  }
  return (
    <div className="dashboard p-4 flex justify-start items-center flex-col">
      <div className="flex justify-start items-start flex-col w-full">
        <h1 className="text-2xl font-bold mb-4 text-indigo-700">
          Task Statistics
        </h1>

        <Card className="mb-8 p-6">
          <h2 className="text-xl font-semibold mb-4 text-indigo-700">
            Overall Stats
          </h2>
          <ul>
            <li>Total Tasks: {stats.totalTasks}</li>
            <li>Completed Tasks: {stats.taskCompleted}</li>
            <li>Pending Tasks: {stats.taskPending}</li>
            <li>Completed Percentage: {stats.completedPercentage}%</li>
            <li>Pending Percentage: {stats.pendingPercentage}%</li>
            <li>Average Completion Time: {stats.avgCompletionTime} hours</li>
            <li>Total Time Spent: {stats.totalTimeSpent} hours</li>
            <li>
              Total Time Lapsed for Pending Tasks:{" "}
              {stats.totalPendingTimeLapsed} hours
            </li>
            <li>
              Total Time Remaining for Pending Tasks:{" "}
              {stats.totalPendingTimeRemaining} hours
            </li>
          </ul>
        </Card>
      </div>

      {/* Priority Table */}
      <div className="w-1/2 flex justify-center items-center border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]"></TableHead>
              <TableHead className="text-indigo-700">Pending Tasks</TableHead>
              <TableHead className="text-indigo-700">TimeLapsed</TableHead>
              <TableHead className="text-indigo-700">TimeRemaining</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.keys(stats.pendingTasksByPriority).map(
              (priority, index) => {
                const priorityStats = stats.pendingTasksByPriority[priority]; // Get the stats for each priority
                return (
                  <TableRow key={index}>
                    <TableCell>{priority}</TableCell>
                    <TableCell>{priorityStats.pendingTasks}</TableCell>
                    <TableCell>{priorityStats.timeLapsed}</TableCell>
                    <TableCell>{priorityStats.timeRemaining}</TableCell>
                  </TableRow>
                );
              }
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Dashboard;
