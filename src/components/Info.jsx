import React from "react";
import AppContext from "../context";
import { Link } from "react-router-dom";

const Info = ({ image, title, description }) => {
  const { setCartOpened } = React.useContext(AppContext);
  return (
    <div className="cartEmpty d-flex align-center justify-center flex-column flex">
      <img className="mb-20" width={120} src={image} alt="" />
      <h2>{title}</h2>
      <p className="opacity-6">{description}</p>
      <Link to="/">
        <button onClick={() => setCartOpened(false)} className="greenButton">
          <img src="/img/arrow.svg" alt="" />
          Вернуться назад
        </button>
      </Link>
    </div>
  );
};

export default Info;
