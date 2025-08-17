import { createContext, useContext } from "react";

// createContext used to create the store and useContext to consume what is in the store

// we want to create our global store by giving a name
export const AuthContext = createContext({})

// we want to consume the store via our own custom hook, we pass our AuthContext store to the useContext so that the values can be returned via our custom hook
export const useAuth = ()=> {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be provided within a provider context")
    }   //this check ensures that only components provided within the context is seen or exists
    return context;
}