
const ProductsList = ({product}) => {
  return (
    <div>
        <img src={product.thumbnail} alt="image" />
        <h3>Title: {product.title}</h3>
        <p>Description: {product.description}</p>
        <p>${product.price}</p>
        <p>Stock: {product.stock}</p>
    </div>
  )
}

export default ProductsList