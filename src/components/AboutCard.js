/* eslint-disable react/prop-types */
import React from "react";
import Card from "react-bootstrap/Card";

const AboutCard = ({ 
  title, 
  text, 
  icon, 
  imageUrl, 
  linkText, 
  linkUrl 
}) => {
  return (
    <Card style={{ width: "18rem" }}>
      <div className="d-flex justify-content-center p-4">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title || 'Card image'} 
            style={{ 
              width: '150px', 
              height: '150px', 
              objectFit: 'cover',
              borderRadius: '50%',
              border: '2px solid #dee2e6'
            }} 
          />
        ) : (
          <i className={`fa-solid ${icon || 'fa-user'} fa-5x`}></i>
        )}
      </div>
      <Card.Body>
        <Card.Title>{title || 'Card Title'}</Card.Title>
        <Card.Text>
          {text || 'Some quick example text to build on the card title and make up the bulk of the card content.'}
        </Card.Text>
        {linkUrl && linkText && (
          <div className="mt-2">
            <a href={linkUrl}>{linkText}</a>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default AboutCard;
