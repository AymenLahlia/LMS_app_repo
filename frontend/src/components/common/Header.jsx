import React from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'

const Header = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
    const isLoggedIn = !!userInfo?.token;
    const role = userInfo?.role || 'student';

    return (
        <>
            <Navbar expand="md" className="bg-white shadow-lg header py-3">
                <Container>
                    <Navbar.Brand href="/"><strong>Smart Learning</strong></Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav className="me-auto my-2 my-lg-0" navbarScroll>
                            <Nav.Link href="/courses">All Courses</Nav.Link>
                        </Nav>
                        {isLoggedIn ? (
                            <a
                                href='/account/dashboard'
                                className="btn btn-primary"
                            >
                                {role === 'admin' ? 'Admin Panel' : 'My Account'}
                            </a>
                        ) : (
                            <a href='/account/login' className="btn btn-primary">Login</a>
                        )}
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    )
}

export default Header
