// src/admin/LeadsList.jsx
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { axiosInstance, BASE_URL } from "../Config";

const COUNTRY_NAMES = {
  GH: "Ghana",
  CH: "Switzerland",
  NG: "Nigeria",
  JP: "Japan",
  BD: "Bangladesh",
  IN: "India",
  TW: "Taiwan",
  US: "United States",
  GB: "United Kingdom",
  CA: "Canada",
  AU: "Australia",
  DE: "Germany",
  FR: "France",
  IT: "Italy",
  ES: "Spain",
  BR: "Brazil",
  MX: "Mexico",
  CN: "China",
  KR: "South Korea",
  RU: "Russia",
  SE: "Sweden",
  NO: "Norway",
  DK: "Denmark",
  FI: "Finland",
  NL: "Netherlands",
  BE: "Belgium",
  PL: "Poland",
  MA: "Morocco",
  EG: "Egypt",
  DZ: "Algeria",
  LK: "Sri Lanka",
  UN: "Unknown"
};

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchData();
  }, [filterStatus]);

  const fetchData = async () => {
    try {
      const params = {};
      if (filterStatus !== "all") params.status = filterStatus;

      const response = await axiosInstance.get(`/userlist`, { params });

      if (response.data.success) {
        setUsers(response.data.data || []);
      } else {
        Swal.fire("Error", response.data.message || "Failed to load leads", "error");
      }
    } catch (error) {
      console.error("Error fetching lead list", error);
      Swal.fire("Error", "An error occurred while fetching the lead list", "error");
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Verified" ? "To Check" : "Verified";

    try {
      const response = await axiosInstance.post(`/userstatus`, {
        id,
        status: newStatus,
      });

      if (response.data.success) {
        fetchData();
        toast.success(`Lead status changed to ${newStatus}`);
      } else {
        toast.error(response.data.message || "Failed to change status");
      }
    } catch (error) {
      toast.error("An error occurred while changing lead status");
    }
  };

  const filteredUsers = users;

  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + pageSize);

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} />

      <div id="app">
        <div className="main-content">
          <section className="section">
            <div className="section-header">
              <h1>Processed Leads</h1>

              <div className="ml-auto d-flex gap-2">
                <select
                  className="form-control"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  style={{ width: "150px" }}
                >
                  <option value="all">All Status</option>
                  <option value="Verified">Verified</option>
                  <option value="To Check">To Check</option>
                </select>
              </div>
            </div>

            <div className="section-body">
              <div className="card">
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-bordered table-md">
                      <thead>
                        <tr>
                          <th>Sr_No.</th>
                          <th>Name</th>
                          <th>Predicted Country</th>
                          <th>Confidence Score</th>
                          <th>Status</th>
                          <th>CRM Sync</th>
                        </tr>
                      </thead>

                      <tbody>
                        {currentUsers.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="text-center text-muted py-4">
                              No leads found
                            </td>
                          </tr>
                        ) : (
                          currentUsers.map((user, index) => (
                            <tr key={user._id}>
                              <td>{startIndex + index + 1}</td>
                              <td className="font-weight-bold">{user.name}</td>

                              {/* Country */}
                              <td>
                                <span className="font-weight-bold">{COUNTRY_NAMES[user.country]}</span>
                                <br />
                                <small className="text-muted">({user.country})</small>
                              </td>

                              {/* Probability */}
                              <td style={{ minWidth: "180px" }}>
                                <div className="d-flex align-items-center">
                                  <div className="progress flex-grow-1 mr-2" style={{ height: "8px" }}>
                                    <div
                                      className={`progress-bar ${
                                        user.probability >= 0.6 ? "bg-success" : "bg-warning"
                                      }`}
                                      role="progressbar"
                                      style={{ width: `${user.probability * 100}%` }}
                                    />
                                  </div>
                                  <span className="text-muted small">
                                    {(user.probability * 100).toFixed(1)}%
                                  </span>
                                </div>
                              </td>

                              {/* Status Button */}
                              <td>
                                <button
                                  className={`has-icon btn ${
                                    user.status === "Verified" ? "btn-success" : "btn-warning"
                                  }`}
                                  onClick={() => toggleStatus(user._id, user.status)}
                                >
                                  {user.status === "Verified" ? (
                                    <>
                                      <i className="fas fa-check-circle mr-1"></i> Verified
                                    </>
                                  ) : (
                                    <>
                                      <i className="fas fa-exclamation-circle mr-1"></i> To Check
                                    </>
                                  )}
                                </button>
                              </td>

                              {/* CRM Sync */}
                              <td>
                                <span
                                  className={`badge ${
                                    user.status === "Verified" && user.synced
                                      ? "badge-success"
                                      : "badge-secondary"
                                  }`}
                                >
                                  {user.status === "Verified" && user.synced ? (
                                    <>
                                      <i className="fas fa-check-circle"></i> Synced
                                    </>
                                  ) : (
                                    <>
                                      <i className="fas fa-clock"></i> Pending
                                    </>
                                  )}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pagination */}
                <div className="card-footer text-right">
                  <nav className="d-inline-block">
                    <ul className="pagination mb-0">
                      <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                        <a
                          className="page-link"
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) setCurrentPage(currentPage - 1);
                          }}
                        >
                          <i className="fas fa-chevron-left" />
                        </a>
                      </li>

                      {[...Array(totalPages).keys()].map((page) => (
                        <li key={page} className={`page-item ${currentPage === page + 1 ? "active" : ""}`}>
                          <a
                            className="page-link"
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(page + 1);
                            }}
                          >
                            {page + 1}
                          </a>
                        </li>
                      ))}

                      <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                        <a
                          className="page-link"
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                          }}
                        >
                          <i className="fas fa-chevron-right" />
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>

              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default UsersList;
