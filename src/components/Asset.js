import React from "react";
import Spinner from "react-bootstrap/Spinner";
import styles from "../styles/Asset.module.css";
import PropTypes from "prop-types";

const Asset = ({ spinner, src, message }) => {
  return (
    <div className={`${styles.Asset} p-4`}>
      {spinner && <Spinner animation="border" />}
      {src && <img src={src} alt={message} />}
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

Asset.propTypes = {
  spinner: PropTypes.bool,
  src: PropTypes.string,
  message: PropTypes.string,
};

export default Asset;
