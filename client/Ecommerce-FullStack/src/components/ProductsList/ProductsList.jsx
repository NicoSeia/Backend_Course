import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import { Link } from 'react-router-dom'


const ProductsList = ({product}) => {
  return (
      <Card style={{ width: '18rem' }} className='bg-[#8ed37f]'>
        <Card.Img variant="top" src={product.thumbnail} className='object-cover h-[240px] w-full' />
        <Card.Body>
          <Card.Title>{product.title}</Card.Title>
          <Card.Text>
            {product.category}
          </Card.Text>
        </Card.Body>
        <ListGroup className="list-group-flush">
          <ListGroup.Item className='bg-[#8ed37f] text-bold'>${product.price}</ListGroup.Item>
        </ListGroup>
        <Card.Body>
          <Link to={`/products/detail/${product._id}`} className="btn btn-outline-dark w-100">Details</Link>
        </Card.Body>
      </Card>
  )
}

export default ProductsList