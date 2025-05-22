import axios from "axios";

const getTasks = async (filter: any) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/task/bulk`,
      {
        params: {
          order: filter.order,
          status: filter.status,
          priority: filter.priority,
        },
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    console.log(response);
    return response.data;
  } catch (error: any) {
    throw new Error("Failed to fetch tasks: " + error.message)
  }
};

export default getTasks;
