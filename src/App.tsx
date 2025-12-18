import GlobalLayout from "@/components/GlobalLayout";
import Activity from "@/routes/Activity";
import Error from "@/routes/Error";
import Home from "@/routes/Home";
import "@/styles/globals.css";
import type { FC } from "react";
import { Route, Routes } from "react-router";

const App: FC = () => {
  return (
    <Routes>
      <Route element={<GlobalLayout />} errorElement={<Error />}>
        <Route path="/" element={<Home />} />
        <Route path="/activity" element={<Activity />} />
      </Route>
    </Routes>
  );
};

export default App;
