import React from "react";
import styles from "../styles/Avatar.module.css";
import PropTypes from "prop-types";

const Avatar = ({ src = "", height = 27, text }) => {
  //<i class="fa-solid fa-user"></i>

  const classes = `fa-solid fa-user ${styles.Avatar}`

  return (
    <span>
      {src === 'https://res.cloudinary.com/dr3am91m4/image/upload/v1/media/../default_profile_qdjgyp' ? (
        <i className={classes}></i>
      ) : (
        <img
          className={styles.Avatar}
          src={src}
          height={height}
          width="auto"
          alt="avatar"
        />
      )}
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
