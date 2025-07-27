import { NavLink } from 'react-router';
import './style/home.css'

export default function HomePage() {

    return (
        <div className="container">
            <header>
                <h1>Welcome to Your GIS Platform</h1>
                <p>
                    A modern, clean, and efficient platform for visualizing and interacting with geographic data.
                </p>
            </header>
            <main>
                <NavLink to="/map" className="mapButton">
                    Go to Map
                </NavLink>
            </main>
        </div>
    );
}