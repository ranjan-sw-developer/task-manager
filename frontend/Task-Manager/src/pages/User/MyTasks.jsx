import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { LuFileSpreadsheet } from "react-icons/lu";
import TaskStatusTab from "../../components/TaskStatusTab";
import TaskCard from "../../components/cards/TaskCard";

const MyTasks = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const navigate = useNavigate();

  const getAllTask = async () => {
    try {
      const response = await axiosInstance(API_PATHS.TASKS.GET_ALL_TASKS, {
        params: {
          status: filterStatus === "All" ? "" : filterStatus,
        },
      });

      if (response?.data) {
        setAllTasks(response.data?.tasks.length > 0 ? response.data.tasks : []);

        const statusSummary = response.data.statusSummary || {};

        const statusArray = [
          { label: "All", count: statusSummary.all || 0 },
          { label: "Pending", count: statusSummary.pendingTasks || 0 },
          { label: "In Progress", count: statusSummary.inProgressTasks || 0 },
          { label: "Completed", count: statusSummary.completedTasks || 0 },
        ];

        setTabs(statusArray);
      }
    } catch (error) {
      console.log("Error fetching tasks:", error);
    }
  };

  const handleClick = (taskId) => {
    navigate(`/user/task-details/${taskId}`);
  };

  useEffect(() => {
    getAllTask();

    return () => {};
  }, [filterStatus]);
  return (
    <DashboardLayout activeMenu="My Tasks">
      <div className="my-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <h2 className="text-xl md:text-xl font-medium">My Tasks</h2>

          {tabs?.[0]?.count > 0 && (
            <TaskStatusTab
              tabs={tabs}
              activeTab={filterStatus}
              setActiveTab={setFilterStatus}
            />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {allTasks?.map((item, index) => (
            <TaskCard
              key={index}
              title={item.title}
              description={item.description}
              priority={item.priority}
              status={item.status}
              progress={item.progress}
              createdAt={item.createdAt}
              dueDate={item.dueDate}
              assignedTo={item.assignedTo?.map((item) => item.profileImageUrl)}
              attachmentCount={item.attachments.count || 0}
              completedTodoCount={item.completedTodoCount || 0}
              todoCheckList={item.todoChecklist || []}
              onClick={() => {
                handleClick(item._id);
              }}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyTasks;
