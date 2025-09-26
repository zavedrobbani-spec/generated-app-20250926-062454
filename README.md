# Jasmin Pulse

A modern, intuitive, and visually stunning web interface for managing and monitoring the Jasmin SMS Gateway.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/zavedrobbani-spec/generated-app-20250926-062454)

## About The Project

Jasmin Pulse is a visually stunning, minimalist web application for managing and operating the Jasmin SMS Gateway (v0.11). It provides a clean, intuitive, and responsive interface to replace complex command-line operations. The application features a real-time dashboard for monitoring system health, throughput, and connector status. It offers full CRUD (Create, Read, Update, Delete) functionality for key Jasmin components including Connectors, Users, Groups, Routing Rules, and Filters. A dedicated interface allows for sending test messages with ease. The entire experience is designed to be seamless, efficient, and visually pleasing, transforming Jasmin gateway management into a delightful task.

## Key Features

-   **Real-time Dashboard**: At-a-glance overview of the gateway's status, including connector states, message throughput (MPS), and queue metrics.
-   **Connector Management**: Full CRUD functionality for SMPP and HTTP connectors.
-   **User & Group Management**: Easily create, edit, and delete users and groups, and manage their permissions.
-   **Advanced Routing**: A dedicated interface for managing Standard, Static, and Failover routing rules.
-   **Message Filtering**: Create, edit, and prioritize filters to control message flow based on various criteria.
-   **Send Test Messages**: A simple and direct form for sending test SMS messages to validate configuration and connectivity.
-   **Modern & Responsive UI**: A beautiful, minimalist interface that works flawlessly on any device.

## Technology Stack

-   **Frontend**: React, Vite, React Router, Tailwind CSS
-   **UI Components**: shadcn/ui, Lucide React
-   **State Management**: Zustand
-   **Animations**: Framer Motion
-   **Charts**: Recharts
-   **Backend**: Cloudflare Workers, Hono
-   **Language**: TypeScript

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Bun](https://bun.sh/) installed on your machine.
-   A [Cloudflare account](https://dash.cloudflare.com/sign-up).
-   Wrangler CLI, authenticated with your Cloudflare account.
    ```sh
    bunx wrangler login
    ```

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/jasmin-pulse.git
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd jasmin-pulse
    ```
3.  **Install dependencies:**
    ```sh
    bun install
    ```

## Development

To run the application in a local development environment, which includes hot-reloading for both the frontend and the worker:

```sh
bun dev
```

The application will be available at `http://localhost:3000`.

## Project Structure

The project is organized into three main directories:

-   `src/`: Contains the entire React frontend application, including pages, components, hooks, and styles.
-   `worker/`: Contains the Cloudflare Worker backend code, built with Hono. This is where all API routes and logic reside.
-   `shared/`: Contains TypeScript types and interfaces that are shared between the frontend and the backend to ensure type safety.

## Deployment

This project is designed for easy deployment to Cloudflare's global network.

### Manual Deployment via CLI

1.  **Build the application:**
    ```sh
    bun run build
    ```
2.  **Deploy to Cloudflare Workers:**
    ```sh
    bun run deploy
    ```

This command will build the frontend application and deploy both the static assets and the worker code to your Cloudflare account.

### One-Click Deployment

You can also deploy this project to your Cloudflare account with a single click.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/zavedrobbani-spec/generated-app-20250926-062454)

## License

Distributed under the MIT License. See `LICENSE` for more information.