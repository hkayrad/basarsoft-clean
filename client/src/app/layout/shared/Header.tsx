import { NavLink } from "react-router";

export default function Header() {
    return (
        <header style={{
            backgroundColor: '#343434',
            color: '#ffffff',
            padding: '16px 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            borderBottom: '1px solid #4a4a4a',
        }}>
            <h1 style={{ 
                margin: 0,
                fontSize: '24px',
                fontWeight: '600',
                letterSpacing: '0.5px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}>
                🗺️ Feature Management
            </h1>
            <nav style={{
                display: 'flex',
                gap: '12px'
            }}>
                <NavLink 
                    to="/map" 
                    style={({ isActive }) => ({
                        color: '#ffffff',
                        textDecoration: 'none',
                        padding: '10px 18px',
                        borderRadius: '6px',
                        fontWeight: '500',
                        fontSize: '14px',
                        transition: 'all 0.2s ease',
                        backgroundColor: isActive ? '#5a5a5a' : 'transparent',
                        border: `1px solid ${isActive ? '#6a6a6a' : 'transparent'}`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    })}
                >
                    🗺️ Map
                </NavLink>
                <NavLink 
                    to="/list" 
                    style={({ isActive }) => ({
                        color: '#ffffff',
                        textDecoration: 'none',
                        padding: '10px 18px',
                        borderRadius: '6px',
                        fontWeight: '500',
                        fontSize: '14px',
                        transition: 'all 0.2s ease',
                        backgroundColor: isActive ? '#5a5a5a' : 'transparent',
                        border: `1px solid ${isActive ? '#6a6a6a' : 'transparent'}`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    })}
                >
                    📋 List
                </NavLink>
            </nav>
        </header>
    );
}