import { createContext } from "react";
//
import { IUserType } from "../types/userType";

type ContextType = {
  user: IUserType;
  onboard: (name: string, email: string) => Promise<void>;
  update: (data: IUserType) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext({} as ContextType);
