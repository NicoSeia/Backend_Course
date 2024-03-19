import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'

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
          <Card.Link href="#">Add To Cart</Card.Link>
        </Card.Body>
      </Card>
  )
}

export default ProductsList