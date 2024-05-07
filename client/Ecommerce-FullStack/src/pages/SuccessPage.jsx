import { useEffect, useState } from "react"
import { useCartContext } from "../context/CartContext"
import { useUserContext } from "../context/UserContext"
import { useNavigate } from 'react-router-dom'

const SuccessPage = () => {

    const { cart, setCart } = useCartContext()
    const { user, token } = useUserContext()

    const navigate = useNavigate(); // Utilizar el hook useNavigate

    const [purchaseSuccess, setPurchaseSuccess] = useState(false);

    const finalizePurchase = async () => {
        try {
            const requestBodyPurchase = {
                user: user,
            };

            const responsePurchase = await fetch(`http://localhost:4000/api/carts/${user.cart}/purchase`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(requestBodyPurchase),
            });

            const dataPurchase = await responsePurchase.json();
            
            if (responsePurchase.ok) {
                alert('Purchase successful')
                setPurchaseSuccess(true)
                navigate('/')
            } else {
                alert(`Error during purchase: ${dataPurchase.message}`);
            }
        } catch (error) {
            console.error('Error during purchase:', error);
            alert('An error occurred while trying to complete the purchase');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <header className="mb-6">
                <h3 className="text-center text-2xl font-bold">Purchase Successful</h3>
            </header>
            <p className="text-center text-lg">Your purchase has been successfully processed!</p>
            <div className="text-center mt-4">
                <button onClick={finalizePurchase} className="btn btn-primary">
                    Finalize Purchase
                </button>
            </div>
        </div>
    );
}

export default SuccessPage