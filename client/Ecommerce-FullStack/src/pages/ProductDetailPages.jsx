import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import ProductsListContainer from '../components/ProductsList/ProductsListContainer'
import ProductDetail from "../components/ProductDetail/ProductDetail"


const ProductDetailPages = () => {

    const [product, setProduct] = useState({})
    const { pid } = useParams()

    useEffect(() =>{
        const getProduct = async () => {
            const dataJson = await fetch(`http://localhost:8080/api/products/${pid}`)
            const data = await dataJson.json()
            console.log(data)
            setProduct(data.payload[0])
        }
        getProduct()
    }, [])

  return (
    <div>
      <ProductDetail product={product} />
    </div>
  )
}

export default ProductDetailPages