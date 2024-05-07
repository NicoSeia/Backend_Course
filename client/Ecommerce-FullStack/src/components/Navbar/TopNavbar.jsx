import { Link, useNavigate } from 'react-router-dom';
import { useUserContext } from '../../context/UserContext';

const TopNavbar = () => {
    const { token, setToken, setUser, user } = useUserContext();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/session/logout', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                
            });
            
            if (response.ok) {
                setToken('');
                setUser({});
                navigate('/login');
            } else {
                console.error('Error during logout in backend section:', response);
            }
        } catch (error) {
            console.error('Error during logout request:', error);
        }
    };

    const isAuthenticated = Boolean(token && token.trim() !== '');

    return (
        <nav className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div className="flex items-center">
                    <Link to="/" className="text-2xl font-semibold text-black">Ecommerce</Link>
                    <div className="ml-6 space-x-4">
                        <Link to="/" className="text-black hover:text-gray-600">Home</Link>
                        <Link to="/chat" className="text-black hover:text-gray-600">Chat</Link>
                        <Link to="/products" className="text-black hover:text-gray-600">Product View</Link>
                        <Link to="/realtimeproducts" className="text-black hover:text-gray-600">Real Time Products</Link>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <Link to="/cart" className="relative">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-black hover:text-gray-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3 3h18l-1.5 9H4.5L3 3zM8.5 13a1 1 0 100 2h7a1 1 0 100-2h-7zM8 19a2 2 0 11-4 0 2 2 0 014 0zM21 19a2 2 0 11-4 0 a2 2 0 014 0z"
                            />
                        </svg>
                    </Link>

                    {isAuthenticated ? (
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                        >
                            Logout
                        </button>
                    ) : (
                        <Link to="/login">
                            <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                                Login
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default TopNavbar;
