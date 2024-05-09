import { useEffect, useState } from "react"
import { useCartContext } from "../context/CartContext"
import { useUserContext } from "../context/UserContext"
import { loadStripe } from '@stripe/stripe-js'

const CartPage = () => {

    const { cart, setCart } = useCartContext()
    const { user, token } = useUserContext()
    const [ productOfCart, setProductOfCart ] = useState([])
    const [ cartCount, setCartCount ] = useState()
    const [ cartTotalPrice, setCartTotalPrice ] = useState()
    const [loading, setLoading] = useState(true)

    console.log(token)
    console.log(user)
    useEffect(() => {
        const calculateCartDetails = async () => {
            let updatedProductOfCart = [];

            if (!cart || !Array.isArray(cart)) {
                return;
            }

            const fetchProductDetails = async () => {
                const productPromises = cart.map(async (item) => {
                    const response = await fetch(`http://localhost:8080/api/products/${item.product}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                        credentials: 'include',
                    });

                    if (response.ok) {
                        const data = await response.json();
                        const product = data.payload;

                        return {
                            ...product,
                            quantity: item.quantity,
                        };
                    }

                    console.error(`Error fetching product with ID: ${item.product}`);
                    return null;
                });

                const products = await Promise.all(productPromises);
                updatedProductOfCart = products.filter(product => product !== null);
            };

            await fetchProductDetails();
            setProductOfCart(updatedProductOfCart);   
            setLoading(false);
        };

        calculateCartDetails();
    }, [cart, token])

    useEffect(() => {
        const totalPrice = productOfCart.reduce((acc, item) => {
            const { quantity } = item;
            const product = item[0];
            return acc + (product.price * quantity);
        }, 0);
        setCartTotalPrice(totalPrice);
    }, [productOfCart]);
    
    console.log(cartTotalPrice)
    
    useEffect(() => {

        if (!cart || !Array.isArray(cart)) {
            return;
        }

        const calculateTotalCount = () => {
            const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
            setCartCount(totalCount);
        };
    
        const timeoutId = setTimeout(calculateTotalCount, 6000)
    
        return () => {
            clearTimeout(timeoutId);
        };
    }, [cart]);
    console.log("cart array: ", cart)
    console.log("productos array: ", productOfCart)

    const handlePurchase = async () => {

        const stripePromise = await loadStripe('pk_test_51PCmSCILZElyPf104lCiiB9GhpmFaK8OQnWZQFadahm4oiRnKr0FASOkzbdCU5zM9aIbAswPz4n7Fs3eMXEQnc8i002S3jhJUM')

        if (!user.cart) {
            console.error('Cart ID is undefined')
            alert('Cart not available for purchase')
            return
        }

        try {

            const requestBody = {
                user: user,
                products: productOfCart,
            };
    
            const response = await fetch(`http://localhost:8080/api/payments/create-checkout-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(requestBody)
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                console.error(`Error durign creation of paymetn method: ${data.message}`);
                alert(`Error durign creation of paymetn method: ${data.message}`);
                return;
            }
    
            // Redirige al usuario a la página de pago de Stripe
            //const stripe = await stripePromise;
            const result = await stripePromise.redirectToCheckout({
                sessionId: data.sessionId,
            });
    
            if (result.error) {
                console.error('Error durante la redirección al checkout:', result.error.message);
                alert('An error occurred while trying to proceed with payment');
            } 
        } catch (error) {
            console.error('Error during purchase:', error)
            alert('An error occurred while trying to purchase the cart')
        }
    } 

    const handleRemoveProduct = async (productId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/carts/${user.cart}/product/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const updatedCart = cart.map(item => {
                    if (item.product === productId) {
                        if (item.quantity > 1) {
                            return { ...item, quantity: item.quantity - 1 };
                        } else {
                            return null;
                        }
                    } else {
                        return item;
                    }
                }).filter(item => item !== null);
                setCart(updatedCart);
    
                const updatedProductOfCart = productOfCart.map(item => {
                    if (item._id === productId) {
                        if (item.quantity > 1) {
                            return { ...item, quantity: item.quantity - 1 };
                        } else {
                            return null;
                        }
                    } else {
                        return item;
                    }
                }).filter(item => item !== null);
                setProductOfCart(updatedProductOfCart);
            } else {
                console.error('Error al eliminar el producto del carrito:', response.statusText);
            }
        } catch (error) {
            console.error('Error al eliminar el producto del carrito:', error);
        }
    }

  return (
        <div className="container mx-auto p-4">
            <header className="mb-6">
                <h3 className="text-center text-2xl font-bold">Carro de Compras</h3>
            </header>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {productOfCart.map((cartItem, index) => {
                    const { quantity } = cartItem;
                    const product = cartItem[0];

                    return (
                        <div key={product._id} className="border p-4 rounded-md">
                            <img
                                src={product.thumbnail}
                                alt={product.title}
                                className="w-full h-50 object-cover rounded-md mb-2"
                            />
                            <p className="text-lg font-semibold">{product.title}</p>
                            <p>Cantidad: {quantity}</p>
                            <p>Precio: ${product.price.toFixed(2)}</p>
                            <button
                                onClick={() => handleRemoveProduct(product._id)}
                                className="bg-red-500 text-white px-4 py-2 rounded-md mt-2"
                            >
                                Eliminar del Carro
                            </button>
                        </div>
                    );
                })}
            </div>

            <div className="mt-4">
                <p className="text-lg font-semibold">Total del carrito: ${cartTotalPrice}</p>
                <button onClick={handlePurchase} className="btn btn-secondary">
                    COMPRAR
                </button>
            </div>
        </div>

  )
}



export default CartPage