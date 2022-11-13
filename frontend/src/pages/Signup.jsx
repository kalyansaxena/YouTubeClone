import React from "react";
import { useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { signupError, signupStart, signupSuccess } from "../redux/userSlice";
import { auth, googleAuthProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import UploadProfileImage from "../components/UploadProfileImage";
import { axiosInstance } from "../utils/axiosConfig";
import Swal from "sweetalert2";
import Loader from "../components/Loader";

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

const Input = styled.input`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.softHr};
  padding: 10px;
  border-radius: 3px;
  background-color: transparent;
  outline: none;
  color: ${({ theme }) => theme.text};
`;

const SignUpButton = styled.button`
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

const Signup = () => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [img, setImg] = useState(undefined);
  const [imgPerc, setImgPerc] = useState(0);
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.user);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (
      name.length === 0 ||
      email.length === 0 ||
      password.length === 0 ||
      !img
    ) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please provide name, email, password & profile image to signup",
      });
    }
    dispatch(signupStart());
    try {
      const res = await axiosInstance.post("/auth/signup", {
        name,
        email,
        password,
        img: imgUrl,
      });
      dispatch(signupSuccess(res.data.user));
      Swal.fire(
        `Welcome ${res.data?.user.name}`,
        "Sign up Successful!",
        "success"
      );
      navigate(`/`);
    } catch (error) {
      console.log(error);
      dispatch(signupError());
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response.data.error || "Error occured during signup",
      });
    }
  };

  const handleSignUpWithGoogle = () => {
    dispatch(signupStart());
    signInWithPopup(auth, googleAuthProvider)
      .then(async (result) => {
        await axiosInstance
          .post("/auth/google", {
            name: result.user.displayName,
            email: result.user.email,
            img: result.user.photoURL,
          })
          .then((res) => {
            dispatch(signupSuccess(res.data.user));
            Swal.fire(
              `Welcome ${res.data?.user.name}`,
              "Sign up Successful!",
              "success"
            );
          });
      })
      .catch((error) => {
        console.log(error);
        dispatch(signupError());
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            error.response.data.error ||
            "Error occured during SignUpWithGoogle",
        });
      });
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Container>
      <Wrapper>
        <Title>Create your account</Title>
        <Input
          type="text"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />
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
        <UploadProfileImage
          img={img}
          setImg={setImg}
          imgPerc={imgPerc}
          setImgUrl={setImgUrl}
          setImgPerc={setImgPerc}
        />
        <SignUpButton onClick={handleSignup}>Sign up</SignUpButton>
        <span>
          Already have an account?{" "}
          <Link to="/signin" style={{ color: "inherit" }}>
            Signin
          </Link>
        </span>
        <span>OR</span>
        <SignUpButton onClick={handleSignUpWithGoogle}>
          Sign up with Google
        </SignUpButton>
      </Wrapper>
    </Container>
  );
};

export default Signup;
