import { useEffect, useState } from "react";
import axios from "axios";

const useGetUser = (userIds) => {
  const [userNames, setUserNames] = useState({});
  const [isPending, setIsPending] = useState(false);
  useEffect(() => {
    const fetchUserNames = async () => {
      try {
        setIsPending(true);

        // Assuming you have an API endpoint to fetch user data
        const userRequests = userIds.map(async (userId) => {
          const response = await axios.get(
            `https://techops.sohochor.com/api/users/getUserById/${userId}`
          );
          return { [userId]: response.data.username };
        });

        const userData = await Promise.all(userRequests);

        // Merge the user names into a single object
        const mergedUserNames = Object.assign({}, ...userData);
        setUserNames(mergedUserNames);
      } catch (error) {
        console.error("Error fetching user names:", error);
      } finally {
        setIsPending(false);
      }
    };

    // Fetch user names only if there are valid userIds provided
    if (userIds && userIds.length > 0) {
      fetchUserNames();
    } else {
      // Reset user names if no valid userIds are provided
      setUserNames({});
    }
  }, [userIds]);

  return [userNames, isPending];
};

export default useGetUser;
