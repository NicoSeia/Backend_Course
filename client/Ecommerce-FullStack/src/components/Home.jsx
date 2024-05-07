import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'


const Home = ({product}) => {
  return (
    <Card style={{ width: '18rem' }}>
        <Card.Img variant="top" src={product.thumbnail} />
        <Card.Body>
          <Card.Title>{product.title}</Card.Title>
        </Card.Body>
        <ListGroup className="list-group-flush">
          <ListGroup.Item>${product.price}</ListGroup.Item>
        </ListGroup>
    </Card>
  )
}

export default Home