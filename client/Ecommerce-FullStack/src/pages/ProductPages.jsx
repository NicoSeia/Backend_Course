import { useEffect, useState } from "react"
import ProductsListContainer from "../components/ProductsList/ProductsListContainer"

const ProductPages = () => {
    const [products, setProducts] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [hasNextPage, setHasNextPage] = useState(false)
    const [hasPrevPage, setHasPrevPage] = useState(false)

    useEffect(() => {
        const getProducts = async () =>{
            const dataJson = await fetch('http://localhost:4000/api/products')
            const data = await dataJson.json()
            setProducts(data.payload.docs)
            setHasNextPage(data.payload.hasNextPage)
            setHasPrevPage(data.payload.hasPrevPage)
            console.log(data)
        }
        getProducts()
    }, [])
    
    const nextPage = () => {
        setCurrentPage(currentPage + 1)
    }

    const prevPage = () => {
        setCurrentPage(currentPage - 1)
    }

    return (
        <div>
            <ProductsListContainer products={products} />
            <button onClick={prevPage} disabled={!hasPrevPage}>Previous Page</button>
            <button onClick={nextPage} disabled={!hasNextPage}>Next Page</button>
        </div>
    )
}

export default ProductPages