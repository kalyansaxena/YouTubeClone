import React from "react";
import { useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { loginError, loginStart, loginSuccess } from "../redux/userSlice";
import { auth, googleAuthProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { Link } from "react-router-dom";
import { axiosInstance } from "../utils/axiosConfig";
import Swal from "sweetalert2";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 83vh;
  color: ${({ theme }) => theme.text};
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px 50px;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.softHr};
  border-radius: 5px;
  background-color: ${({ theme }) => theme.sidebarBg};
`;

const Title = styled.h1`
  font-size: 24px;
  margin: 0px;
`;

const SubTitle = styled.h3`
  font-weight: 300;
  margin: 0px;
  font-size: 18px;
`;

const Input = styled.input`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.softHr};
  padding: 10px;
  border-radius: 3px;
  background-color: transparent;
  outline: none;
  color: ${({ theme }) => theme.text};
`;

const SignInButton = styled.button`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.softHr};
  padding: 10px;
  border-radius: 3px;
  background-color: ${({ theme }) => theme.softHr};
  outline: none;
  color: ${({ theme }) => theme.text};
  font-size: 16px;
  cursor: pointer;
`;

const Signin = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const res = await axiosInstance.post("/auth/login", { email, password });
      dispatch(loginSuccess(res.data.user));
      Swal.fire(
        `Welcome ${res.data?.user.name}`,
        "Login Successful!",
        "success"
      );
    } catch (error) {
      console.log(error);
      dispatch(loginError());
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response.data.error ||
          "Error while handling custom authentication",
      });
    }
  };

  const handleSignInWithGoogle = () => {
    dispatch(loginStart());
    signInWithPopup(auth, googleAuthProvider)
      .then(async (result) => {
        await axiosInstance
          .post("/auth/google", {
            name: result.user.displayName,
            email: result.user.email,
            img: result.user.photoURL,
          })
          .then((res) => {
            dispatch(loginSuccess(res.data.user));
            Swal.fire(
              `Welcome ${res.data?.user.name}`,
              "Login Successful!",
              "success"
            );
          });
      })
      .catch((error) => {
        console.log(error);
        dispatch(loginError());
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            error.response.data.error ||
            "Error while handling SignInWithGoogle",
        });
      });
  };

  return (
    <Container>
      <Wrapper>
        <Title>Sign In</Title>
        <SubTitle>to continue to YouTubeClone</SubTitle>
        <Input
          type="text"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <SignInButton onClick={handleLogin}>Sign In</SignInButton>
        <span>
          Don't have an account?{" "}
          <Link to="/signup" style={{ color: "inherit" }}>
            Signup
          </Link>
        </span>
        <span>OR</span>
        <SignInButton onClick={handleSignInWithGoogle}>
          Sign In with Google
        </SignInButton>
      </Wrapper>
    </Container>
  );
};

export default Signin;
