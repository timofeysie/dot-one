import React from "react";
import Card from "react-bootstrap/Card";
import AboutCard from "../../components/AboutCard";
import { Row, Col } from "react-bootstrap";

const AboutPage = () => (
  <div style={{ paddingTop: "81px", margin: "16px" }}>
    <Card className="mt-1 mb-4" style={{ width: "100%" }}>
      <Card.Body>
        <h2>Our Mission</h2>
        <p>
          The Ruffmello Content Management System is a set of tools to aid in
          creating the social context around a given subject.
        </p>
        <p>
          A social context is a multi-faceted concept mixed with events not
          necessarily in the same place. Creating content that has a cultural
          setting is a difficult thing. We see to create a tool to help in understanding a group of{" "}
          <a href="https://www.searchenginejournal.com/what-are-googles-core-topicality-systems/523537/">
            topics
          </a>{" "}
          and how they fit into a social context.
          Drawing from current real-time trending searches and 
          a number of news and content sources the CMS allows users to choose
          a group of subjects, discover imagery and create the links, the hashtags,
          meta descriptions, etc. required for performant SEO and required by various social
          network and other publishing options. It help visibility in apps,
          social media and other channels.
        </p>
        <p>
          This is an ongoing research project that is under development. 
          The technology behind SEO and search is rapidly evolving, and so may our solutions.
          If you have any feedback or suggestions, please reach out and let us know.
        </p>
      </Card.Body>
    </Card>

    <Card className="mt-4 mb-4" style={{ width: "100%" }}>
      <Card.Body>
        <h1>About Us</h1>
        <p>The Ruffmello CMS currently consists of three developers.
          We&apos;re looking for a few more members who share out passion for creating something that can bring users true value.
          If you&apos;re interested in joining the team, please reach out to us.
        </p>
      </Card.Body>
    </Card>

    <Row className="mt-4 pb-4">
      <Col md={4}>
        <AboutCard
          title="Timothy Curchod"
          text="Lead software engineer."
          icon="fa-code"
          buttonText="View Portfolio"
          buttonLink="/portfolio"
          linkUrl="https://www.linkedin.com/in/timothy-curchod-00847511/"
          linkText="LinkedIn profile"
          imageUrl="https://avatars.githubusercontent.com/u/2747740?v=4"
        />
      </Col>
      <Col md={4}>
        <AboutCard
          title="Gia Han Pham"
          text="Frontend web developer."
          icon="fa-code"
          buttonText="View Portfolio"
          buttonLink="/portfolio"
          linkUrl="https://www.linkedin.com/in/gia-hanpham/"
          linkText="LinkedIn profile"
          imageUrl="https://media.licdn.com/dms/image/v2/D5635AQG-5qbaFnmlfA/profile-framedphoto-shrink_200_200/profile-framedphoto-shrink_200_200/0/1656940343071?e=1735740000&v=beta&t=dXqDgtNvtLrfqj_QocfcKGDwZngZ8SMssqTlXfl0LOo"
        />
      </Col>
      <Col md={4}>
        <AboutCard
          title="Mike Edmunds"
          text="Business development."
          icon="fa-code"
          buttonText="View Portfolio"
          buttonLink="/portfolio"
          linkUrl="https://www.facebook.com/starswept"
          linkText="Facebook profile"
          imageUrl="https://scontent-ssn1-1.xx.fbcdn.net/v/t39.30808-6/302489928_10160626070255625_3982759796365918055_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=BtHi6nOrZJAQ7kNvgGwy_W_&_nc_zt=23&_nc_ht=scontent-ssn1-1.xx&_nc_gid=ATNlQm4HwR5gofynQP8elI0&oh=00_AYCxmC2nZF9X97EZJ7s0qMPzhQ7IpzgWXNxDf3_ucKhfiw&oe=6771F094"
        />
      </Col>
    </Row>
  </div>
);

export default AboutPage;
