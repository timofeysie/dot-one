import React from "react";
import styles from "./App.module.css";
import NavBar from "./components/NavBar";
import Container from "react-bootstrap/Container";
import { Route, Switch } from "react-router-dom";
import "./api/axiosDefaults";
import SignUpForm from "./pages/auth/SignUpForm";
import SignInForm from "./pages/auth/SignInForm";
import PostCreateForm from "./pages/posts/PostCreateForm";
import PostPage from "./pages/posts/PostPage";
import AboutPage from "./pages/info/AboutPage";
import PostsPage from "./pages/posts/PostsPage";
import { useCurrentUser } from "./contexts/CurrentUserContext";
import PostEditForm from "./pages/posts/PostEditForm";
import ProfilePage from "./pages/profiles/ProfilePage";
import UsernameForm from "./pages/profiles/UsernameForm";
import UserPasswordForm from "./pages/profiles/UserPasswordForm";
import ProfileEditForm from "./pages/profiles/ProfileEditForm";
import NotFound from "./components/NotFound";
import Questions from "./pages/polls/Questions";
import QuestionForm from "./pages/polls/QuestionForm";
import QuestionPage from "./pages/polls/QuestionPage";

function App() {
  const currentUser = useCurrentUser();
  const profile_id = currentUser?.profile_id || "";

  return (
    <div className={styles.App}>
      <NavBar />

      <Switch>
        <Route
          exact
          path="/about"
          render={() => <AboutPage message="About Page" />}
        />
        <Route
          exact
          path="/"
          render={() => (
            <Container className={styles.Main}>
              <PostsPage message="No results found. Adjust the search keyword." />
            </Container>
          )}
        />

        <Route
          exact
          path="/feed"
          render={() => (
            <Container className={styles.Main}>
              <PostsPage
                message="No results found. Adjust the search keyword or follow a user."
                filter={`owner__followed__owner__profile=${profile_id}&`}
              />
            </Container>
          )}
        />
        <Route
          exact
          path="/liked"
          render={() => (
            <Container className={styles.Main}>
              <PostsPage
                message="No results found. Adjust the search keyword or like a post."
                filter={`likes__owner__profile=${profile_id}&ordering=-likes__created_at&`}
              />
            </Container>
          )}
        />
        <Route
          exact
          path="/signin"
          render={() => (
            <Container className={styles.Main}>
              <SignInForm />{" "}
            </Container>
          )}
        />

        <Route
          exact
          path="/signup"
          render={() => (
            <Container className={styles.Main}>
              <SignUpForm />{" "}
            </Container>
          )}
        />
        <Route
          exact
          path="/posts/create"
          render={() => (
            <Container className={styles.Main}>
              <PostCreateForm />{" "}
            </Container>
          )}
        />

        <Route
          exact
          path="/posts/:id"
          render={() => (
            <Container className={styles.Main}>
              <PostPage />{" "}
            </Container>
          )}
        />

        <Route
          exact
          path="/posts/:id/edit"
          render={() => (
            <Container className={styles.Main}>
              <PostEditForm />{" "}
            </Container>
          )}
        />
        <Route
          exact
          path="/profiles/:id"
          render={() => (
            <Container className={styles.Main}>
              <ProfilePage />{" "}
            </Container>
          )}
        />
        <Route
          exact
          path="/profiles/:id/edit/username"
          render={() => (
            <Container className={styles.Main}>
              <UsernameForm />{" "}
            </Container>
          )}
        />
        <Route
          exact
          path="/profiles/:id/edit/password"
          render={() => (
            <Container className={styles.Main}>
              <UserPasswordForm />{" "}
            </Container>
          )}
        />
        <Route
          exact
          path="/profiles/:id/edit"
          render={() => (
            <Container className={styles.Main}>
              <ProfileEditForm />{" "}
            </Container>
          )}
        />
        <Route
          exact
          path="/questions"
          render={() => (
            <Container className={styles.Main}>
              <Questions />{" "}
            </Container>
          )}
        />
        <Route
          exact
          path="/questions/create"
          render={() => (
            <Container className={styles.Main}>
              <QuestionForm />{" "}
            </Container>
          )}
        />
        <Route
          exact
          path="/questions/:id"
          render={() => (
            <Container className={styles.Main}>
              <QuestionPage />{" "}
            </Container>
          )}
        />
        <Route
          render={() => (
            <Container className={styles.Main}>
              <NotFound />{" "}
            </Container>
          )}
        />
      </Switch>
    </div>
  );
}

export default App;
