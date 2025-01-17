/* eslint-disable react/prop-types */
import React from "react";
import Container from "react-bootstrap/Container";
import appStyles from "../../App.module.css";
import Asset from "../../components/Asset";
import { useProfileData } from "../../contexts/ProfileDataContext";
import Profile from "./Profile";

const PopularProfiles = ({ mobile }) => {
  const { popularProfiles } = useProfileData();

  return (
    <Container
      className={`${appStyles.Content} ${
        mobile && "d-lg-none text-center mb-2"
      }`}
    >
      {popularProfiles.results.length ? (
        <>
          <span className="mb-0">Most followed profiles</span>
          {mobile ? (
            // TBD: how to display popular profiles on mobile?
            // This will probably be in a tool row with search and grid view options.
            // <div className="d-flex justify-content-around">
            //   {popularProfiles.results.slice(0, 4).map((profile) => (
            //     <Profile key={profile.id} profile={profile} mobile />
            //   ))}
            // </div>
            <></>
          ) : (
            popularProfiles.results.map((profile) => (
              <Profile key={profile.id} profile={profile} />
            ))
          )}
        </>
      ) : (
        <Asset spinner />
      )}
    </Container>
  );
};

export default PopularProfiles;
