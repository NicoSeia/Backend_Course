/* import { useEffect } from "react"
import { useUserContext } from "../context/UserContext"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"

const LogoutPage = () => {
    const { setToken, setUser, token, user } = useUserContext();
    const navigate = useNavigate();

    useEffect(() => {
        // Realiza una solicitud a la ruta de cierre de sesión en el backend
        const logoutBackend = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/session/logout', {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(user)
                });
                if (response.ok) {
                    setToken('');
                    setUser({});
                    Swal.fire({ icon: "success", text: 'Logout Successfully' })
                        .then(() => {
                            navigate("/login", { replace: true });
                        });
                } else {
                    console.error('Error during logout on backend:', await response.json());
                }
            } catch (error) {
                console.error('Error during logout request:', error);
            }
        };

        logoutBackend();
    }, [setToken, setUser, navigate]);

    return null;
};

export default LogoutPage;
 */