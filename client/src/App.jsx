import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "sonner";
import AuthProvider from "./contextStore/AuthProvider";


//create/initialize a client
const queryClient = new QueryClient();
function App() {
  return (
    <>
      <Toaster richColors={true} position="top-right" />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
        
      </QueryClientProvider>
    </>
  );
}

export default App;
