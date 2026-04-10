/* eslint-disable */
import React from "react";
import { useNavigate } from "react-router-dom";

import "./TitleRouter.scss";

const TitleRouter = ({ title, crumbs }) => {
  const navigate = useNavigate();
  return (
    <div data-aos="fade-up" className="title-router">
      <span onClick={() => navigate("/")} className="title__home">
        Trang chu
      </span>
      {(crumbs || []).map((crumb, index) => (
        <React.Fragment key={`${crumb?.label}-${index}`}>
          {" "}
          <span className="title__separator">{">"}</span>{" "}
          <span
            className={crumb?.to ? "title__home" : "title_router"}
            onClick={() => {
              if (crumb?.to) navigate(crumb.to);
            }}
          >
            {crumb?.label}
          </span>
        </React.Fragment>
      ))}
      {!crumbs && (
        <>
          {" "}
          <span className="title__separator">{">"}</span>{" "}
          <span className="title_router">{title}</span>
        </>
      )}
    </div>
  );
};

export default TitleRouter;
