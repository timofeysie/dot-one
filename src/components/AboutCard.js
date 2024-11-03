import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";

const AboutCard = () => {
  return (
    <Card style={{ width: "18rem" }}>
      <div className="d-flex justify-content-center mt-3">
        <i className="fa-solid fa-user fa-3x"></i>
      </div>
      <Card.Body>
        <Card.Title>Card Title</Card.Title>
        <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card content.
        </Card.Text>
        <Link to="/">
          <Button variant="primary">Go Home</Button>
        </Link>
      </Card.Body>
    </Card>
  );
};

export default AboutCard;
