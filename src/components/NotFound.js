import React from 'react';
import Asset from "./Asset";
import NoRes from "../assets/no-results.png";

const NotFound = () => {

  return (
    <div className="text-center lead">
      <Asset
        src={NoRes}
        message="The page you're looking for doesn't exist!"
      />
    </div>
  );
};

export default NotFound;
