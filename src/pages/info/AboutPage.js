import React from "react";
import Card from "react-bootstrap/Card";
import MyComponentWrapper from "../../components/WebComponents/MyComponentWrapper";

const AboutPage = () => {
  const handleIncrement = () => {
    console.log('Increment occurred in the Web Component');
    // Add any additional logic you want to execute when increment happens
  };

  return (
    <Card>
      <Card.Body>
        <h1>About Page</h1>
        <h1>My React App with Web Component</h1>
        <MyComponentWrapper onIncrement={handleIncrement} />
      </Card.Body>
    </Card>
  );
};

export default AboutPage;
