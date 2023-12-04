import React from "react";
import { Container, Navbar, Nav } from "react-bootstrap";
import logo from "../assets/logo.svg";
import  styles from '../styles/NavBar.module.css'

const NavBar = () => {
    return (
        <Navbar expand="md" fixed="top" className={styles.NavBar}>
            <Container>
                <Navbar.Brand>
                    <img src={logo} alt="logo" height="45" />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto text-left">
                        <Nav.Link><i className="fa-solid fa-house"></i>Home</Nav.Link>
                        <Nav.Link><i className="fas fa-sign-in-alt"></i>Sign in</Nav.Link>
                        <Nav.Link><i className="fas fa-user-plus"></i>Sign up</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavBar;
