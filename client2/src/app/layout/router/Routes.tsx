import { createBrowserRouter } from "react-router";
import MapPage from "../map/MapPage";
import App from "../../App";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "map",
                element: <MapPage />,
            },
        ],
    },
]);
