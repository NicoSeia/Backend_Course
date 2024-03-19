import ProductsList from "./ProductsList"

const ProductsListContainer = ({products}) => {
    return (
        <div style={{ margin: '0px', padding: '0px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', justifyItems: 'center', rowGap: '80px'}}>
            {products.map(product => <ProductsList key={product._id} product={product} />)}
        </div>
    )
}

export default ProductsListContainer