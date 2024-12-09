import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import styles from "../../styles/GoogleTrends.module.css";
import { axiosNest } from "../../api/axiosDefaults";

function GoogleTrends() {
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
  const fetchTrends = async () => {
    setIsLoading(true);
    setError(null);
    console.log("Fetching trends...");
    try {
      const response = await axiosNest.get("/parse-realtime-data", {
        geo: params.geo,
        hours: params.hours,
        category: params.category,
        type: params.type,
        sort: params.sort,
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
      setError(`Failed to fetch trends: ${err.message || "Unknown error"}`);
      if (err.response) {
        console.log("Error response:", err.response);
        console.log("Error response data:", err.response.data);
      }
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

  return (
    <Container>
      <Row className="mb-3 align-items-end">
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

        <Col sm={12} md={2}>
          <Button
            onClick={fetchTrends}
            variant="primary"
            className="w-100"
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
              "Apply Filters"
            )}
          </Button>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      )}

      {isLoading && (
        <div className="text-center mt-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Fetching trends data...</p>
        </div>
      )}

      {!isLoading &&
        trends &&
        trends.map((trend, index) => (
          <div key={index} className="mb-3 p-3 border rounded">
            <Row>
              <Col md={8}>
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
                  {trend.breakdownTerms && trend.breakdownTerms.length > 0 && (
                    <div className={styles.breakdownTerms}>
                      {trend.breakdownTerms.map((term, idx) => (
                        <span key={idx} className={styles.breakdownTerm}>
                          {term}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
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
          </div>
        ))}
    </Container>
  );
}

export default GoogleTrends;
