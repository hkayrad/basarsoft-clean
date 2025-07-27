import { createBrowserRouter } from "react-router";
import MapPage from "../map/MapPage";
import App from "../../App";
import ListPage from "../list/ListPage";
import Home from "../home/Home";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "map",
                element: <MapPage />,
            },
            {
                path: "list",
                element: <ListPage />,
            },
        ],
    },
]);
