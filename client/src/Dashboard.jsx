import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  // Dashboard API call
  const dashboard = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      await axios.get("http://localhost:8000/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✔ No state updates because you don't want to show counts
    } catch (error) {
      console.log("Dashboard fetch error:", error);
    }
  };

  // Run once
  useEffect(() => {
    dashboard();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className="main-content">
        <section className="section">
          <div className="section-header">
            <h1>Dashboard</h1>
          </div>

          <div className="row">

            {/* TEAM LEAD */}
            <div className="col-lg-3 col-md-6 col-sm-6 col-12">
              <div className="card card-statistic-1">
                <div className="card-icon bg-primary">
                  <i className="far fa-user" />
                </div>
                <div className="card-wrap">
                  <div className="card-header">
                    <h4>Team Lead</h4>
                  </div>
                  <div className="card-body"></div>
                </div>
              </div>
            </div>

            {/* VERIFIED */}
            <div className="col-lg-3 col-md-6 col-sm-6 col-12">
              <div className="card card-statistic-1">
                <div className="card-icon bg-danger">
                  <i className="far fa-user-md" />
                </div>
                <div className="card-wrap">
                  <div className="card-header">
                    <h4>Verified</h4>
                  </div>
                  <div className="card-body"></div>
                </div>
              </div>
            </div>

            {/* TO CHECK */}
            <div className="col-lg-3 col-md-6 col-sm-6 col-12">
              <div className="card card-statistic-1">
                <div className="card-icon bg-warning">
                  <i className="far fa-users" />
                </div>
                <div className="card-wrap">
                  <div className="card-header">
                    <h4>To Check</h4>
                  </div>
                  <div className="card-body"></div>
                </div>
              </div>
            </div>

            {/* SYNCED */}
            <div className="col-lg-3 col-md-6 col-sm-6 col-12">
              <div className="card card-statistic-1">
                <div className="card-icon bg-success">
                  <i className="fas fa-circle" />
                </div>
                <div className="card-wrap">
                  <div className="card-header">
                    <h4>Synced To CRM</h4>
                  </div>
                  <div className="card-body"></div>
                </div>
              </div>
            </div>

          </div>
        </section>
      </div>
    </>
  );
};

export default Dashboard;
