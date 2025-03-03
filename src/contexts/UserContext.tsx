import { User } from "@supabase/supabase-js";
import { createContext, ReactNode, useEffect, useState } from "react";
import {
  supabase,
  checkIfUserExists,
  createUserInitialStatistics,
} from "../data/supabase";

interface UserContextData {
  user: User;
  clearUser: () => void;
}

interface UserProviderProps {
  children: ReactNode;
}

export const UserContext = createContext({} as UserContextData);
export function UserProvider({ children, ...rest }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  function clearUser() {
    setUser(null);
  }

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user) {
        return;
      }

      const userExists = await checkIfUserExists(data.user.id);

      if (!userExists) {
        await createUserInitialStatistics(data.user.id);
      }

      setUser(data.user);
    };

    fetchUser();
  }, []);

  return <UserContext.Provider value={{ user, clearUser }}>{children}</UserContext.Provider>;
}
