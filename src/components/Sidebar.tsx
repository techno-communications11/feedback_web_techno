"use client";
import React, { useState } from "react";

import Inputbox from "./Inputbox";
import { FaUserAlt } from "react-icons/fa";

interface User {
  applicant_uuid: string;
  first_name: string;
  last_name: string;
  ntid: string;

}

interface SidebarProps {
  onSelectUser: (user: User) => void; // callback to send user to parent
}

function Sidebar({ onSelectUser }: SidebarProps) {
  const [searchValue, setSearchValue] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  React.useEffect(() => {
    // Fetch user data from the API endpoint
    fetch("/api/getusers")
      .then((response) => response.json())
      .then((data) => setUsers(data.data))
      .catch((error) => console.error("Error fetching users:", error));
  }
  , []);
   console.log(users, "users");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  return (
    <div className="p-3 bg-light rounded shadow" style={{ width: "280px" }}>
      {/* Search Input */}
      <div className="mb-3">
        <Inputbox
          type="search"
          value={searchValue}
          onChange={handleChange}
          text="Search"
          name="search"
        />
      </div>

      {/* User List */}
      <div className="list-group">
        {users
          .filter((user) =>
            `${user.first_name} ${user.last_name}`
              .toLowerCase()
              .includes(searchValue.toLowerCase())
          )
          .map((user,index) => (
            <div
              key={index++}
              onClick={() => onSelectUser(user)} // send user to parent
              className="list-group-item list-group-item-action d-flex align-items-center"
            >
              <FaUserAlt className="me-3 text-primary" />
              <span>
                {user.first_name} {user.last_name} {"-"} <span className=" text-primary fw-bold">{(user.ntid)}</span>
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Sidebar;
