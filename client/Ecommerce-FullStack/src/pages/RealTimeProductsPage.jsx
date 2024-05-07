import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'


const RealTimeProducts = () => {

    const { register, handleSubmit } = useForm()
    const [products, setProducts] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [hasNextPage, setHasNextPage] = useState(false)
    const [hasPrevPage, setHasPrevPage] = useState(false)

    const fetchProducts = async () => {
        try {
            const response = await fetch(`http://localhost:4000/api/products?pageNumber=${currentPage}`)
            const data = await response.json()

            setProducts(data.payload.docs)
            console.log(products)
            setHasNextPage(data.payload.hasNextPage)
            console.log(data.payload.hasNextPage)
            setHasPrevPage(data.payload.hasPrevPage)
        } catch (error) {
            console.error('Error fetching products:', error)
        }
    }
    
    useEffect(() => {
        fetchProducts(currentPage)
    }, [currentPage])
    
    const nextPage = () => {
        if (hasNextPage) {
            setCurrentPage((prev) => prev + 1)
        }
    }
    
    const prevPage = () => {
        if (hasPrevPage) {
            setCurrentPage((prev) => prev - 1)
        }
    }
    
    console.log(products)
    const onSubmit = handleSubmit(async (product) => {

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify(product),
            credentials: 'include'  
        }
        console.log(product)
        try{
            const response = await fetch('http://localhost:4000/api/products', requestOptions)
            if (!response.ok) {
                const data = await response.json()
                alert(`Error to adding product: ${data.message}`)
                return
            }

            const data = await response.json()
            console.log("Product added: ", data)
            
            fetchProducts()
        }catch(error) {
            console('Error adding product:', error)
            alert(`Error adding product: ${error.message}`)
        }
    })

    const removeProduct = (async (pid) => {

        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json', 
            },
            credentials: 'include'  
        }
        try{
            const response = await fetch(`http://localhost:4000/api/products/${pid}`, requestOptions)
            if (!response.ok) {
                const data = await response.json()
                alert(`Error deleting product: ${data.message}`)
                return
            }

            const data = await response.json()
            console.log("Product removed: ", data)
            alert(`Product removed: ${data.message}`)
            
            fetchProducts()
        }catch(error) {
            console('Error deleting product:', error)
            alert(`Error deleting product: ${error.message}`)
        }

    })

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Here, you can add or remove products</h2>
            <h3 className="text-xl mb-4">List of Products</h3>

            {/* Form to add a product */}
            <form onSubmit={onSubmit} className="mb-6 space-y-4">
                {/* Input for title */}
                <div className="flex flex-col">
                    <label htmlFor="title" className="font-semibold">Title</label>
                    <input
                        type="text"
                        {...register("title", {required: true})}
                        placeholder="Product title"
                        className="border border-gray-300 p-2 rounded-md"
                    />
                </div>

                {/* Input for description */}
                <div className="flex flex-col">
                    <label htmlFor="description" className="font-semibold">Description</label>
                    <input
                        type="text"
                        {...register("description", {required: true})}
                        placeholder="Product description"
                        className="border border-gray-300 p-2 rounded-md"
                    />
                </div>

                {/* Input for price */}
                <div className="flex flex-col">
                    <label htmlFor="price" className="font-semibold">Price</label>
                    <input
                        type="number"
                        {...register("price", {required: true})}
                        placeholder="Product price"
                        className="border border-gray-300 p-2 rounded-md"
                    />
                </div>

                {/* Input for thumbnail */}
                <div className="flex flex-col">
                    <label htmlFor="thumbnail" className="font-semibold">Thumbnail</label>
                    <input
                        type="text"
                        {...register("thumbnail", {required: true})}
                        placeholder="Product thumbnail"
                        className="border border-gray-300 p-2 rounded-md"
                    />
                </div>

                {/* Input for code */}
                <div className="flex flex-col">
                    <label htmlFor="code" className="font-semibold">Code</label>
                    <input
                        type="text"
                        {...register("code", {required: true})}
                        placeholder="Product code"
                        className="border border-gray-300 p-2 rounded-md"
                    />
                </div>

                {/* Input for stock */}
                <div className="flex flex-col">
                    <label htmlFor="stock" className="font-semibold">Stock</label>
                    <input
                        type="number"
                        {...register("stock", {required: true})}
                        placeholder="Product stock"
                        className="border border-gray-300 p-2 rounded-md"
                    />
                </div>

                {/* Input for status */}
                <div className="flex items-center">
                    <label htmlFor="status" className="mr-2 font-semibold">Status</label>
                    <input
                        type="checkbox"
                        {...register("status", {required: true})}
                        className="ml-2"
                    />
                </div>

                {/* Input for category */}
                <div className="flex flex-col">
                    <label htmlFor="category" className="font-semibold">Category</label>
                    <input
                        type="text"
                        {...register("category", {required: true})}
                        placeholder="Product category"
                        className="border border-gray-300 p-2 rounded-md"
                    />
                </div>

                {/* Submit button */}
                <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition">
                    Add Product
                </button>
            </form>

            {/* List of products */}
            <div className="item-products" id="products">
                <ul className="list-none space-y-4">
                {products.map(product => (
                        <li key={product._id} className="p-4 border border-gray-300 rounded-md shadow-md bg-gray-100">
                            <p><strong>Title:</strong> {product.title}</p>
                            <p><strong>Price:</strong> ${product.price}</p>
                            <p><strong>Stock:</strong> {product.stock}</p>
                            <button
                                onClick={() => removeProduct(product._id)}
                                className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition mt-2"
                            >
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="text-center" style={{ marginTop: '20px' }}>
                {hasPrevPage && (
                    <button onClick={prevPage} className="btn btn-dark" style={{ marginRight: '10px' }}>
                        Prev
                    </button>
                )}
                <span className="page-number" style={{ marginRight: '10px' }}>{currentPage}</span>
                {hasNextPage && (
                    <button onClick={nextPage} className="btn btn-dark">
                        Next
                    </button>
                )}
            </div>
        </div>
    )
}

export default RealTimeProducts
