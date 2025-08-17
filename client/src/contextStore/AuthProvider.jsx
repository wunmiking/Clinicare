import { useState } from "react";
import { AuthContext } from ".";
import { getAuthenticatedUser, refreshAccessToken } from "../api/auth";
import { useQuery } from "@tanstack/react-query";
import { LazyLoader } from "@/components/LazyLoader";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null); //default value of logged-in user
  const [accessToken, setAccessToken] = useState(null); //set and save accessToken in state memory
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // query to refresh accessToken on app start
  useQuery({
    queryKey: ["refresh_token"],
    queryFn: async () => {
      const res = await refreshAccessToken();
      // make an api call to get the new accessToken, then update it in our accessTokenstate using the setAccessToken setter func
      if (res.status === 200) {
        const newAccessToken = res.data?.data?.accessToken;
        setAccessToken(newAccessToken);
        return res;
      } else {
        setAccessToken(null); //if res.status is not 200, remove the accessToken and force a logout
        return null;
      }
    },

    onError: async (error) => {
      console.error("Error refreshing token", error);
      setAccessToken(null)
    },

    enabled: !accessToken, //ensure it runs only when we have accessToken
    retry: false, //won't run again if the queryFn fails
  });

  // fetch Auth User
  useQuery({
    queryKey: ["auth_user"], //cache key for our api call
    queryFn: async () => {
      setIsAuthenticating(true);
      const res = await getAuthenticatedUser(accessToken);
      if (res.status === 200) {
        setUser(res.data?.data); //hold the value from our res in our user state
        setIsAuthenticating(false);
        return res;
      }
      setIsAuthenticating(false);
      return null;
    },
    onError: (error) => {
      console.error("Error fetching user", error);
    },
    enabled: !!accessToken, //run only when we have the accessToken
  });

  console.log(user);
  console.log(accessToken);

  if (isAuthenticating) {
    return <LazyLoader />;
  }

  // return <AuthContext.Provider value ={{ user, setAccessToken, isCheckingAuth }}>
  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, user }}>
      {children}
    </AuthContext.Provider>
  );
}
