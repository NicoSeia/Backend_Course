import { useEffect, useState } from "react"
import { useCartContext } from "../context/CartContext"
import { useUserContext } from "../context/UserContext"

const CartPage = () => {

    const { cart } = useCartContext()
    const { user, token } = useUserContext()
    const [ productOfCart, setProductOfCart ] = useState([])
    const [ cartCount, setCartCount ] = useState()
    const [ cartTotalPrice, setCartTotalPrice ] = useState()
    const [loading, setLoading] = useState(true)

    console.log(token)
    console.log(user)
    useEffect(() => {
        const calculateTotalCount = () => {
            const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
            setCartCount(totalCount);
        };
    
        const timeoutId = setTimeout(calculateTotalCount, 6000)
    
        return () => {
            clearTimeout(timeoutId);
        };
    }, [cart]);

    useEffect(() => {
        const totalPrice = productOfCart.reduce((acc, item) => {
            const { quantity } = item;
            const product = item[0];
            return acc + (product.price * quantity);
        }, 0);
        setCartTotalPrice(totalPrice);
    }, [productOfCart]);
    
    console.log(cartCount)
    console.log(cartTotalPrice)

    const fetchProductDetails = async (cart) => {
        const productPromises = cart.map(async (item) => {
            try {
                const response = await fetch(`http://localhost:4000/api/products/${item.product}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    credentials: "include",
                });
                if (response.ok) {
                    const data = await response.json();
                    return {
                        ...data.payload,
                        quantity: item.quantity,
                    };
                } else {
                    console.error(`Error al obtener detalles del producto con ID: ${item.product}`);
                    return null;
                }
            } catch (error) {
                console.error(`Error al obtener detalles del producto con ID: ${item.product}`, error);
                return null;
            }
        });

        const products = await Promise.all(productPromises);
        setProductOfCart(products.filter(product => product !== null));
    };

    useEffect(() => {
        if (cart !== undefined) {
            setLoading(false);
            if (cart.length > 0) {
                fetchProductDetails(cart);
            }
        }
    }, [cart])

    console.log("productos array: ", productOfCart)

    const handlePurchase = async () => {

        if (!user.cart) {
            console.error('Cart ID is undefined')
            alert('Cart not available for purchase')
            return
        }

        try {

            const requestBody = {
                user: user
            }

            const response = await fetch(`http://localhost:4000/api/carts/${user.cart}/purchase`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(requestBody)
            })
            console.log(response)
            const data = await response.json()
            console.log(data)

            if (response.ok) {
                alert('Purchase successful')
            } else {
                alert(`Error during purchase: ${data.message}`)
            }
        } catch (error) {
            console.error('Error during purchase:', error)
            alert('An error occurred while trying to purchase the cart')
        }
    } 

  return (
        <div className="container mx-auto p-4">
            <header className="mb-6">
                <h3 className="text-center text-2xl font-bold">Shopping Cart</h3>
            </header>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {productOfCart.map((cartItem, index) => {
                    const { quantity } = cartItem;
                    const product = cartItem[0]

                    return (
                        <div key={product._id} className="border p-4 rounded-md">
                            <img
                                src={product.thumbnail}
                                alt={product.title}
                                className="w-full h-40 object-cover rounded-md mb-2"
                            />
                            <p className="text-lg font-semibold">{product.title}</p>
                            <p>Cantidad: {quantity}</p>
                            <p>Precio: ${product.price.toFixed(2)}</p>
                        </div>
                    );
                })}
            </div>

            <div className="mt-4">
                <p className="text-lg font-semibold">Total del carrito: ${cartTotalPrice}</p>
                <button onClick={handlePurchase} className="btn btn-secondary">
                    Comprar carrito
                </button>
            </div>
        </div>

  )
}

export default CartPage