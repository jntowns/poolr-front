# Poolr Frontend

> A modern, responsive, and intuitive user interface for the Poolr carpooling platform.

Poolr is a proof-of-concept carpooling application developed as a university group project, designed to connect drivers and riders seamlessly. This repository houses the frontend application, built with the latest Vue 3 ecosystem to ensure a smooth and reactive user experience. The backend repository can be found [here](https://github.com/jntowns/poolr-back).

## Key Features

*   **Modern UI/UX**: Built with **Vue 3** and **Tailwind CSS** for a sleek, responsive, and accessible design.
*   **Interactive Maps**: Integrated **Leaflet** maps for visualizing routes, pickup points, and ride details.
*   **Real-Time Search**: Dynamic ride searching with instant filtering and address autocomplete.
*   **Role-Based Views**: Distinct, optimized flows for both Drivers (offering rides) and Passengers (finding rides).
*   **Internationalization**: Full multi-language support (English & French) using **Vue I18n**.
*   **State Management**: Centralized state management with **Pinia** for consistent data flow across the application.

## Tech Stack

*   **Framework**: Vue 3.5
*   **Build Tool**: Vite 7
*   **Styling**: Tailwind CSS 4
*   **State Management**: Pinia
*   **Routing**: Vue Router 4
*   **Maps**: Leaflet & Vue-Leaflet
*   **HTTP Client**: Axios

## Getting Started

### Prerequisites
*   Node.js
*   npm

### Configuration
The application requires a `.env` file in the root directory to connect to the backend services.

Create a `.env` file:
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_PAYPAL_CLIENT_ID=your_sandbox_client_id
```

### Installation
Install the project dependencies:
```bash
npm install
```

### Running the Application
Start the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
