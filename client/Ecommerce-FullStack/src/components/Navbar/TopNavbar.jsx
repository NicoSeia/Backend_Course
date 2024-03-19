import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Button from 'react-bootstrap/Button'

const TopNavbar = () => {
  return (

      <Navbar bg="light" data-bs-theme="light">
        <Container>
          <Navbar.Brand href="#home">Ecommerce</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#about">About</Nav.Link>
            <Nav.Link href="#chat">Chat</Nav.Link>
            <Nav.Link href="#productview">Product View</Nav.Link>
            <Nav.Link href="#realtimeproduct">Real Time Product</Nav.Link>
          </Nav>
          <div className="d-flex justify-content-end">
            <Button variant="outline-success">Login</Button>
          </div>
        </Container>
      </Navbar>

  )
}

export default TopNavbar