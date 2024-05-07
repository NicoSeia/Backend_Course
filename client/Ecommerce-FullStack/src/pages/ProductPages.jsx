import { useEffect, useState } from "react"
import ProductsListContainer from "../components/ProductsList/ProductsListContainer"
import { Link } from "react-router-dom"

const ProductPages = () => {
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

    return (
        <div>
            <ProductsListContainer products={products} />
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

export default ProductPages