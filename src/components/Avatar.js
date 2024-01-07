import React from "react";
import styles from "../styles/Avatar.module.css";
import PropTypes from "prop-types";

const Avatar = ({ src, height = 45, text }) => {
  return (
    <span>
      <img
        className={styles.Avatar}
        src={src}
        height={height}
        width={height}
        alt="avatar"
      />
      {text}
    </span>
  );
};

Avatar.propTypes = {
  src: PropTypes.string.isRequired, // Assuming src should be a string and is required
  height: PropTypes.number, // Assuming height should be a number, but it's optional
  text: PropTypes.node, // Assuming text can be any node (string, number, element, etc.)
};

export default Avatar;
