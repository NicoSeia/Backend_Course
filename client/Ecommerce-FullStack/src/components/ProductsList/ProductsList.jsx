import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import { Link } from 'react-router-dom'


const ProductsList = ({product}) => {
  return (
      <Card style={{ width: '18rem' }}>
        <Card.Img variant="top" src={product.thumbnail} />
        <Card.Body>
          <Card.Title>{product.title}</Card.Title>
          <Card.Text>
            {product.description}
          </Card.Text>
        </Card.Body>
        <ListGroup className="list-group-flush">
          <ListGroup.Item>${product.price}</ListGroup.Item>
          <ListGroup.Item>Available: {product.stock}</ListGroup.Item>
        </ListGroup>
        <Card.Body>
          <Link to={`/products/detail/${product._id}`} className="btn btn-outline-dark w-100">Details</Link>
        </Card.Body>
      </Card>
  )
}

export default ProductsList