import React from "react";
import styles from "../styles/Avatar.module.css";

// eslint-disable-next-line react/prop-types
const Avatar = ({ src, height = 45, text }) => {
  const defaultSrc = "/default-profile.png"; // or any default image path

  return (
    <span>
      <img
        className={styles.Avatar}
        src={src || defaultSrc}
        height={height}
        width={height}
        alt="avatar"
      />
      {text}
    </span>
  );
};

export default Avatar;
