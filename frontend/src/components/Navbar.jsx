import React, { useState } from "react";
import styled from "styled-components";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import VideoCallOutlinedIcon from "@mui/icons-material/VideoCallOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Upload from "./Upload";
import UserMenu from "./UserMenu";

const Container = styled.div`
  position: sticky;
  top: 0;
  background-color: ${({ theme }) => theme.sidebarBg};
  height: 56px;
`;
const Wrapper = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 20px;
  justify-content: flex-end;
  position: relative;
`;
const Search = styled.div`
  position: absolute;
  width: 40%;
  left: 0;
  right: 0;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 3px;
  color: ${({ theme }) => theme.text};
`;
const Input = styled.input`
  border: none;
  outline: none;
  width: 100%;
  background-color: transparent;
  font-weight: 500;
  font-size: 1rem;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.button`
  padding: 5px 15px;
  background-color: transparent;
  border: 1px solid #3ea6ff;
  color: #3ea6ff;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  border-radius: 3px;
  font-weight: 500;
`;

const NavItems = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
`;

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { loggedInUser } = useSelector((state) => state.user);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  return (
    <>
      <Container>
        <Wrapper>
          <Search>
            <Input
              placeholder="Search"
              onChange={(e) => setSearchQuery((prev) => e.target.value)}
            />
            <SearchOutlinedIcon
              onClick={(e) => navigate(`/search?q=${searchQuery}`)}
            ></SearchOutlinedIcon>
          </Search>
          {loggedInUser ? (
            <NavItems>
              <VideoCallOutlinedIcon
                onClick={() => setOpen((prev) => true)}
              ></VideoCallOutlinedIcon>
              <NotificationsOutlinedIcon />
              <UserMenu loggedInUser={loggedInUser} />
            </NavItems>
          ) : (
            <Link
              to="signin"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Button>
                <AccountCircleOutlinedIcon />
                SIGN IN
              </Button>
            </Link>
          )}
        </Wrapper>
      </Container>
      {open && <Upload setOpen={setOpen} />}
    </>
  );
};

export default Navbar;
