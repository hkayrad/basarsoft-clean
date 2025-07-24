import { createBrowserRouter } from "react-router";
import App from "../App";
import MapPage from "../features/map/MapPage";
import ListPage from "../features/list/ListPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [{ path: "map", element: <MapPage /> },
            { path: "list", element: <ListPage /> }
        ],
    },
]);
