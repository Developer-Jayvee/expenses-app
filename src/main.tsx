import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import Router from "@c/routes/index";
import ServerStatusAlert from "@c/components/alerts/ServerStatusAlert";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ServerStatusAlert />
    <RouterProvider router={Router} />
  </StrictMode>,
);
