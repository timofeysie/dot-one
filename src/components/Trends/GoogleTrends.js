/* eslint-disable react/prop-types */
import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import styles from "../../styles/GoogleTrends.module.css";
import { axiosNest } from "../../api/axiosDefaults";
import btnStyles from "../../styles/Button.module.css";

function GoogleTrends({ onTrendSelect }) {
  const [trends, setTrends] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [params, setParams] = useState({
    geo: "US",
    hours: "24",
    category: "all",
    type: "all",
    sort: "relevance",
  });
  const [selectedTrends, setSelectedTrends] = useState([]);
  const [postTitle, setPostTitle] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const fetchTrends = async () => {
    setIsLoading(true);
    setError(null);
    console.log("Fetching trends...");

    try {
      const response = await axiosNest.get("/parse-realtime-data", {
        params: {
          geo: params.geo,
          hours: params.hours,
          category: params.category,
          type: params.type,
          sort: params.sort,
        },
        timeout: 60000,
      });

      console.log("API Response:", response);

      if (response.data) {
        console.log("Response data:", response.data);
        setTrends(response.data.data || response.data);
      } else {
        setError("No data received from the API");
      }
    } catch (err) {
      console.error("Error fetching trends:", err);

      if (err.code === "ECONNABORTED") {
        setError("Request timed out after 60 seconds. Please try again.");
      } else if (err.response) {
        console.log("Error status:", err.response.status);
        console.log("Error headers:", err.response.headers);
        console.log("Error data:", err.response.data);
      } else if (err.request) {
        console.log("Request made but no response:", err.request);
      } else {
        console.log("Error setting up request:", err.message);
      }

      setError(`Failed to fetch trends: ${err.message || "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleParamChange = (event) => {
    const { name, value } = event.target;
    setParams((prevParams) => ({
      ...prevParams,
      [name]: value,
    }));
  };

  const handleTrendSelection = (trendIndex) => {
    setSelectedTrends((prev) => {
      const newSelectedTrends = prev.includes(trendIndex)
        ? prev.filter((index) => index !== trendIndex)
        : [...prev, trendIndex];

      const selectedTrendTitles = newSelectedTrends.map(
        (index) => trends[index].title
      );
      onTrendSelect(selectedTrendTitles);

      return newSelectedTrends;
    });
  };

  return (
    <Container>
      <Accordion className="mb-3 mt-2">
        <Card>
          <Accordion.Toggle
            as={Card.Header}
            eventKey="0"
            onClick={() => setShowFilters(!showFilters)}
            className="d-flex justify-content-between align-items-center"
          >
            <span>Search Filters</span>
            <i
              className={
                showFilters ? "fa-solid fa-minus" : "far fa-plus-square"
              }
            ></i>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="0">
            <Card.Body>
              <Row className="align-items-end">
                <Col sm={12} md={2}>
                  <Form.Group>
                    <Form.Label>Region</Form.Label>
                    <Form.Control
                      as="select"
                      name="geo"
                      value={params.geo}
                      onChange={handleParamChange}
                    >
                      <option value="US">United States</option>
                      <option value="AU">Australia</option>
                      <option value="KR">Korea</option>
                    </Form.Control>
                  </Form.Group>
                </Col>

                <Col sm={12} md={2}>
                  <Form.Group>
                    <Form.Label>Time Range</Form.Label>
                    <Form.Control
                      as="select"
                      name="hours"
                      value={params.hours}
                      onChange={handleParamChange}
                    >
                      <option value="4">Last 4 hours</option>
                      <option value="24">Last 24 hours</option>
                      <option value="48">Last 48 hours</option>
                      <option value="168">Last week</option>
                    </Form.Control>
                  </Form.Group>
                </Col>

                <Col sm={12} md={2}>
                  <Form.Group>
                    <Form.Label>Category</Form.Label>
                    <Form.Control
                      as="select"
                      name="category"
                      value={params.category}
                      onChange={handleParamChange}
                    >
                      <option value="all">All categories</option>
                      <option value="news">News</option>
                      <option value="entertainment">Entertainment</option>
                      <option value="sports">Sports</option>
                      <option value="business">Business</option>
                    </Form.Control>
                  </Form.Group>
                </Col>

                <Col sm={12} md={2}>
                  <Form.Group>
                    <Form.Label>Type</Form.Label>
                    <Form.Control
                      as="select"
                      name="type"
                      value={params.type}
                      onChange={handleParamChange}
                    >
                      <option value="all">All trends</option>
                      <option value="rising">Rising</option>
                      <option value="top">Top</option>
                    </Form.Control>
                  </Form.Group>
                </Col>

                <Col sm={12} md={2}>
                  <Form.Group>
                    <Form.Label>Sort By</Form.Label>
                    <Form.Control
                      as="select"
                      name="sort"
                      value={params.sort}
                      onChange={handleParamChange}
                    >
                      <option value="relevance">Relevance</option>
                      <option value="search-volume">Search Volume</option>
                      <option value="title">Title</option>
                      <option value="recency">Recency</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
      <div className="d-flex justify-content-center">
        <Button
          onClick={fetchTrends}
          variant="primary"
          className={`${btnStyles.Button} ${btnStyles.Blue}`}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
              Loading...
            </>
          ) : (
            "Fetch trends"
          )}
        </Button>
        {error && (
          <Alert variant="danger" className="mt-3">
            {error}
          </Alert>
        )}
      </div>

      <Form.Group className="mb-3">
        <Form.Label>Post Title</Form.Label>
        <Form.Control
          type="text"
          value={postTitle}
          onChange={(e) => setPostTitle(e.target.value)}
          placeholder="Selected trends will appear here"
        />
      </Form.Group>

      {!isLoading &&
        trends &&
        trends.length > 0 &&
        trends.map((trend, index) => (
          <div key={index} className="mb-2 pt-1 ps-3 border rounded">
            <Row>
              <Col xs={1} className="d-flex align-items-center">
                <Form.Check
                  type="checkbox"
                  checked={selectedTrends.includes(index)}
                  onChange={() => handleTrendSelection(index)}
                  aria-label={`Select trend: ${trend.title}`}
                />
              </Col>
              <Col xs={11}>
                <Accordion>
                  <Accordion.Toggle
                    as={Card.Header}
                    eventKey={index.toString()}
                  >
                    <div className={styles.trendHeader}>
                      <h5 className={styles.trendTitle}>{trend.title}</h5>
                      <div className={styles.trendMetadata}>
                        <span className={styles.searchVolume}>
                          {trend.searchVolume}
                        </span>
                        <span className={styles.timeInfo}>
                          {trend.timeAgo}
                          {trend.trendStatus && (
                            <span className={styles.trendStatus}>
                              {trend.trendStatus}
                            </span>
                          )}
                        </span>
                        {trend.trendPercentage && (
                          <span className={styles.trendPercentage}>
                            +{trend.trendPercentage}
                          </span>
                        )}
                      </div>
                    </div>
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey={index.toString()}>
                    <Row>
                      <Col md={8}>
                        {trend.breakdownTerms &&
                          trend.breakdownTerms.length > 0 && (
                            <div className={styles.breakdownTerms}>
                              {trend.breakdownTerms.map((term, idx) => (
                                <span
                                  key={idx}
                                  className={styles.breakdownTerm}
                                >
                                  {term}
                                </span>
                              ))}
                            </div>
                          )}
                        <div className={styles.newsContainer}>
                          {trend.details?.news?.map((newsItem, idx) => (
                            <div key={idx} className={styles.newsItem}>
                              <img
                                src={newsItem.imageUrl}
                                alt={newsItem.title}
                                className={styles.newsImage}
                              />
                              <div className={styles.newsContent}>
                                <a
                                  href={newsItem.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {newsItem.title}
                                </a>
                                <div className={styles.newsMetadata}>
                                  <span>{newsItem.source}</span>
                                  <span>{newsItem.time}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className={styles.sparklineContainer}>
                          <svg viewBox="0 0 100 30">
                            <path
                              d={`M ${trend.sparkline}`}
                              fill="none"
                              stroke="#2196f3"
                              strokeWidth="2"
                            />
                          </svg>
                        </div>
                      </Col>
                    </Row>
                  </Accordion.Collapse>
                </Accordion>
              </Col>
            </Row>
          </div>
        ))}
    </Container>
  );
}

export default GoogleTrends;
