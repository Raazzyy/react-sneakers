import React from "react";
import AppContext from "../context";
import Card from "../components/Card";

function Favorites() {
  const { favorites, onAddToFavorite } = React.useContext(AppContext)
  return (
    <div className="content p-40">
      <div className="d-flex align-center justify-between mb-40">
        <h1>Мои закладки</h1>
      </div>

      <div className="sneakers">
        {favorites.map((item, index) => (
          <Card
            key={index}
            favorited={true}
            onFavorite={onAddToFavorite}
            {...item}
          />
        ))}
      </div>
    </div>
  );
}

export default Favorites;
