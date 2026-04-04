import { Outlet } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "@/components/Navigation";

function App() {
  return (
    <TooltipProvider delayDuration={200}>
      <div className="min-h-screen bg-gradient-to-b from-violet-50/80 via-background to-background dark:from-violet-950/25">
        <Navigation />
        <Outlet />
      </div>
    </TooltipProvider>
  );
}

export default App;
