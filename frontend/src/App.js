import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Video from "./pages/Video";
import { darkTheme, lightTheme } from "./utils/Theme";
import { useSelector } from "react-redux";
import Search from "./pages/Search";
import Signup from "./pages/Signup";

const Container = styled.div`
  display: flex;
`;
const Main = styled.div`
  flex: 7;
  background-color: ${({ theme }) => theme.bg};
`;
const Wrapper = styled.div`
  padding: 2rem;
`;

const App = () => {
  const [darkMode, setDarkMode] = useState(true);
  const { loggedInUser } = useSelector((state) => state.user);
  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Container className="App">
        <BrowserRouter>
          <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} />
          <Main>
            <Navbar />
            <Wrapper>
              <Routes>
                <Route path="/">
                  <Route index element={<Home type="random" />} />
                  <Route path="trending" element={<Home type="trending" />} />
                  <Route
                    path="subscriptions"
                    element={
                      loggedInUser ? (
                        <Home type="sub" />
                      ) : (
                        <Navigate to="/signin" />
                      )
                    }
                  />
                  <Route path="search" element={<Search />} />
                  <Route
                    path="signin"
                    element={loggedInUser ? <Navigate to="/" /> : <Signin />}
                  />
                  <Route
                    path="signup"
                    element={loggedInUser ? <Navigate to="/" /> : <Signup />}
                  />
                  <Route path="video">
                    <Route path=":videoId" element={<Video />} />
                  </Route>
                </Route>
              </Routes>
            </Wrapper>
          </Main>
        </BrowserRouter>
      </Container>
    </ThemeProvider>
  );
};

export default App;
