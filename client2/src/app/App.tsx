import { Outlet } from "react-router";
import Header from "./shared/Header";

export default function App() {
    return (
        <>
            <Header />
            <Outlet />
        </>
    );
}
