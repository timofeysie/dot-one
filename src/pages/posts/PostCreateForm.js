import React, { useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Image from "react-bootstrap/Image";
import Asset from "../../components/Asset";
import Upload from "../../assets/upload.png";
import styles from "../../styles/PostCreateEditForm.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import { useHistory } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import { useRedirect } from "../../hooks/useRedirect";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import LinkSelectorWrapper from "../../components/WebComponents/LinkSelector/LinkSelectorWrapper";
import GoogleTrends from "../../components/Trends/GoogleTrends";

function PostCreateForm() {
  useRedirect("loggedOut");
  const [errors, setErrors] = useState({});

  const [postData, setPostData] = useState({
    title: "",
    content: "",
    image: "",
  });
  const { title, content, image } = postData;

  const imageInput = useRef(null);
  const history = useHistory();

  const [selectedTrendTitles, setSelectedTrendTitles] = useState([]);

  const handleTitleChange = (event) => {
    setPostData({
      ...postData,
      [event.target.name]: event.target.value,
    });
  };

  const handleChange = (value) => {
    setPostData((prevData) => ({
      ...prevData,
      content: value,
    }));
  };

  const handleChangeImage = (event) => {
    if (event.target.files.length) {
      URL.revokeObjectURL(image);
      setPostData({
        ...postData,
        image: URL.createObjectURL(event.target.files[0]),
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    formData.append("title", title);
    formData.append("content", content);
    formData.append("image", imageInput.current.files[0]);

    try {
      const { data } = await axiosReq.post("/posts/", formData);
      history.push(`/posts/${data.id}`);
    } catch (err) {
      console.log(err);
      if (err.response?.status !== 401) {
        setErrors(err.response?.data);
      }
    }
  };

  const handleLinkSelected = (selectedValue) => {
    console.log("Selected link type:", selectedValue);
  };

  const handleUseLink = ({ url, title, linkType }) => {
    // Create the link HTML
    const linkText = `${title} (${linkType})`;
    const linkHtml = `<a href="${url}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;

    setPostData((prevData) => ({
      ...prevData,
      content: prevData.content
        ? `${prevData.content}<p>${linkHtml}</p>`
        : `<p>${linkHtml}</p>`,
    }));
  };

  /**
   * Titles come from selected Google Trends
   */
  const handleTrendSelect = (trendTitles) => {
    setSelectedTrendTitles(trendTitles);
    setPostData((prevData) => ({
      ...prevData,
      title: trendTitles.join(" x "),
    }));
  };

  const textFields = (
    <div className="text-center">
      <Form.Group>
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={title}
          onChange={handleTitleChange}
        />
      </Form.Group>
      {errors?.title?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}

      <Form.Group>
        <Form.Label>Content</Form.Label>
        <div name="desciption-container" className={styles.EditorContainer}>
          <ReactQuill
            className={`${appStyles.quill} ${styles.Editor}`}
            value={content}
            preserveWhitespace={true}
            onChange={(value) => handleChange(value)}
            modules={{
              toolbar: [
                [{ header: [1, 2, 3, 4, 5, 6, false] }],
                [{ font: [] }],
                [{ size: ["small", false, "large", "huge"] }],

                ["bold", "italic", "underline", "strike"],
                [{ script: "sub" }, { script: "super" }],

                [{ color: [] }, { background: [] }],

                [{ align: [] }],

                [{ list: "ordered" }, { list: "bullet" }],
                [{ indent: "-1" }, { indent: "+1" }],

                ["blockquote", "code-block"],

                ["link", "image", "video"],

                ["clean"],

                [{ direction: "rtl" }],
              ],
              clipboard: {
                matchVisual: false,
              },
            }}
          />
        </div>
      </Form.Group>
      {errors?.content?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}

      <br />
      <br />
      <Button
        className={`${btnStyles.Button} ${btnStyles.Blue}`}
        onClick={() => history.goBack()}
      >
        cancel
      </Button>
      <Button className={`${btnStyles.Button} ${btnStyles.Blue}`} type="submit">
        create
      </Button>
      <br />
      <br />
    </div>
  );

  const linkSelectors = (
    <div className="text-center">
      <div>Create links</div>
      {selectedTrendTitles.map((trendTitle, index) => (
        <Container key={index} className={`${appStyles.Content} mt-3`}>
          <LinkSelectorWrapper
            searchTerm={trendTitle}
            onSelect={handleLinkSelected}
            onUseLink={handleUseLink}
          />
        </Container>
      ))}
    </div>
  );

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col className="py-2 p-0 p-md-2" md={7} lg={8}>
          <Container
            className={`${appStyles.Content} ${styles.Container} d-flex flex-column justify-content-center`}
          >
            <Form.Group className="text-center">
              {image ? (
                <>
                  <figure>
                    <Image className={appStyles.Image} src={image} rounded />
                  </figure>
                  <div>
                    <Form.Label
                      className={`${btnStyles.Button} ${btnStyles.Blue} btn`}
                      htmlFor="image-upload"
                    >
                      Change the image
                    </Form.Label>
                  </div>
                </>
              ) : (
                <Form.Label
                  className="d-flex justify-content-center"
                  htmlFor="image-upload"
                >
                  <Asset
                    src={Upload}
                    message="Click or tap to upload an image"
                  />
                </Form.Label>
              )}

              <Form.File
                id="image-upload"
                accept="image/*"
                onChange={handleChangeImage}
                ref={imageInput}
              />
            </Form.Group>
            {errors?.image?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}

            <div className="d-md-none">{textFields}</div>
          </Container>
          <Container className={`${appStyles.Content} mt-3`}>
            <GoogleTrends onTrendSelect={handleTrendSelect} />
          </Container>
          <Container className={`${appStyles.Content} mt-3 d-md-none`}>
            {linkSelectors}
          </Container>
        </Col>
        <Col md={5} lg={4} className="d-none d-md-block p-0 p-md-2">
          <Container className={appStyles.Content}>{textFields}</Container>
          <br />
          <Container className={appStyles.Content}>{linkSelectors}</Container>
        </Col>
      </Row>
    </Form>
  );
}

export default PostCreateForm;
