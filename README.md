![CI logo](https://codeinstitute.s3.amazonaws.com/fullstack/ci_logo_small.png)

Based on the frontend steps for building the moments fullstack app [in this repo](https://github.com/Code-Institute-Solutions/moments).

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

## Original readme

Welcome,

This is the Code Institute student template for React apps on the Codeanywhere IDE. We have preinstalled all of the tools you need to get started. It's perfectly ok to use this template as the basis for your project submissions.  
DO NOT use this template if you are using the Gitpod IDE. Use the following command instead:  
`npx create-react-app . --template git+https://github.com/Code-Institute-Org/cra-template-moments.git --use-npm`

You can safely delete this README.md file, or change it for your own project. Please do read it at least once, though! It contains some important information about Codeanywhere and the extensions we use. Some of this information has been updated since the video content was created. The last update to this file was: **31st August, 2023**

## Codeanywhere Reminders

In Codeanywhere you have superuser security privileges by default. Therefore you do not need to use the `sudo` (superuser do) command in the bash terminal in any of the lessons.

To log into the Heroku toolbelt CLI:

1. Log in to your Heroku account and go to _Account Settings_ in the menu under your avatar.
2. Scroll down to the _API Key_ and click _Reveal_
3. Copy the key
4. In Codeanywhere, from the terminal, run `heroku_config`
5. Paste in your API key when asked

You can now use the `heroku` CLI program - try running `heroku apps` to confirm it works. This API key is unique and private to you so do not share it. If you accidentally make it public then you can create a new one with _Regenerate API Key_.

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
