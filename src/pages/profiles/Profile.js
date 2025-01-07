/* eslint-disable react/prop-types */
import React, { useState } from "react";
import styles from "../../styles/Profile.module.css";
import btnStyles from "../../styles/Button.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Link } from "react-router-dom";
import Avatar from "../../components/Avatar";
import Button from "react-bootstrap/Button";
import { useSetProfileData } from "../../contexts/ProfileDataContext";

const Profile = (props) => {
  const { profile, mobile, imageSize } = props;
  const { id, following_id, image, owner } = profile;
  // eslint-disable-next-line no-unused-vars
  const [defaultImage, setDefaultImage] = useState(
    image.includes("default_profile")
  );

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;

  const { handleFollow, handleUnfollow } = useSetProfileData();

  return (
    <div
      className={`my-3 d-flex align-items-center ${
        mobile && "flex-column my-1"
      }`}
    >
      <div>
        <Link className="align-self-center" to={`/profiles/${id}`}>
          {defaultImage ? (
            <i className={`far fa-user ${styles.defaultIcon}`}></i>
          ) : (
            <Avatar src={image} height={imageSize} />
          )}
        </Link>
      </div>
      <div className={`mx-2 ${styles.WordBreak}`}>
        <strong>{owner}</strong>
      </div>
      <div className={`ms-auto ${mobile ? "mt-2" : ""}`}>
        {!mobile &&
          currentUser &&
          !is_owner &&
          (following_id ? (
            <Button
              className={`${btnStyles.Button} ${btnStyles.BlackOutline}`}
              onClick={() => handleUnfollow(profile)}
            >
              unfollow
            </Button>
          ) : (
            <Button
              className={`${btnStyles.Button} ${btnStyles.Black}`}
              onClick={() => handleFollow(profile)}
            >
              follow
            </Button>
          ))}
      </div>
    </div>
  );
};

export default Profile;
