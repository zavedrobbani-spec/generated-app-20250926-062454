import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { AppLayout } from '@/pages/HomePage'
import { DashboardPage } from "@/pages/DashboardPage";
import { ConnectorsPage } from "@/pages/ConnectorsPage";
import { UsersPage } from "@/pages/UsersPage";
import { RoutingPage } from "@/pages/RoutingPage";
import { FiltersPage } from "@/pages/FiltersPage";
import { SendMessagePage } from "@/pages/SendMessagePage";
import { SettingsPage } from "@/pages/SettingsPage";
const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "connectors", element: <ConnectorsPage /> },
      { path: "users", element: <UsersPage /> },
      { path: "routing", element: <RoutingPage /> },
      { path: "filters", element: <FiltersPage /> },
      { path: "send-message", element: <SendMessagePage /> },
      { path: "settings", element: <SettingsPage /> },
    ]
  },
]);
// Do not touch this code
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </StrictMode>,
)