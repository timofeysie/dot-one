import React from "react";
import Card from "react-bootstrap/Card";
import AboutCard from "../../components/AboutCard";

const AboutPage = () => (
  <div style={{ width: "100%", paddingTop: "81px"}}>
    <Card className="mt-4" style={{ width: "100%" }}>
      <Card.Body>
        <h1>About Us</h1>
        <p>Welcome to our platform!</p>
      </Card.Body>
    </Card>

    <Card className="mt-4" style={{ width: "100%" }}>
      <Card.Body>
        <h2>Our Mission</h2>
        <p>Our mission is to create a community.</p>
      </Card.Body>
    </Card>

    <AboutCard />
  </div>
);

export default AboutPage;
