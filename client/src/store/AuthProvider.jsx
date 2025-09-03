import { AuthContext } from ".";
import { useEffect, useState } from "react";
import { getAuthenticatedUser, refreshAccessToken } from "@/api/auth";
import { useQuery } from "@tanstack/react-query";
import { LazyLoader } from "@/components/LazyLoader";

export default function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  // const [isAuthenticating, setIsAuthenticating] = useState(false);

  //query to refresh accessToken on app start
  useQuery({
    queryKey: ["refresh_token"],
    queryFn: async () => {
      const res = await refreshAccessToken();
      if (res.status === 200) {
        const newAccessToken = res.data?.data?.accessToken;
        setAccessToken(newAccessToken);
        return res;
      } else {
        setAccessToken(null);
        return null;
      }
    },
    onError: async (error) => {
      console.error("Error refreshing token", error);
      setAccessToken(null);
    },
    enabled: !accessToken,
    retry: false,
  });

  //fetch auth user
  // useQuery({
  //   queryKey: ["auth_user"],
  //   queryFn: async () => {
  //     setIsAuthenticating(true);
  //     const res = await getAuthenticatedUser(accessToken);
  //     if (res.status === 200) {
  //       setUser(res.data?.data);
  //       setIsAuthenticating(false);
  //       return res;
  //     } else {
  //       const res = await refreshAccessToken();
  //       if (res.status === 200) {
  //         const newAccessToken = res.data?.data?.accessToken;
  //         setAccessToken(newAccessToken);
  //       }
  //     }
  //     setIsAuthenticating(false);
  //     return null;
  //   },
  //   onError: async (error) => {
  //     console.error("Error fetching user", error);
  //   },
  //   enabled: !!accessToken,
  // });


 

  const { isPending, data } = useQuery({
    queryKey: ["auth_user", accessToken],
    queryFn: () => getAuthenticatedUser(accessToken),
    onError: async (error) => {
      console.error("Error fetching user", error);
    },
    enabled: !!accessToken,
  });

 

  useEffect(() => {
    if (data?.status === 200) {
      setUser(data?.data?.data);
    }
  }, [data?.data?.data, data?.status]);

    if (isPending && accessToken) {
    return <LazyLoader />;
  };

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, user }}>
      {children}
    </AuthContext.Provider>
  );
}
