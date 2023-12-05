import React from "react";
import { Container, Navbar, Nav } from "react-bootstrap";
import logo from "../assets/logo.svg";
import styles from "../styles/NavBar.module.css";
import { NavLink } from "react-router-dom";

const NavBar = () => {
    return (
        <Navbar expand="md" fixed="top" className={styles.NavBar}>
            <Container>
                <NavLink to="/">
                    <Navbar.Brand>
                        <img src={logo} alt="logo" height="45" />
                    </Navbar.Brand>
                </NavLink>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto text-left">
                        <NavLink
                            to="/"
                            exact
                            className={styles.NavLink}
                            activeClassName={styles.Active}
                        >
                            <i className="fa-solid fa-house"></i>Home
                        </NavLink>
                        <NavLink
                            to="/signin"
                            className={styles.NavLink}
                            activeClassName={styles.Active}
                        >
                            <i className="fas fa-sign-in-alt"></i>Sign in
                        </NavLink>
                        <NavLink
                            to="/signup"
                            className={styles.NavLink}
                            activeClassName={styles.Active}
                        >
                            <i className="fas fa-user-plus"></i>Sign up
                        </NavLink>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavBar;
