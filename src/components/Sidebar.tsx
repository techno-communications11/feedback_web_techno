"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaUserAlt } from "react-icons/fa";
import Inputbox from "./Inputbox";
import { useAuth } from "@/context/AuthContext";
import { Overlay, Popover, Button } from "react-bootstrap";
import "../app/styles/sidebar.css";

interface User {
  form_uuid: string;
  first_name: string;
  last_name: string;
  ntid: string;
  actionName?: string;
}

interface SidebarProps {
  onSelectUser: (user: User) => void;
}

function Sidebar({ onSelectUser }: SidebarProps) {
  const { user } = useAuth();
  const market_id = user?.market_id || 0;

  const [users, setUsers] = useState<User[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [showPopover, setShowPopover] = useState(false);
  const [popoverTarget, setPopoverTarget] = useState<HTMLElement | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch("/api/getusers?market_id=" + market_id)
      .then((res) => res.json())
      .then((data) => setUsers(data.data))
      .catch((err) => console.error("Error fetching users:", err));
  }, [market_id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleUserClick = (user: User, e: React.MouseEvent<HTMLButtonElement>) => {
    setSelectedUser(user);
    setPopoverTarget(e.currentTarget);
    setShowPopover(true); // always open popover
  };

  const handleActionClick = (actionName: string) => {
    if (selectedUser) {
      onSelectUser({ ...selectedUser, actionName });
      setShowPopover(false);
    }
  };

  return (
    <div className="sidebar rounded-3 shadow-sm" ref={ref}>
      {/* Search */}
      <div className="search-container mb-3">
        <Inputbox
          type="search"
          value={searchValue}
          onChange={handleChange}
          text="Search employees"
          name="search"
          aria-label="Search employees"
        />
      </div>

      {/* User List */}
      <div className="list-group user-list">
        { user && users.length > 0 ? (
          users
            .filter((u) =>
              `${u.first_name} ${u.last_name}`.toLowerCase().includes(searchValue.toLowerCase())
            )
            .map((u,index) => (
              <button
                key={index}
                type="button"
                onClick={(e) => handleUserClick(u, e)}
                className="list-group-item list-group-item-action d-flex align-items-center"
              >
                <FaUserAlt className="user-icon me-2 me-md-3 text-primary" />
                <span className="text-truncate">
                  <span className="text-capitalize">{u.first_name} {u.last_name}</span>{" "}
                  - <span className="text-primary fw-bold">{u.ntid}</span>
                </span>
              </button>
            ))
        ) : (
          <p className="text-muted text-center my-3">No users available</p>
        )}
      </div>

      {/* Popover */}
      <Overlay
        show={showPopover}
        target={popoverTarget}
        placement="right"
        container={ref.current}
        rootClose
        onHide={() => setShowPopover(false)}
      >
        <Popover id="popover-basic">
          <Popover.Body className="d-flex flex-column gap-2">
            <Button size="sm" variant="primary" onClick={() => handleActionClick("Evaluation")}>
              Evaluation
            </Button>
            <Button size="sm" variant="secondary" onClick={() => handleActionClick("Writeup")}>
              Writeup
            </Button>
          </Popover.Body>
        </Popover>
      </Overlay>
    </div>
  );
}

export default Sidebar;
