# How the app was made

This is a detailed walkthrough with notes on feature creation and initial deployment.

## Table of contents

- About the project
- Routing
- Authentication
- Creating the SignIn form
- The useContext hook
- Custom hooks
- Refresh tokens
- Update navBar for loggedIn/loggedOut
- NavBar burger toggle with a custom hook
- Creating Posts
- sending image data to the API- The Post Page
- Liking and Unliking Posts
- Displaying the Posts List
- The search bar
- Infinite scroll
- Post Owner Dropdown Menu
- ESLint
- The Edit Post form
- The Create Comment Form
- The Comment Component Dropdown Menu
- The Edit Comment Form
- The infinite scroll for comment components challenge
- The PopularProfiles Component
- Profile data context & building the profile header
- Following Profiles
- The un-follow profiles functionality
- Editing the profile
- Redirecting the user
- Unit tests
- Cleaning up Errors
- The oval icons
- A few last things
- Deploying to Heroku
- Running locally with the new backend
- The broken avatar image
- Useful links
- Original readme
- Codeanywhere Reminders
- Getting Started with Create React App- Available Scripts
- Learn More

## About the project

This project uses React v17.0.2 which was released March 2021.  I relies on a deployed [Django (Python) backend project](https://github.com/timofeysie/drf-two) by default.  This can be changed by editing the ```axios.defaults.baseURL``` value in src\api\axiosDefaults.js file to point to a locally running backend.

It uses the [Bootstrap v4.6](https://react-bootstrap-v4.netlify.app/) CSS framework which was released January 2021.

It also use:

- [Font awesome](https://fontawesome.com/) [free](https://fontawesome.com/search?m=free&o=r) icons
- [Css Modules in React](https://medium.com/@ralph1786/using-css-modules-in-react-app-c2079eadbb87)
- [CSS Modules Stylesheet](https://create-react-app.dev/docs/adding-a-css-modules-stylesheet/)

The package.json for the app after its complete uses these version settings:

```js
  "dependencies": {
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^11.2.7",
    "@testing-library/user-event": "^12.8.3",
    "axios": "^0.21.4",
    "bootstrap": "^4.6.0",
    "jwt-decode": "^3.1.2",
    "react": "^17.0.2",
    "react-bootstrap": "^1.6.3",
    "react-dom": "^17.0.2",
    "react-infinite-scroll-component": "^6.1.0",
    "react-router-dom": "^5.3.0",
    "react-scripts": "^4.0.3",
    "web-vitals": "^1.1.2"
  },
```

The documentation below follow the [Code Institute](https://codeinstitute.net/global/about-us/) advanced frontend moments project walkthrough.

As of this writing, mid-2024, the stack is getting quite dated.  As it was designed for a full-stack web development boot camp student project, it has served its purpose well.  Be aware that information online about the libraries used might point to newer versions.  A good example is the routing section below.

## Routing

Instead of the command ```npm install react-router-dom``` use this ```npm install react-router-dom@5.3.0```

The current version of react-router-dom is v6.4 as of August 2024.  The architecture for this project as set in September 2021 when the DOM router version was at v5.3.

There are all kinds of differences from v4 and v5 before 5.1 which introduced hooks.

Version 5 uses a switch statement to handle routes in the App.js file and looks like this:

```js
<Switch>
    <Route exact path="/" render={() => <h1>Home page</h1>} />
    <Route exact path="/signin" render={() => <h1>Sign in</h1>} />
    ...
</Switch>
```

You will no doubt see a lot of router v6 example around the web that look like like this:

```js
<Routes>
    <Route path="/" element={<section>...</section>} />
    <Route path="/posts/:postId" element={<SinglePostPage />} />
```

It's good to be aware that the syntax is different, and that we are using v5 syntax for now which is inside the switch statement.

## Authentication

Provide the Heroku keys:

```txt
CLIENT_ORIGIN = the react app url.
CLIENT_ORIGIN_DEV = the gitpod url.
```

Install axios with npm:

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

"As a user I can sign in to the app so that I can access functionality for logged in users"

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

The Avatar component takes some props which is destructures and provides a default height.

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

- the "children" prop will tell the InfiniteScroll component which child components we want it to render.  
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

The user story: "As a logged in user I can add comments to a post so that I can share my thoughts about the post"

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

## The Comment Component Dropdown Menu

In this section a MoreDropdown menu is added to edit or delete a users own comments.  It needs the following:

- check if the currently logged in user is the owner of a comment similarly to this in the Post.js file
- decrement the post’s comments_count
- filter out the deleted comment from the comments array from our state

The id and the setPost and setComments state setter hooks are passed into the Comment component as props.

```js
const [post, setPost] = useState({ results: [] });
...
const [comments, setComments] = useState({ results: [] });
  ...
  <Comment
    key={comment.id}
    {...comment}
    setPost={setPost}
    setComments={setComments}
  />
```

Back in the Comment.js file, the delete function looks like this:

```js
  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/comments/${id}/`);
      // update the post results array with a new comments count
      setPost((prevPost) => ({
        results: [
          {
            ...prevPost.results[0],
            comments_count: prevPost.results[0].comments_count - 1,
          },
        ],
      }));
      /* Remove the comment that matches the id in the filter function which
      loops over the previous comments result array.  
      If the id is for the comment we want to remove,
      the filter method will not return it into the updated results array. */
      setComments((prevComments) => ({
        ...prevComments,
        results: prevComments.results.filter((comment) => comment.id !== id),
      }));
    } catch (err) {
      console.log('err', err);
    }
  };
  ```

## The Edit Comment Form

User story which is "As an owner of a comment I can edit my comment so that I can fix or update my existing comment"

The form should contain:

- An interactive Comments Icon
- A Comments Edit Form

The [code is here for the step](https://github.com/mr-fibonacci/moments/tree/8a8de7e0dcb980ed05a4af95770b65744cf810b1) to create a CommentEditForm.js and update the Comment.js code.  Also check my commit for this section to see the changes.

## The infinite scroll for comment components challenge

Similar to the infinite Scroll on the PostsPage we can reuse the InfiniteScroll component for the comments.  You can see the changes required for that in [this commit](https://github.com/timofeysie/moments/commit/834e5dba43ca2eb9d1ca2d23ff21f4ad3faa8f81).

In PostPage.js page we will get the same linting error "do not pass children as props" as before.

The solution code looks like this:

```js
  <InfiniteScroll
    children={comments.results.map((comment) => (
      <Comment
        key={comment.id}
        {...comment}
        setPost={setPost}
        setComments={setComments}
      />
    ))}
    dataLength={comments.results.length}
    loader={<Asset spinner />}
    hasMore={!!comments.next}
    next={() => fetchMoreData(comments, setComments)}
  />
```

The fixed version without the children prop looks like this:

```js
  <InfiniteScroll
    dataLength={comments.results.length}
    loader={<Asset spinner />}
    hasMore={!!comments.next}
    next={() => fetchMoreData(comments, setComments)}
  >
    {comments.results.map((comment) => (
      <Comment
        key={comment.id}
        {...comment}
        setPost={setPost}
        setComments={setComments}
      />
    ))}
  </InfiniteScroll>
```

The [code for the solution is here](https://github.com/mr-fibonacci/moments/tree/87f14298a88c18d820bc190f263bac11c8ab5704).

## The PopularProfiles Component

In this section we fetch the usernames and display a loading spinner while data from the API is loading.  

- create a profiles folder in the src/pages/profiles
- add PopularProfiles.js file

The component is started using the 'rafce' code snippet from the ES7Snippets plugin.  If you have installed the React snippets extension in VSCode, then you start typing 'ra' into a file with a .js extension and a auto-complete menu comes up where you can select rafce from and it creates the following snippet:

```js
import React from 'react'

const PopularProfiles = () => {
  return (
    <div>PopularProfiles</div>
  )
}

export default PopularProfiles
```

Notice how it creates the function named after the file.  Pretty neat, huh?

We’ll need both sets of profile data stored in the same state so that they are kept in sync.

The useEffect hook with the handleMount async function has a try-catch block to make a request to the profiles endpoint in the  descending order of how many followers they have so the most followed profile will be at the top.

The previous state is spread which will eventually include the pageProfile data as well as our popularProfiles.

With more and more code, it becomes more and more important to include comments so that when other developers look at the code, they don't have to know the whole story about how the app was created and how a particular function fits into that.  The useEffect hook in React can be particularly mysterious as you need to know about it's dependencies to know when it is run.

```js
  /**
   * We’ll need both sets of profile data stored in the same state so that they are kept in sync.
   * When the component mounts we make a request to the profiles endpoint in descending order of
   * how many followers a user has so the most followed profile will be at the top.
   * The previous state is spread which will eventually include the pageProfile data as well as our popularProfiles.  
   */
  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get(
          "/profiles/?ordering=-followers_count"
        );
        setProfileData((prevState) => ({
          ...prevState,
          popularProfiles: data,
        }));
      } catch (err) {
        console.log(err);
      }
    };

    handleMount();
  }, [currentUser]);
```

### The mobile view

Here we reuse the component for mobile view and use it in two places, one for mobile and one for desktop.

Initially, the component looked like this:

```js
    <Container className={appStyles.Content}>
      {popularProfiles.results.length ? (
        <>
          <p>Most followed profiles.</p>
          {popularProfiles.results.map((profile) => (
            <p key={profile.id}>{profile.owner}</p>
          ))}
        </>
      ) : (
        <Asset spinner />
      )}
    </Container>
```

Now, the mobile boolean flag is passed in as a prop and used like this in the container.  Display the 4 most popular profiles using the array slice method.  On desktop display all the profiles.

```js
// eslint-disable-next-line react/prop-types
const PopularProfiles = ({ mobile }) => {
  ...
  return (
    <Container
      className={`${appStyles.Content} ${
        mobile && "d-lg-none text-center mb-3"
      }`}
    >
      {popularProfiles.results.length ? (
        <>
          <p>Most followed profiles.</p>
          {mobile ? (
            <div className="d-flex justify-content-around">
              {popularProfiles.results.slice(0, 4).map((profile) => (
                <p key={profile.id}>{profile.owner}</p>
              ))}
            </div>
          ) : (
            popularProfiles.results.map((profile) => (
              <p key={profile.id}>{profile.owner}</p>
            ))
          )}
        </>
      ) : (
        <Asset spinner />
      )}
    </Container>
  );
};
```

The classes here are some Bootstrap css to hide the component on large screens and up and align the text

- d-lg-none
- text-center
- mb-3

Documentation for these kind of styles can be found [here](https://getbootstrap.com/docs/4.0/utilities/display/): *the classes are named using the format*:

```txt
.d-{value} for xs
.d-{breakpoint}-{value} for sm, md, lg, and xl.
```

The Bootstrap flex class ensure the profiles are displayed next to one another.  

- d-flex
- justify-content-around

The Bootstrap flex class [docs](https://getbootstrap.com/docs/4.0/utilities/flex/) say: *Apply display utilities to create a flexbox container and transform direct children elements into flex items. Flex containers and items are able to be modified further with additional flex properties.*

[Flexbox](https://www.w3schools.com/css/css3_flexbox.asp) is a super easy 2d layout system for CSS that in a lot of ways made Bootstrap layout classes unnecessary.  Before flexbox, it was a lot more difficult to position stuff where we wanted it.  We had to use hacky things like ```float: right```.  It's probably a better idea to use flexbox directly and learn about it instead of hiding knowledge of it behind Bootstrap.  One of the downsides of this advanced tutorial is that it doesn't cover the styles much, and just gives the student large CSS files to account for that.  It's a tradeoff because there is a huge amount of work that goes into a full stack application like the moments front and back end.  So I suppose you have to choose your battles.

The source code for the final step in this section is [here](https://github.com/mr-fibonacci/moments/tree/6451719798c33231c79a9ee11d63355abc8ed679) created with the git commit message "20b PopularProfiles part2".

### The Profile Component

User story: As a user, I can view basic profile information like profile picture and the name so that I can easily check a user's profile page.

This code:

```js
<p key={profile.id}>{profile.owner}</p>
```

Will be replaced with this:

```js
<Profile key={profile.id} profile={profile} />
```

This will help encapsulate all the logic and styles that will be used for a better looking profile list.

The [Single Responsibility Principal (SRP)](https://www.syncfusion.com/blogs/post/solid-principles-in-javascript.aspx) from the SOLID best practices explains why.

These best practices I think started off for Object Oriented languages like Java, however, the SRP one is very useful in my work, as it keeps the complexity of components down and leads to more composable pages.

The S in SOLID says *There should never be more than one reason for a class to change. In other words, every class should have only one responsibility.*

I've always been a bit confused at where to draw the line of responsibility stops.  Especially in React which combines styles, layout and code all into a tight ball.  However, it's helpful to think in terms of the functionality, and we can clearly see here that a profile component, even in a list, has enough in it to benefit from encapsulating all of that in one file.

This all the JSX that is rendered now to replace that one ```<p>``` tag from above:

```js
  return (
    <div className={`my-3 d-flex align-items-center ${mobile && "flex-column"}`} >
      <div>
        <Link className="align-self-center" to={`/profiles/${id}`}>
          <Avatar src={image} height={imageSize} />
        </Link>
      </div>
      <div className={`mx-2 ${styles.WordBreak}`}>
        <strong>{owner}</strong>
      </div>
      <div className={`text-right ${!mobile && "ml-auto"}`}>
        {!mobile &&
          currentUser &&
          !is_owner &&
          (following_id ? (
            <Button
              className={`${btnStyles.Button} ${btnStyles.BlackOutline}`}
              onClick={() => {}}
            >
              unfollow
            </Button>
          ) : (
            <Button
              className={`${btnStyles.Button} ${btnStyles.Black}`}
              onClick={() => {}}
            >
              follow
            </Button>
          ))}
      </div>
    </div>
  );
```

The unfollow button will have classNames of btnStyles.Button and btnStyles.BlackOutline.  

If a user is logged in they will see a follow buttons.  Nothing is happening yet.  That comes later.

## Profile data context & building the profile header

Since the app needs to access profile data in several places we move it into a context provider.

Create src/contexts/ProfileDataContext.js.

It contains two objects for profileData and the functions to update it

This copies the stateful logic from PopularProfiles.js.

Use the provider in index.js around the App component and use the provider in the opularProfiles.js

### Building the profile header

User story: As a user I can view other users profiles so that I can see their profile stats and learn more about them.

Create the ProfilePage.module.css

```css
.ProfileImage {
  object-fit: cover;
  height: 120px;
  width: 120px;
  margin: 4px;
}

@media screen and (max-width: 991px) {
  .ProfileImage {
    width: 250px;
    height: 250px;
  }
}
```

Don't just skip over looking at the CSS but look at it and understand what it's doing.  If you don't know, [look it up](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit) so that you do know and learn something.

*The object-fit CSS property sets how the content of a replaced element should be resized to fit its container.*

*The replaced content is sized to maintain its aspect ratio while filling the element's entire content box. If the object's aspect ratio does not match the aspect ratio of its box, then the object will be clipped to fit.*

Create the pages/profiles/ProfilePage.js file.

Add a route in App.js with the path "/profiles/:id"

The starter code shows the structure of the desktop/mobile layouts:

```js
  return (
    <Row>
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <PopularProfiles mobile />
        <Container className={appStyles.Content}>
          {hasLoaded ? (
            <>
              {mainProfile}
              {mainProfilePosts}
            </>
          ) : (
            <Asset spinner />
          )}
        </Container>
      </Col>
      <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
        <PopularProfiles />
      </Col>
    </Row>
  );
```

I want to understand in detail what is going on here.  Bootstrap has a 12 column grid system.

lg={8} takes up 8 columns and has these styles:

- py-2 (padding y axis 2 px)
- p-0 (padding 0?)
- p-lg-2 (padding large 2 px)

What's going on here?  It seems a little contradictory to me.

lg={4} takes up the remaining columns and has these styles:

- d-none (display: none?)
- d-lg-block
- p-0
- p-lg-2

I'm not getting it.  You actually have to know a lot to understand what's going on here.  I can understand why the course glosses over the whole CSS/Bootstrap thing.

Granted I haven't done the whole course.  I have only done the DRF and Moments code walkthroughs.  I can see that CSS is taught earlier on.  But I feel like I want to know what the above does so that I can create my own Bootstrap 4 layouts for this app, as well as provide documentation for other developers working on this project also.

I first started using Bootstrap around 2016, and I believe it was version 3.  Bootstrap 4 was released in 2014, but large websites that used the insanely popular Bootstrap 3 took a long time and provided many jobs for developers like myself to transition them to Bootstrap 4.  Believe me there were breaking changes which made industries.

Later when Flexbox became a thing, you would find articles saying "Bootstrap considered dangerous" and it started losing popularity.  These days if given the choice with a React project I would choose Material UI (MUI), but looking at Bootstrap styles makes me nostalgic for the old days, and I suppose it's not as bad as some make it out to be.  The [Wikipedia page for Flexbox](https://en.wikipedia.org/wiki/CSS_Flexible_Box_Layout) even says *the intensive use of popular JavaScript layout frameworks, such as Bootstrap, inspired CSS flex-box and grid layout specifications. CSS modules included solutions akin to this, like Flexbox and grid. Flexbox is originally based on a similar feature available in XUL, the user interface toolkit from Mozilla, used in Firefox.*

So there you have it, Firefox had it first, then Bootstrap, then CSS.

However, I am having difficulty finding any documentation on what the ```<Row></Row>``` component is and how it's used.  I know it comes from ```import Row from "react-bootstrap/Row"```.

The Bootstrap columns creates a layout of 2 thirds width column for the main page content and a one third column for the popular profiles component.

The two variables hold main profile header and posts belonging to the profile.  I know by the naming that a row can contain 12 columns like a grid or table.  I suppose it's like a ```<div style="display: block"></div>``` but I want to know in more detail, so I go looking.

*Bootstrap includes a responsive, mobile first fluid [grid system](https://getbootstrap.com/docs/3.3/css/) that appropriately scales up to 12 columns as the device or viewport size increases.*

Our package.json says ```"bootstrap": "^4.6.0"``` so we need to make sure we are looking at docs for that version.  The above link is for version 3.3, but it explains the 12 columns system appropriately.  I couldn't find the same blurb in the 4.6 docs.

We also have ```"react-bootstrap": "^1.6.3"``` which provides a React wrapper around the vanilla Bootstrap features.  To find out what version we are actually using depends on that "^" character before the version, which means it should install the latest 1.6 compatible version.  If you look in node_modules\react-bootstrap\package.json you will see the installed version is "version": "1.6.3", even though there [appears to be a 1.6.7 available](https://www.npmjs.com/package/react-bootstrap/v/1.6.7).

Finally I find the [docs for the appropriate version](https://react-bootstrap-v4.netlify.app/layout/grid/): *Bootstrap’s grid system uses a series of containers, rows, and columns to layout and align content. It’s built with flexbox and is fully responsive* so there you have it.  Why not use Flexbox itself?  That would require only learning it once, then you can get rid of the above mess of a bloated layout framework inside another bloated Javascript wrapper for it.  This is how it's actually done, and I recommend to anyone to learn the basics of Flexbox before jumping into the above.

```css
.row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
}

.column {
  display: flex;
  flex-direction: column;
  flex-basis: 100%;
  flex: 1;
}
```

```html
<div class='row'>
  <div class='column'>
    Column One
  </div>
  <div class='column'>
    Column Two
  </div>
</div>
```

However, the responsive stuff makes Bootstrap somewhat worthwhile.

We would need media queries to make different mobile and desktop versions.  But it's not a bad thing to learn those either.  Since I am a developer for a job (I also enjoy it) what I use depends on what job I have.  For one job I use MUI, for another, it's Bootstrap 4.  Next year it will be something different.  Wow, what a digression!

#### Another problem with Bootstrap

Since we have css modules and inline Bootstrap styles, you have to look in two or more places not to work on the styles.

For example this code in the Profile.js:

```js
    <div
      className={`my-3 d-flex align-items-center ${mobile && "flex-column"}`}
    >
```

I want to reduce the margin for the y axis ```my-3``` to ```my-1``` for mobile, but if I just add that to the mobile condition there, it gets overwritten by the first setting.  So my other option then is to remove the margin from the class name here and put it in the CSS module with another media query.  Then I have three places where the styles live, and my code gets more complex and someone later has to figure it all out when we want a new look for the site.

### The effect

The useEffect hook in the profile page is similar to the one that we moved into the profile data context file:

```js
/**
 * Get a profile and a users posts by the route param id, destructure the response and rename it to pageProfile.
 * It contains the user profile and their posts (done in a later section).
 * This uses setProfileData from the useSetProfileData hook.
 * The dependency array to contains the id and setProfileData so it will be rerun if either of these change.*/
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: pageProfile }, { data: profilePosts }] =
          await Promise.all([
            axiosReq.get(`/profiles/${id}/`),
            axiosReq.get(`/posts/?owner__profile=${id}`),
          ]);
        setProfileData((prevState) => ({
          ...prevState,
          pageProfile: { results: [pageProfile] },
        }));
        setProfilePosts(profilePosts);
        setHasLoaded(true);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [id, setProfileData]);
```

A network requests should be in a try-catch block.

## Following Profiles

user story: "As a logged in user I can follow and un-follow other users, so that I can see and remove
posts by specific users in my post feed"

This change means that the followed and following counts in the profile page need to change when a follow or un-follow button is chosen.
Also, the follow and un-follow buttons need to change.

Those changes happen in PopularProfiles and the ProfilePage component

The ProfileDataContext is a good place to put shared user logic such as the handleFollow function.

That means that the context provider has an extra function to export, which is done like this:

```js
<SetProfileDataContext.Provider value={{ setProfileData, handleFollow }}>
```

Then we import that into the ProfilePage.js

```js
const { setProfileData, handleFollow } = useSetProfileData();
```

Grouping similar functionality such as this action handler is a great way to follow the SRP (see the Single Responsibility Principal discussion above).

This function is also added to the Profile.js file.

After this we need to reflect all these changes on the client side.

This is done in the handleFollow function.

```js
  const handleFollow = async (clickedProfile) => {
    try {
      const { data } = await axiosRes.post("/followers/", {
        followed: clickedProfile.id,
      });

      setProfileData((prevState) => ({
        ...prevState,
        pageProfile: {
          results: prevState.pageProfile.results.map((profile) =>
            followHelper(profile, clickedProfile, data.id)
          ),
        },
        popularProfiles: {
          ...prevState.popularProfiles,
          results: prevState.popularProfiles.results.map((profile) =>
            followHelper(profile, clickedProfile, data.id)
          ),
        },
      }));
    } catch (err) {
      console.log(err);
    }
  };
```

Notice the followHelper?  This function is put into the util.js file.  That's because the same function needs to be run in the page object also.

```js
export const followHelper = (profile, clickedProfile, following_id) => {
  return profile.id === clickedProfile.id
    ? // This is the profile I clicked on,
      // update its followers count and set its following id
      {
        ...profile,
        followers_count: profile.followers_count + 1,
        following_id,
      }
    : profile.is_owner
    ? // This is the profile of the logged in user
      // update its following count
      { ...profile, following_count: profile.following_count + 1 }
    : // this is not the profile the user clicked on or the profile
      // the user owns, so just return it unchanged
      profile;
};
```

## The un-follow profiles functionality

Similar to the handleFollow, the handleUnfollow function updates the state of the users in question as well as the buttons.

It uses the ```axiosRes.delete(`/followers/${clickedProfile.following_id}/`);``` instead of the post.

And in the utls.js file, we use a unfollowHelper like the follow helper to decrement the counts.  The code is so similar I would probably have passed a flag in to decide to increment or decrement to avoid duplication, but its fine I suppose if it only does the same thing twice.  If you find yourself using the same code three times, the general rule is to refactor to share the duplicated blpcks.

Use the click handler functions in Profile.js and ProfilePage.js pages.

Also update the placeholders in the PostPage.js to show the popular profiles component with desktop and mobile views.

## Editing the profile

In this section we add a dropdown menu for users to edit their profile and update their username/password.

This includes adding 

MoreDropdown.js add the ProfileEditDropdown component
ProfilePage.js
UsernameForm.js
UserPasswordForm.js
ProfileEditForm.js
Add the routes in App.js:

Tn UsernameForm and UserPasswordForm we check if the profile_id is the same as the id like this:

```js
  useEffect(() => {
    if (currentUser?.profile_id?.toString() === id) {
      setUsername(currentUser.username);
    } else {
      history.push("/");
    }
  }, [currentUser, history, id]);
```

The currentUser is fetched asynchronously on mount so if the user refreshes the page they will be redirected to home because the currentUser is initially null.
It takes a moment for the API response to return logged in.

Also, the profile id is an integer, and the param id is a string, so convert the integer to a string before the equality check.

## Redirecting the user

This section creates a custom hook containing redirection logic which can be shared between multiple components.

If a user is logged in, they shouldn’t be able to access the sign in and sign up pages, but rather be redirected to the home page.

If a user is not logged in, and they try to access the page to create a post, then we should redirect them back to the home page.

If a user had signed in but their refresh token eventually expired, they will be redirected back to the page they were on a moment ago.

If a new user registers and signs in, they’ll first go back to the sign up page but since they are now logged in, they’ll be redirected to the home page.

The action takes place inside a useEffect handleMount function in the hook:

```js
try {
  await axios.post("/dj-rest-auth/token/refresh/");
  // if user is logged in, the code below will run
  if (userAuthStatus === "loggedIn") {
    history.push("/");
  }
} catch (err) {
  // if user is not logged in, the code below will run
  if (userAuthStatus === "loggedOut") {
    history.push("/");
  }
}
```

To use the hook in the SignInForm component, use the hook and change ```history.push("/");``` to ```history.goBack();```:

```js
function SignInForm() {
  const setCurrentUser = useSetCurrentUser();
  useRedirect("loggedIn");
  ...
      try {
      const { data } = await axios.post("/dj-rest-auth/login/", signInData);
      setCurrentUser(data.user);
      history.goBack();
    } catch (err) {
      console.log('error in /dj-rest-auth/login/')
      setErrors(err.response?.data);
    }
```

redirecting any logged out users away from the form to create a post.

The PostCreateForm.js uses the other string for the hook:

```js
useRedirect("loggedOut");
```

Now try to go to the /posts/create URL when logged out and you will get redirected to the home page.

When a new user signs up they are redirected to the signin page.

Once we sign in successfully, we’re sent back, but because we’re already signed in,
we get redirected from the sign up page to the home page.

When a user’s refresh token expires on a failed attempt to like a post on a PostPage they are redirected to the signin page.

After sign they are redirected back to the post and we can finally like it.

## Unit tests

Here we will install the library called Mock Service Worker which uses an API to intercept requests so that we can mock API responses.

```sh
npm install msw --save-dev
```

Create a mocks directly and handlers.js.

Create a src\setupTests.js file to use the handlers.

The ```screen.debug();``` will print out the rendered component to help crafting tests.

## Cleaning up Errors

Clean up our code relating to the following:

- repeated console errors caused by failed token refreshes
- acceptable console errors
- npm warnings

React.StrictMode component in index.js looks like this:

```js
ReactDOM.render(
  <React.StrictMode>
    <Router>
      <CurrentUserProvider>
        <ProfileDataProvider>
          <App />
        </ProfileDataProvider>
      </CurrentUserProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
```

Actually in this project, it was never there, so this is just for the notes.

The tutorial states it is *a tool for highlighting potential problems in an application by running additional checks and warnings on the application.* such as "findDOMNode is deprecated in StrictMode". 

StrictMode is for development purposes only and can be removed for final deployment.  We can leave it commented out for now.

### Unnecessary refresh requests

Install a library to decode JSON Web Tokens to access the timestamp within the response.

```sh
npm install jwt-decode
npm WARN EBADENGINE Unsupported engine {
npm WARN EBADENGINE   package: 'moments@0.1.2',
npm WARN EBADENGINE   required: { node: '16.19.1', npm: '8.19.3' },
npm WARN EBADENGINE   current: { node: 'v16.20.0', npm: '8.19.4' }
npm WARN EBADENGINE }

up to date, audited 2340 packages in 17s

213 packages are looking for funding
  run `npm fund` for details

115 vulnerabilities (1 low, 86 moderate, 18 high, 10 critical)

To address issues that do not require attention, run:
  npm audit fix

To address all issues (including breaking changes), run:
  npm audit fix --force

Run `npm audit` for details.
```

The tutorial from what must be about two years ago has only one critical vulnerability.  Things move quickly in the front end space.

#### Fixing npm vulnerabilities

```shell
$ npm audit fix
npm WARN ERESOLVE overriding peer dependency
...
Severity: critical
Improper Neutralization of Special Elements used in a Command in Shell-quote - https://github.com/advisories/GHSA-g4rg-993r-mgx7
fix available via `npm audit fix`
node_modules/shell-quote

108 vulnerabilities (1 low, 81 moderate, 17 high, 9 critical)

To address issues that do not require attention, run:
  npm audit fix

To address all issues (including breaking changes), run:
  npm audit fix --force
```

That's slightly better.  Since this is a demo app, vulnerabilities are not an issue.  However, using force could break things and them we don't have a demo, so in this case, I will leave them as they are.

### Using the token utilities

We already have the setTokenTimestamp, shouldRefreshToken and removeTokenTimestamp functions in the util.js file.

We use them in the SignInForm to set the timestamp and the CurrentUserContext.js to run the POST only if the token should be refreshed as well as in the catch blocks to remove the token timestamp when the refresh token expires.

Acceptable API errors are:

- three 401s on mount when not logged in
- 401 error when going to sign up/ sign in page
- 400 error when providing incorrect form input such as submitting the sign in form without entering a username
- 401 error when an access token has expired

I actually feel like the frontend should also validate the form inputs and not make a request that it knows it will fail to reduce server calls.

The front end is a great place to validate the forms.  It does however add complexity and spreads the business logic from the frontend to the backend, so there is a trade off to creating more validation and possibly using a library to do this.

## The oval icons

I wanted to use the bootstrap icon as a default image, so I did this:

```js
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
```

However, then I noticed that when you choose an image for a profile, the chosen image when shown in the header with the other default images is a different size, so they are not is a straight row anymore.

I tried to set the size to 27 square which is the size fo the icon, but then the icons become ovals.  Here is the code so far.

The imageSize comes in the Profile props.

```js
const Profile = (props) => {
  const { profile, mobile, imageSize } = props;
  ...
  <Avatar src={image} height={imageSize} />
```

```js
const Avatar = ({ src, height = 27, text }) => {
  ...
  <img
    className={styles.Avatar}
    src={src}
    height={height}
    width="auto"
    alt="avatar"
  />
```

However, the imageSize in the props is all undefined.

For this image, the shape is an oval:

https://res.cloudinary.com/dr3am91m4/image/upload/v1/media/images/Screenshot_2024-02-14_100906_vuavp2

For this image the shape is actually a circle:

image: "https://res.cloudinary.com/dr3am91m4/image/upload/v1/media/images/Screenshot_2024-02-17_101635_eq07ma"

I'm not sure why the size is not there.  Something with the backend or Cloudinary?

My notes from the backend work show this:

```py
    # the default image
    image = models.ImageField(
        upload_to='images/', default='../default_profile_qdjgyp'
    )
```

After the starting the project section in the README there, look at the Create the profile app section for what the official solution is.

I think though that it will experience the same issues as can be seen on the official deployed version.

There appear to be other issues with a broken profile image sometimes also.

Eventually I just set the width and height to 40px for both user icons and the default icon and things look consistent for now.

## A few last things

1. Display a graphic and message to users that find themselves on the “page not found” page using the Asset component.
2. Adjust and organize your imports to minimize the build
3. Remove all the console.logs from the application
4. Replace the application default title in index.html
5. Refetch posts when the currentUser changes
6. Add the heroku deployment commands

### Bootstrap imports

Since the entire react-bootstrap library is imported when you do this:

```js
  import { Navbar, Container, Nav } from "react-bootstrap";
```

Bootstrap documentation recommends importing each component individually:

```js
  import Navbar from "react-bootstrap/Navbar";
  import Container from "react-bootstrap/Container";
  import Nav from "react-bootstrap/Nav";
```

The curly brackets have to be removed otherwise you see this error for example:

Attempted import error: 'Alert' is not exported from 'react-bootstrap/Alert'.

### Remove all the console.logs

This step says:

*we don’t want to be printing data to the console in a completed application.*

Since this whole project is just a demo app, we will be leaving them in and deploying as debugging will continue during the development process.

### Add the Heroku deployment commands

This step has already been done, but they are included in this section.

- add this script in the package.json: ```"heroku-prebuild": "npm install -g serve",```

This step we haven't done, yet the app does deploy when pushed to the master branch.

- create a Procfile with the following: ```web: serve -s build```

The backend needs a Procfile, but I think it's not needed in this project.

## House keeping todo

Here are some things that will make the app better for growing bigger.

- use an enum for strings such as ```useRedirect("loggedIn");``` to avoid typos

## Deploying to Heroku

1. login to Heroku to create an app there.
2. choose on the "new" button and follow the steps to create the app
3. to choose a name and region and then choose "Create app".
4. From the "Deploy" tab, choose on "Github"  in the "Deployment method" section,  
5. enter the name of the repository just created, and choose "Connect".
6. choose "deploy  branch" which will trigger Heroku to start

## Running locally with the new backend

The Django REST Framework backend has this in settings.py:

```py
ALLOWED_HOSTS = ['localhost', 'drf-two.herokuapp.com', 'drf-two-eb17ecbff99f.herokuapp.com']
...
if 'CLIENT_ORIGIN' in os.environ:
    CORS_ALLOWED_ORIGINS = [
        os.environ.get('CLIENT_ORIGIN')
    ]
else:
    CORS_ALLOWED_ORIGIN_REGEXES = [
        r"^https://.*\.gitpod\.io$",
    ]

CORS_ALLOW_CREDENTIALS = True
```

This API works as expected now when deployed.

However, when running the frontend app locally and using this url in src\api\axiosDefaults.js:

```js
axios.defaults.baseURL = "https://drf-two-eb17ecbff99f.herokuapp.com/";
```

We see errors like this:

```txt
https://drf-two-eb17ecbff99f.herokuapp.com/dj-rest-auth/user/
Request Method: GET
Status Code: 401 Unauthorized
```

To allow the frontend app to use the deployed backend app, we need to update the settings.py file as follows.

```py
if 'CLIENT_ORIGIN' in os.environ:
    CORS_ALLOWED_ORIGINS = [
        os.environ.get('CLIENT_ORIGIN')
    ]
else:
    CORS_ALLOWED_ORIGINS = [
        'http://localhost:3000',
        'https://drf-two.herokuapp.com',
        'https://drf-two-eb17ecbff99f.herokuapp.com',
    ]
```

This means that we must always use port 3000 to make this work.

## The broken avatar image

The image tag looks like this:

```html
<img class="Avatar_Avatar__3fNnk" 
  src="https://res.cloudinary.com/dr3am91m4/image/upload/v1/media/../default_profile_qdjgyp" 
  height="40" 
  width="40" 
  alt="avatar">
```

We find this on the backend in the profiles\models.py file:

```py
class Profile(models.Model):
    owner = models.OneToOneField(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    name = models.CharField(max_length=255, blank=True)
    content = models.TextField(blank=True)
    image = models.ImageField(
        upload_to='images/', default='../default_profile_qdjgyp'
    )
```

I think that image needs to be uploaded manually.

## Useful links

- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [About unit testing query methods](https://testing-library.com/docs/queries/about/)

## Original readme

This is the original content from the Code Institute getting started template.

Welcome,

This is the Code Institute student template for React apps on the Codeanywhere IDE. We have preinstalled all of the tools you need to get started. It's perfectly ok to use this template as the basis for your project submissions.  
DO NOT use this template if you are using the Gitpod IDE. Use the following command instead:  
`npx create-react-app . --template git+https://github.com/Code-Institute-Org/cra-template-moments.git --use-npm`

You can safely delete this README.md file, or change it for your own project. Please do read it at least once, though! It contains some important information about Codeanywhere and the extensions we use. Some of this information has been updated since the video content was created. The last update to this file was: **31st August, 2023**

## Codeanywhere Reminders

In Codeanywhere you have superuser security privileges by default. Therefore you do not need to use the `sudo` (superuser do) command in the bash terminal in any of the lessons.

To log into the Heroku tool belt CLI:

1. Log in to your Heroku account and go to *Account Settings* in the menu under your avatar.
2. Scroll down to the *API Key* and click *Reveal*
3. Copy the key
4. In Codeanywhere, from the terminal, run `heroku_config`
5. Paste in your API key when asked

You can now use the `heroku` CLI program - try running `heroku apps` to confirm it works. This API key is unique and private to you so do not share it. If you accidentally make it public then you can create a new one with *Regenerate API Key*.

---

Happy coding!

## Getting Started with Create React App

This is the original README for the scaffolded create React app.

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
