![CI logo](https://codeinstitute.s3.amazonaws.com/fullstack/ci_logo_small.png)

Based on the frontend steps for building the moments fullstack app [in this repo](https://github.com/Code-Institute-Solutions/moments).

## Workflow

```sh
npm run lint
npm start //port 3000
npm test
npm run build
```

## Setting up the project

Bootstrap [4.6 getting started](https://react-bootstrap-v4.netlify.app/)

```sh
npm install react-bootstrap@1.6.3 bootstrap@4.6.0
```

Add ES7+ React/Redux/React-Native snippets v4.4.3

[Font awesome](https://fontawesome.com/) [free](https://fontawesome.com/search?m=free&o=r) icons.

[Css Modules in React](https://medium.com/@ralph1786/using-css-modules-in-react-app-c2079eadbb87)

[Adding a CSS Modules Stylesheet](https://create-react-app.dev/docs/adding-a-css-modules-stylesheet/)

# Routing

Instead of the command ```npm install react-router-dom``` use this ```npm install react-router-dom@5.3.0```

I'm so used to seeing example code that looks like this:

```js
<Switch>
    <Route exact path="/" render={() => <h1>Home page</h1>} />
    <Route exact path="/signin" render={() => <h1>Sign in</h1>} />
    ...
</Switch>
```

and having to convert that to router 4:

```js
<Routes>
    <Route path="/" element={<section>...</section>} />
    <Route path="/posts/:postId" element={<SinglePostPage />} />
```

Just thought I would point that out in case it helps someone.

## Authentication

Provide the Heroku keys:

```txt
CLIENT_ORIGIN = the react app url.
CLIENT_ORIGIN_DEV = the gitpod url.
```

Import axios into the frontend:

```sh
npm i axios
```

Create an src/api/axiosDefaults.js

```js
import axios from "axios";

axios.defaults.baseURL = "https://drf-api-rec.herokuapp.com/";
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.withCredentials = true;

export const axiosReq = axios.create();
export const axiosRes = axios.create();
```

### Bootstrap forms

Add/update these style sheets:

- App.module.css
- Button.module.css
- SignInUpForm.module.css

Add the pages/auth directory with [this file](https://github.com/Code-Institute-Solutions/moments-starter-code/blob/master/06-starter-code/SignUpForm.js).

[Bootstrap forms](https://react-bootstrap-v4.netlify.app/components/forms/) have sample code that was modified a bit to look like the example below.

To hide elements *use the .d-none class or one of the .d-{sm,md,lg,xl}-none classes for any responsive screen variation* (from [these docs](https://getbootstrap.com/docs/4.4/utilities/display/)).

```tsx
<Form.Group controlId="username">
    <Form.Label className="d-none">username</Form.Label>
    <Form.Control
        className="styles.Input"
        type="text"
        placeholder="username"
        name="username"
        value={username}
        onChange={handleChange}
    />
</Form.Group>
```

### The submit handler

POST the sign-up form to the API and redirect to the sign-in page using React history.push method.

Set the form onSubmit function to call the event handler.

I have also added some notes on the nifty use of computed properties, destructuring and the spread operator.

```js
import { Link, useHistory } from "react-router-dom";
...

const SignUpForm = () => {
    /** Initialize the field variables with computed properties. */
    const [signUpData, setSignUpData] = useState({
        username: "",
        password1: "",
        password2: "",
    });
    // restructure the signup data so that the dot notation is not needed to access them
    const { username, password1, password2 } = signUpData;
    const [errors, setErrors] = useState({});

    /** To redirect to the sign in page after the registration call */
    const history = useHistory();

    /**
     * Instead of writing separate handlers for each variable, this function
     * sets the [property]=value pair using a spread operator to copy the other fields
     * and the left-hand bracket notation to set the appropriate property name.
     * @param {*} event
     */
    const handleChange = (event) => {
        setSignUpData({
            ...signUpData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
      event.preventDefault(); // so the page doesn't refresh as in the old HTML norm
      try {
        await axios.post("/dj-rest-auth/registration/", signUpData);
        history.push("/signin");
      } catch (err) {
        setErrors(err.response?.data);
      }
    };

    return (
      <Row className={styles.Row}>
          <Col className="my-auto py-2 p-md-2" md={6}>
              <Container className={`${appStyles.Content} p-4 `}>
                  <h1 className={styles.Header}>sign up</h1>

                  <Form onSubmit={{ handleSubmit }}>
                  ...
                   </Form.Group>
                  {errors.username?.map((message, idx) => (
                    <Alert variant="warning" key={idx}>
                      {message}
                    </Alert>
                  ))}
```

The submit button can show errors when the password don't match with a null_field_error:

```js
<Button
    className={`${btnStyles.Button} ${btnStyles.Wide} ${btnStyles.Bright}`}
    type="submit"
>
    Sign up
</Button>
{errors.non_field_errors?.map((message, idx) => (
    <Alert key={idx} variant="warning" className="mt-3">
        {message}
    </Alert>
))}
```

## Creating the SignIn form

This is a challenge section with the following brief:

“As a user I can sign in to the app so that I can access functionality for logged in users”

- The form
- Handle Events
- Handle Errors

### The form

- A field for the Username
- A field for the Password
- A Sign In Button

And the basic setup steps:

1. Create SignInForm.js in "src/pages/auth"
2. Import it into App.js
3. Add "/signin" to the route render prop

### Handling Events

- Handle Changes from the Username or Password inputs
- Handle a Form Submit Event
- Redirect to the Sign In page, once a form has successfully been submitted.

### Handling Errors for SignInForm

- Errors on the Username Field
- Errors on the Password Field
- Non_field_errors, such as providing incorrect credentials.

## The useContext hook

To make these getters and setters available to all children of the providers, here are the basics.

[src/App.js](https://github.com/mr-fibonacci/moments/blob/a6d063e846e748d68b203b7d8f2d76068a1ccb4a/src/App.js)

```js
import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  const handleMount = async () => {
    try {
      const { data } = await axios.get("dj-rest-auth/user/");
      setCurrentUser(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    handleMount();
  }, []);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <SetCurrentUserContext.Provider value={setCurrentUser}>
```

This feature is used to update the user on login and change the navbar accordingly.

### Uncaught TypeError: Cannot read property 'post' of undefined

On a side note, if you see the above error, its just the wrong import format of axios.

Instead of this 'named import':

```js
import { axios } from "axios";
```

Use this 'default import':

```js
import axios from 'axios';
```

A file can only have one default export, but as many named exports as you'd like.

### Using a provider context

In the src/pages/auth/SignInForm.js file, this is how the useContext hook is used with the SetCurrentUserContext defined in the App.js.

```js
import React, { useContext, useState } from "react";
...
import { SetCurrentUserContext } from "../../App";

function SignInForm() {
  const setCurrentUser = useContext(SetCurrentUserContext);

  ...

      const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const { data } = await axios.post("/dj-rest-auth/login/", signInData);
            setCurrentUser(data.user);
            history.push("/");
        } catch (err) {
            setErrors(err.response?.data);
        }
    };

```

A similar thing is done in the navbar to use the logged in username:

```js
import { CurrentUserContext } from "../App";

const NavBar = () => {
  const currentUser = useContext(CurrentUserContext);
```

In the navar we also now use loggedInIcons loggedOutIcons variables to simplify the UI.  We don't want to show the sign-in/up icons after a user is logged in.

The more business logic and if/else boolean flags used in the UI, the harder it is to read and add features to without breaking something else.  So these variables simplify that with the ternary logic happening in one place:

```js
{currentUser ? loggedInIcons : loggedOutIcons}
```

### Functions with arrows and standards

The above code shows a bit of inconsistency in showing code with the function format when it used the arrow version in the sign up component.

The functional component versus the version with a 'fat' arrow version (sometimes also called a lambda):

#### Snippet: rfce (react functional component w/ export default at the bottom)

```js
function SignInForm() {
```

#### Snippet: rafce (react component utilizing an arrow function)

```js
const SignUpForm = () => {
```

Its best to follow a consistent pattern in a code base.  This stops developers wasting time arguing and re-working code that doesn't change the function of the code in anyway.  Things like formatting and arguments about tabs versus spaces just waste precious time.

Using Prettier to take formatting off the table is a great idea.  Use the default settings unless there is agreement among developers on a specific project that there is a reason to change something.  Manually fixing indentation is also a waste of time.

An example of this is when I started work on a project with a sizable pre-existing code base which had tab size set to 4.

The default Prettier tab size is 2.  We decided to stick with 4 as the only exception to the defaults.

This was done by having this is .vscode\settings.json

```json
{
    "prettier.tabWidth": 4,
}
```

In user settings, it chang be changed for all projects:

Prettier: Tab Width: 2

In this way all projects except the one with an exception can use the default.

## Custom hooks

Here a new directory contexts/CurrentUserContext.js is created to hold the context handleMount and useEffect and context object code from the App.js file shown in the previous section.

The new component then gets used higher up in the index.js file like this:

```js
ReactDOM.render(
  <React.StrictMode>
    <Router>
      <CurrentUserProvider>
        <App />
      </CurrentUserProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
```

Along with the code from the App.js file, two more custom hooks are added to the CurrentUserContext.js file:

```js
export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);
```

This is done to make accessing current use and set current user easier.  They are then used like this:

```js
import { useSetCurrentUser } from "../../contexts/CurrentUserContext";

function SignInForm() {
  const setCurrentUser = useSetCurrentUser();
```

## Refresh tokens

The data returned from the server on login looks like this:

```json
{
    "access_token": "eyJ0eXA...",
    "refresh_token": "eyJ0eXA...",
    "user": {
        "pk": 14,
        "username": "asdf",
        "email": "",
        "first_name": "",
        "last_name": "",
        "profile": {
            "id": 14,
            "owner": "asdf",
            "created_at": "12 Dec 2023",
            "updated_at": "12 Dec 2023",
            "name": "",
            "content": "",
            "image": "https://res.cloudinary.com/...",
            "is_owner": true,
            "following_id": null,
            "posts_count": 0,
            "followers_count": 0,
            "following_count": 0
        },
        "profile_id": 14,
        "profile_image": "https://res.cloudinary.com/..."
    }
}
```

JWT access tokens only last for five minutes.  The refresh token for one day.

### axios interceptors

The source code for these changes can be found [here](https://github.com/mr-fibonacci/moments/blob/a981c39da1671a70023a3d6f3cf1410164e84e06/src/contexts/CurrentUserContext.js).

Interceptors can:

- automatically intercept both requests and responses from the API
- run custom code before they are passed on.

That will happen in src\contexts\CurrentUserContext.js where a useMemo hook used.

useMemo is usually used to cache complex values that take time to compute.  
here it is used because want to attach the interceptors before the children mount,  
as that’s where we’ll be using  them and making the requests from.

```js
  useMemo(() => {
    axiosReq.interceptors.request.use(
      async (config) => {
        try {
          // try to refresh the token before sending the request
          await axios.post("/dj-rest-auth/token/refresh/");
        } catch (err) {
          setCurrentUser((prevCurrentUser) => {
            if (prevCurrentUser) {
              // if that fails and the user was previously logged in it means that the refresh token has expired
              // so redirect the user to the SignIn page and set currentUser to null
              history.push("/signin");
            }
            return null;
          });
          return config;
        }
        return config;
      },
      (err) => {
        // if there's an error reject the Promise with the returned config
        return Promise.reject(err);
      }
    );

    axiosRes.interceptors.response.use(
      (response) => response,
      async (err) => {
        if (err.response?.status === 401) {
          try {
            await axios.post("/dj-rest-auth/token/refresh/");
          } catch (err) {
            setCurrentUser((prevCurrentUser) => {
              // if the user was logged in redirect to signin and set data to null
              if (prevCurrentUser) {
                history.push("/signin");
              }
              return null;
            });
          }
          // If there’s no error refreshing the token return an axios instance with the error config
          return axios(err.config);
        }
        // In case the error wasn’t 401 reject the Promise with the error
        return Promise.reject(err);
      }
    );
  }, [history]);
  ```

The handleMount function should use the axiosRes.get() instead of axios.get.

Nothing is using the request yet, but that will come.

## Update navBar for loggedIn/loggedOut

The [source code for these changes](https://github.com/mr-fibonacci/moments/tree/747d9d2350c57c995b52b4ff48a2e2b40cbf74b6).

Add the remaining icons to the NavBar for logged in users.  Here is what the add post icon looks like:

```js
const NavBar = () => {
  ...

  const addPostIcon = (
    <NavLink
      className={styles.NavLink}
      activeClassName={styles.Active}
      to="/posts/create"
    >
      <i className="far fa-plus-square"></i>Add post
    </NavLink>
  );
  ...
    return (
    <Navbar className={styles.NavBar} expand="md" fixed="top">
      <Container>
        <NavLink to="/"> ... </NavLink>
        {currentUser && addPostIcon}
  ```

The logged in user will have an avatar image, which is done with a specific component.

```css
.Avatar {
  border-radius: 50%;
  margin: 0px 8px 0px 8px;
  object-fit: cover;
}
```

The object-fitcover:  will make sure the profile image fits its container no matter what the image dimensions are.

```js
import React from "react";
import styles from "../styles/Avatar.module.css";

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

export default Avatar;
```

This used the ‘rafce’ code snippet from the ES7Snippets plugin.

The Avatar component takes some props which is descructures and provides a default height.

Check out [destructuring-assignment default values](9https://zaiste.net/posts/javascript-destructuring-assignment-default-values/) for more about that.

As a note, that can also be done like this:

```js
const Avatar = (props) => {
  const { src, height = 45, text } = props;
  ```

## NavBar burger toggle with a custom hook

The burger menu has an issue that when we click open we have to close it manually.

The changes for this work are [here](https://github.com/mr-fibonacci/moments/tree/35369a14e40c6132b7ad033aac90faa8143a7c75).

This change will references the DOM using the useRef hook.

Bootstrap Navbar has an expanded property which we tie to a state variable.  This get toggled in the ```onClick={() => setExpanded(!expanded)}``` function

```js
const ref = useRef(null);
useEffect(() => {
  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setExpanded(false);
    }
};
```

Used on the tag like this:

```js
        <Navbar.Toggle
          ref={ref}
```

The code is first shown in-situ in the NavBar.  After it works it is refactored by putting the whole thing in a custom hook.  There are good reasons for this.

- It makes the code cleaner with all the logic for the toggle functionality in one place.
- The above follows the Single Responsibility Principal (SRP or the SOLID principals of development) which also allows the navbar to only be responsible for what it does.
- It can be reusable any time we want to toggle any element.

The custom hook looks like this:

```js
import useClickOutsideToggle from "../hooks/useClickOutsideToggle";

const NavBar = () => {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();

  const { expanded, setExpanded, ref } = useClickOutsideToggle();
  ...
    return (
    <Navbar
      expanded={expanded}
      className={styles.NavBar}
      expand="md"
      fixed="top"
    >
      <Container>
        <NavLink to="/"> ... </NavLink>
        {currentUser && addPostIcon}
        <Navbar.Toggle
          ref={ref}
          onClick={() => setExpanded(!expanded)}
          aria-controls="basic-navbar-nav"
        />
        ...
```

The ref prop references the DOM element and detects if the mouse clicks outside of it.

It relies on a useEffect hook.

```js
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setExpanded(false);
      }
    };
    document.addEventListener("mouseup", handleClickOutside);
    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
    };
  }, [ref]);
```

The handleClickOutside function has an event argument.

If the element is null which is the initial value.

If the user has clicked outside the referenced button call setExpanded false to close the menu.

The mouseup event listener sets the handleClickOutside as its callback.  This means the hook will run every time the user clicks somewhere (technically after the click).

The cleanup function removes the listener.  Even though the navbar won’t be unmounted, it’s a best practice to remove event  
listeners in case it’s used on an element that could unmount.

The ref is put in the useEffect’s dependency array so this effect runs when it changes.

## Creating Posts

Add a new route in the App.js file:

```js
<Route exact path="/posts/create" render={() => <PostCreateForm />} />
```

Add as well as a PostCreateForm.js file and a reusable Asset.js file both with CSS modules.

Next, add the input fields for the post title and content and write the logic to store and update the state of the input fields.

This is done in the same pattern as the sign up form:

```js
  const [data, setData] = useState({
      x: "",
      y: "",
      z: "",
  });
  // restructure the signup data so that the dot notation is not needed to access them
  const { x, x, y } = data;

  const handleChange = (event) => {
      setData({
          ...data,
          [event.target.name]: event.target.value,
      });
  };
```

Then we make the upload function:

```js
  const handleChangeImage = (event) => {
    if (event.target.files.length) {
      URL.revokeObjectURL(image);
      setPostData({
        ...postData,
        image: URL.createObjectURL(event.target.files[0]),
      });
    }
  };
```

Check if a file chosen a file then setPostData with the postData and the files array on event.target  

More about [URL and its methods](https://developer.mozilla.org/en-US/docs/Web/API/URL).

URL.revokeObjectURL is called to clear the browser's reference to the previous file in case it was changed.

The image preview is a fragment with a figure and a div

```js
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
    ...
  )}
```

## sending image data to the API

Create a reference to the Form.File component  
Use history to redirect.

The [formData object instance](https://developer.mozilla.org/en-US/docs/Web/API/FormData) provides a way to construct a set of key/value pairs representing form fields and their values, which can be sent using the fetch(), XMLHttpRequest.send() or navigator.sendBeacon() methods. It uses the same format a form would use if the encoding type were set to "multipart/form-data".

```js
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
```

## The Post Page

The user story: "As a user I  can view the details of a single post so that I can learn more about it."

The link has an id:

```js
<Route exact path="/posts/:id" render={() => <PostPage />} />
```

Use on the page like this:

```js
function PostPage() {
  const { id } = useParams();
```

The request is done in an effect hooks which will run everytime the id changes:

```js
  useEffect(() => {
    const handleMount = async () => {
      try {
        const [{ data: post }] = await Promise.all([
          axiosReq.get(`/posts/${id}`),
        ]);
        setPost({ results: [post] });
        console.log(post);
      } catch (err) {
        console.log(err);
      }
    };
    handleMount();
  }, [id]);
```

Later there will be two requests for a post and comments.

Destructing the data property returned from the API and renaming it to post is a pretty neat way to use Promise.all which the comments call can be added to later.

## The Post Component

In the src\pages\posts\Post.js detail page, if the currentUser is the owner of the post we will add functionality later to edit it.  It looks like this:

```js
          <div className="d-flex align-items-center">
            <span>{updated_at}</span>
            {is_owner && postPage && "..."}
          </div>
```

To achieve this the Post component a prop from the PostPage:

```js
<Post {...post.results[0]} setPosts={setPost} postPage />
```

The tutorial says: *Notice that we don’t need to give our postPage prop a value here, simply applying it means it will be returned as true inside our Post component.*

What?  Is that a reference to the post page?  It's times like this that I miss TypeScript.

Here is where the prop comes in:

```js
const Post = (props) => {
  const {
    id,
    owner,
    profile_id,
    profile_image,
    comments_count,
    likes_count,
    like_id,
    title,
    content,
    image,
    updated_at,
    postPage,
  } = props;
```

I still don't get it.  Is it a boolean?  I guess despite the name, an un-named string on a React component ends up being a boolean.  For example, what is the difference between this:

```js
<Post {...post.results[0]} setPosts={setPost} />
```

And this:

```js
<Post {...post.results[0]} setPosts={setPost} postPage />
```

The Post component weill see postPage as false in the first usage, and true in the second.  Kind of like React magic I suppose.  It could have been named something like allowPostEditBoolean or some other descriptive name.

Remaining are the like and comment icons and their associated UI logic.

## Liking and Unliking Posts

handleLike & handleUnlike

```js
      const { data } = await axiosRes.post("/likes/", { post: id });
      setPosts((prevPosts) => ({
        ...prevPosts,
        results: prevPosts.results.map((post) => {
          return post.id === id
            ? { ...post, likes_count: post.likes_count + 1, like_id: data.id }
            : post; // <-- do nothing to this one
        }),
      }));
```

We spread the previousPosts in the object then map over it and inside use a ternary operator to check if post id matches the id of the post that was liked.

If it does match, we’ll return the post object with the likes count incremented by one, and the like_id set to the id of the response data.

The unlike is the same but decrements the count and calls the DELETE endpoint with no result needed:

```js
      await axiosRes.delete(`/likes/${like_id}/`);
```

## Displaying the Posts List

The part one user story: "As a user I can view all the most recent posts,  so that I am up to date with the newest content.".

THis includes business logic in the App.js for search results and a link to the posts page.

```js
path="/"
path="/feed"
path="/liked"
```

In part two we add the logic to make requests to the API based on filters.

The useLocation hook is used to get the current URL to switch between home, feed and liked pages.

A loading spinner is used to show the loading state.

Map over the returned posts and pass the object into post detail page created earlier.

```js
  {hasLoaded ? (
    <>
      {posts.results.length ? (
        posts.results.map((post) => (
          <Post key={post.id} {...post} setPosts={setPosts} />
        ))
      ) : (
        // show no results
      )}
    </>
  ) : (
    // show spinner
  )}
```

## The search bar

The user story: "As  a user, I can search for posts with keywords, so that I can find the posts and user  profiles I am most interested in."

```js
 const [query, setQuery] = useState("");

  useEffect(() => { /* fetch posts */ });

    setHasLoaded(false);
    const timer = setTimeout(() => {
      fetchPosts();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [filter, query, pathname]);

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <p>Popular profiles mobile</p>
        <i className={`fas fa-search ${styles.SearchIcon}`} />
        <Form
          className={styles.SearchBar}
          onSubmit={(event) => event.preventDefault()}
        >
          <Form.Control
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type="text"
            className="mr-sm-2"
            placeholder="Search posts"
          />
        </Form>
```

To avoid the whole page flashing every time a key is pressed we want to wait a moment after the user has stopped typing and then call the API request.

## Infinite scroll

This feature uses the [react-infinite-scroll-component](https://www.npmjs.com/package/react-infinite-scroll-component) library.

```sh
npm install --save react-infinite-scroll-component
```

The [Source code](https://github.com/mr-fibonacci/moments/tree/7c6f06ba01857522c52ed4841fbd8a86b7c6c567) for this section implements the following user story:

*As a user I can  keep scrolling through the images on the site that are loaded for me automatically so  that I don't have to click on "next page" button.*nb

Here is a sample result for request method GET: /posts/?search=

```json
{
    "count": 12,
    "next": "https://drf-api-rec.herokuapp.com/posts/?page=2&search=",
    "previous": null,
    "results": [
        {
            "id": 12,
            "owner": "asdf",
            "is_owner": true,
            "profile_id": 14,
            "profile_image": "https://res.cloudinary.com/dgjrrvdbl/image/upload/v1/media/../default_profile_qdjgyp",
            "created_at": "18 Dec 2023",
            "updated_at": "18 Dec 2023",
            "title": "The team",
            "content": "Oh my.",
            "image": "https://res.cloudinary.com/dgjrrvdbl/image/upload/v1/media/images/Capture-boy-actors_czsqtu",
            "image_filter": "normal",
            "like_id": null,
            "likes_count": 0,
            "comments_count": 0
        },
        ...
    ]
}
```

The infinite scroll has the following props:

- the “children” prop will tell the InfiniteScroll component which child components we want it to render.  
- the dataLength prop tells the component how many posts are currently being displayed: posts.results.length.
- the loader prop for the spinner
- the hasMore prop for more data to load on reaching the bottom of the current page.  For this the posts result object from the API contains a key called ‘next’ which is a link to the next page of results. the last page, that value will be null.
The component looks like this:
- the next prop is a function called to load the next page of results if the hasMore prop is true

```js
  <InfiniteScroll
    children={posts.results.map((post) => (
      <Post key={post.id} {...post} setPosts={setPosts} />
    ))}
    dataLength={posts.results.length}
    loader={<Asset spinner />}
    hasMore={!!posts.next}
    next={() => fetchMoreData(posts, setPosts)}
  />
```

The "double bang" syntax: ```!!posts.next```, a.k.a. [Double NOT (!!)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_NOT#double_not_!!).

This operator returns true for truthy values, and false for falsy values.

### utils/utils.js fetchMoreData function

The fetchMoreData function is created to reuse it later on for fetching other paginated data, like comments and profiles.

It accepts two arguments to update different types of data for the InfiniteScroll component.  They could be posts/setPosts or comments/setComments.

The resource.next is the URL to the next page of results (in the current JSON result as shown above).

If no error call setResource and pass it a callback function with prevResource as  
the argument.

The callback function will return an object with the spread prevResource inside.

Then update the next attribute with the URL to the next page of results.

Also update the results array to include the newly fetched results, appending to the existing ones our the state is rendering.

Tha Javascript reduce method is used to reduce multiple values in an array into a single value.  In this case, that's an array of posts.

The reduce method is used to add new posts to the prevResource.results array.  It sets the initial value for the accumulator to the previous results.

We don't display the next page of results the API has sent us because posts could have added or deleted.  Since the newest posts are loaded first users may have added posts since the last results and we now need to filter out any duplicate.

The some() method checks whether the callback passed to it returns true for at least one element in the array and it stops running as soon as it does.

If any post IDs matches an id that already exists in previous results, return the existing accumulator to the reduce method.

If it doesn’t find a match, it's a new post, return the spread accumulator with the new post at the end.

```js
export const fetchMoreData = async (resource, setResource) => {
  try {
    const { data } = await axiosReq.get(resource.next);
    setResource((prevResource) => ({
      ...prevResource,
      next: data.next,
      results: data.results.reduce((acc, cur) => {   // the reduce method loops thru the new page of results and returns a single result
        return acc.some((accResult) => { // loop thru the array of posts in the accumulator 
          return accResult.id === cur.id) // compare each accumulator item id to the current post id from the newly fetched posts array
          ? acc // if the some() returns true it found a match and we are displaying that post already
          // so return the accumulator without adding the post to it 
          : [...acc, cur]; // if the some() method does not find a match, we return an array containing our spread accumulator with the new post added to it
        }
      }, prevResource.results), // appended the new results to the existing posts in posts.results
    }));
  } catch (err) {}
};
```

## Post Owner Dropdown Menu

In this section we create the edit and delete options for post owners.  The [source code link](https://github.com/mr-fibonacci/moments/tree/a63232e8064c2f639daf7b073b9ef22708b1c8c9).

create the MoreDropdown.module.css file in the /styles directory and MoreDropdown.js file in the components directory.

'popper' is a 3rd party library used by React-Bootstrap. Here we are passing a config object to make sure the dropdown menus position is fixed on all browsers.*

Browser Bug Fix: *To be sure that the position of the dropdown menu is consistent across browsers, we need to add a popperConfig prop to our Dropdown.Menu component.

In MoreDropdown.js, add the popperConfig={{ strategy: "fixed" }} prop to your Dropdown.Menu component:

```js
<Dropdown.Menu
   className="text-center"
   popperConfig={{ strategy: "fixed" }}
>
```

In the Post component define functions to handle  editing and deleting posts.

When the user clicks the edit button, redirect them to a new url,  

The DELETE API endpoint is `/posts/${id}/` and uses the ```history.goBack();``` if successful.

Links for this section include:

- [React-Bootstrap custom dropdown menu](https://react-bootstrap-v4.netlify.app/components/dropdowns/#custom-dropdown-components)
- [Forwarding Refs](https://legacy.reactjs.org/docs/forwarding-refs.html#forwarding-refs-to-dom-components)
- [Source Code](https://github.com/mr-fibonacci/moments/blob/a63232e8064c2f639daf7b073b9ef22708b1c8c9/src/components/MoreDropdown.js)

### Forwarding refs

I guess that link is from [the legacy react docs](https://legacy.reactjs.org/docs/forwarding-refs.html#forwarding-refs-to-dom-components).  On that page it says: *These docs are old and won’t be updated. Go to react.dev for the new React docs.*

[New documentation pages](https://react.dev/reference/react/forwardRef) *teach modern React*.

What has changed, I'm not sure.

The example from the legacy docs: *passing a ref through a component to one of its children, can be useful for reusable component libraries...*

```js
const FancyButton = forwardRef((props, ref) => (
  <button ref={ref} className="FancyButton">
    {props.children}
  </button>
));

// You can now get a ref directly to the DOM button:
const ref = React.createRef();
<FancyButton ref={ref}>Click me!</FancyButton>;
```

And the new docs: *forwardRef lets your component expose a DOM node to parent component with a ref.*

```js
const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} />
    </label>
  );
});
```

## ESLint

To set up linting in a project, these steps can be followed:

```sh
node_modules/.bin/eslint --init
```

Add this to the package.json scripts array:

```json
"lint": "eslint ."
```

Then to lint the whole project, run:

```sh
npm run lint
```

Also, after setup, linting will be run on open files in VSCode.  For an existing project like this, we will start to see a number of errors on files that were previously thought fine.

Setting up linting on the full moments app has the following output:

```sh
✖ 120 problems (120 errors, 0 warnings)
'src' is missing in props validationeslintreact/prop-types
```

This seems like a TypeScript error.  The [docs for this error](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/prop-types.md) which says *Defining types for component props improves reusability of your components by validating received data. It can warn other developers if they make a mistake while reusing the component with improper data type.  Note: You can provide types in runtime types using PropTypes and/or statically using TypeScript or Flow.*

Wow, they are still pushing Flow.  Ironic name as typings often disrupt the normal flow of Javascript (for good reason of course).

### 'x' is missing in props validationeslintreact/prop-types

The first error there: *'src' is missing in props validationeslintreact/prop-types*

I am going to disable this error for now using this line:

```js
/* eslint-disable react/prop-types */
```

The solution suggested by the docs page would be to add our own PropTypes, such as this:

```js
const Avatar = ({ src, height = 45, text }) => {
  return ( ... );
};
export default Avatar;

Avatar.protoTypes = { src: PropTypes.string.isRequired }
```

I'm used to using TypeScript for everything, so I have to admit I'm a little lost with how to do this with vanilla JS.  Time to figure that out.

This would be the solution for this:

```js
import React from "react";
import styles from "../styles/Avatar.module.css";
import PropTypes from "prop-types";

const Avatar = ({ src, height = 45, text }) => {
  return ( ... );
};

Avatar.propTypes = {
  src: PropTypes.string.isRequired, // Assuming src should be a string and is required
  height: PropTypes.number, // Assuming height should be a number, but it's optional
  text: PropTypes.node, // Assuming text can be any node (string, number, element, etc.)
};

export default Avatar;
```

This is Assuming src should be a string and is required, height optional and text can be any node (string, number, element, etc.).

I'm not sure if these types would have to be installed separately like this: npm install prop-types

For me, just adding the types above made that issue go away.

### Component definition is missing display nameeslintreact/display-name

The next error I see is: *Component definition is missing display nameeslintreact/display-name (alias) namespace React*

```js
import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import styles from "../styles/MoreDropdown.module.css";

// The forwardRef is important!!
// Dropdown needs access to the DOM node in order to position the Menu
const ThreeDots = React.forwardRef(({ onClick }, ref) => (
  <i
    className="fas fa-ellipsis-v"
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  />
));

ThreeDots.displayName = "ThreeDots";

const MoreDropdown = function MoreDropdown({ handleEdit, handleDelete }) {
  return ( ... );
};

export default MoreDropdown;
```

According to the [docs](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/display-name.md) we just need to displayName property defined.  This does not apply to the MoreDropdown I guess because it's defined as a named function?  I must have read about this years ago, but again, TypeScript makes this a non-issue.

### `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.eslintreact/no-unescaped-entities

In Posts.js, we see this code:

```js
<OverlayTrigger
  placement="top"
  overlay={<Tooltip>You can't like your own post!</Tooltip>}
>
...
```

I suppose this is needed: &apos;

### 'React' must be in scope when using JSXeslintreact/react-in-jsx-scope

The error occurs here:

```js
  return (
    <CurrentUserContext.Provider value={currentUser}>
      <SetCurrentUserContext.Provider value={setCurrentUser}>
        {children}
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
```

I believe that is solved just by importing React like this: ```import React from "react"```

### Do not pass children as props

The full error: *Do not pass children as props. Instead, nest children between the opening and closing tags.eslintreact/no-children-prop*

This error occurs in src\pages\posts\PostsPage.js.

```js
  <InfiniteScroll
    children={posts.results.map((post) => (
      <Post key={post.id} {...post} setPosts={setPosts} />
    ))}
    dataLength={posts.results.length}
    loader={<Asset spinner />}
    hasMore={!!posts.next}
    next={() => fetchMoreData(posts, setPosts)}
  />
```

ChatGPT shows the solution as:

```js
<InfiniteScroll
  dataLength={posts.results.length}
  loader={<Asset spinner />}
  hasMore={!!posts.next}
  next={() => fetchMoreData(posts, setPosts)}
>
  {posts.results.map((post) => (
    <Post key={post.id} {...post} setPosts={setPosts} />
  ))}
</InfiniteScroll>
```

## The Edit Post form

Here is the user story for this section: *As a post owner I can edit my post so that I can make corrections or update my post after it was created.*

PostEditForm.js starts off as a copy of postCreateForm.js.  The route is /posts/:id/edit for the App.js routs.  As well as the useParams hook to get the edit id, the handleMount async function inside the use effect does the rest.

We only allow the post owner to access the edit post page in the first  place, and redirect other users away.

```js
  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get(`/posts/${id}/`);
        const { title, content, image, is_owner } = data;
        is_owner ? setPostData({ title, content, image }) : history.push("/");
      } catch (err) {
        console.log(err);
      }
    };
    handleMount();
  }, [history, id]);
```

The handleSubmit function also needs to call PUT instead of POST.

## The Create Comment Form

don’t need to do anything new to make a CommentCreateForm component

The user story: “As a logged in user I can add comments to a post so that I can share my thoughts about the post”

Your completed form should contain:

A Comments Text Field
An interactive Comments Icon
Comments Edit Form

Steps
Please follow the steps below to add this component to the project.

### Step 1

- create a CommentCreateEditForm.module.css file
- Create a comments directory inside your src/pages directory and a [CommentCreateForm.js file](https://github.com/mr-fibonacci/moments/blob/09254af91d92105468266c3e7691158054284168/src/pages/comments/CommentCreateForm.js)

### Step 2

Make adjustments to PostPage.js (NOT PostsPage.js)

```js
const currentUser = useCurrentUser();
const profile_image = currentUser?.profile_image;
const [comments, setComments] = useState({ results: [] });

...
{currentUser ? (
  <CommentCreateForm
  profile_id={currentUser.profile_id}
  profileImage={profile_image}
  post={id}
  setPost={setPost}
  setComments={setComments}
/>
) : comments.results.length ? (
  "Comments"
) : null}
```

### Step 3: The Comment Component

In the useEffect handleMount function, we add a call to the comments API and destructure the data properties to rename it comments.

So the Primise.all returns two objects in order, the first data result is named post, the second, comments:

```js
const [{ data: post }, { data: comments }] = await Promise.all([
  axiosReq.get(`/posts/${id}`),
  axiosReq.get(`/comments/?post=${id}`),
]);
setPost({ results: [post] });
setComments(comments);
```

A ternary checks if there are any comments and show messages depending if the user is logged in or not:

```js
{comments.results.length ? (
  comments.results.map((comment) => (
    <Comment key={comment.id} {...comment} />
  ))
) : currentUser ? (
  <span>No comments yet, be the first to comment!</span>
) : (
  <span>No comments... yet</span>
)}
```

The Comment component is straight forward, getting all it's props using the spread destructuring operator.

## Original readme

Welcome,

This is the Code Institute student template for React apps on the Codeanywhere IDE. We have preinstalled all of the tools you need to get started. It's perfectly ok to use this template as the basis for your project submissions.  
DO NOT use this template if you are using the Gitpod IDE. Use the following command instead:  
`npx create-react-app . --template git+https://github.com/Code-Institute-Org/cra-template-moments.git --use-npm`

You can safely delete this README.md file, or change it for your own project. Please do read it at least once, though! It contains some important information about Codeanywhere and the extensions we use. Some of this information has been updated since the video content was created. The last update to this file was: **31st August, 2023**

## Codeanywhere Reminders

In Codeanywhere you have superuser security privileges by default. Therefore you do not need to use the `sudo` (superuser do) command in the bash terminal in any of the lessons.

To log into the Heroku toolbelt CLI:

1. Log in to your Heroku account and go to *Account Settings* in the menu under your avatar.
2. Scroll down to the *API Key* and click *Reveal*
3. Copy the key
4. In Codeanywhere, from the terminal, run `heroku_config`
5. Paste in your API key when asked

You can now use the `heroku` CLI program - try running `heroku apps` to confirm it works. This API key is unique and private to you so do not share it. If you accidentally make it public then you can create a new one with *Regenerate API Key*.

---

Happy coding!

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm install`

Installs the required npm packages.

### `npm start`

Runs the app in the development mode.\
Open port 3000 to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
