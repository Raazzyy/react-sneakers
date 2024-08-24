import React from "react";
import { Route, Routes } from "react-router-dom";
import axios from "axios";
import Header from "./components/Header";
import Drawer from "./components/Drawer";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import AppContext from "./context";
import Orders from "./pages/Orders";

function App() {
  const [items, setItems] = React.useState([]);
  const [cartItems, setCartItems] = React.useState([]);
  const [favorites, setFavorites] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState("");
  const [cartOpened, setCartOpened] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const [cartResponse, favoritesResponse, itemsResponse] =
          await Promise.all([
            axios.get("https://1fde4466c256dae2.mokky.dev/cart"),
            axios.get("https://1fde4466c256dae2.mokky.dev/favorites"),
            axios.get("https://1fde4466c256dae2.mokky.dev/items"),
          ]);

        setIsLoading(false);

        setCartItems(cartResponse.data);
        setFavorites(favoritesResponse.data);
        setItems(itemsResponse.data);
      } catch (error) {
        alert("Error on request data :(");
      }
    }

    fetchData();
  }, []);

  const onAddToCart = async (obj) => {
    try {
      const findItem = cartItems.find(
        (item) => Number(item.parentId) === Number(obj.id)
      );
      if (findItem) {
        setCartItems((prev) =>
          prev.filter((item) => Number(item.parentId) !== Number(obj.id))
        );
        await axios.delete(
          `https://1fde4466c256dae2.mokky.dev/cart/${findItem.id}`
        );
      } else {
        setCartItems((prev) => [...prev, obj]);
        const { data } = await axios.post(
          "https://1fde4466c256dae2.mokky.dev/cart",
          obj
        );
        setCartItems((prev) => prev.map((item) => {
          if (item.parentId === data.parentId) {
            return{
              ...item,
              id: data.id
            }
          }
          return item
        }));
      }
    } catch (error) {
      alert("Error on add to cart");
    }
  };

  const onRemoveItem = (id) => {
    try {
      axios.delete(`https://1fde4466c256dae2.mokky.dev/cart/${id}`);
      setCartItems((prev) =>
        prev.filter((item) => Number(item.id) !== Number(id))
      );
    } catch (error) {
      alert("Error on remove");
    }
  };

  const onAddToFavorite = async (obj) => {
    try {
      if (favorites.find((favObj) => Number(favObj.id) === Number(obj.id))) {
        axios.delete(`https://1fde4466c256dae2.mokky.dev/favorites/${obj.id}`);
        setFavorites((prev) =>
          prev.filter((item) => Number(item.id) !== Number(obj.id))
        );
      } else {
        const { data } = await axios.post(
          "https://1fde4466c256dae2.mokky.dev/favorites",
          obj
        );
        setFavorites((prev) => [...prev, data]);
      }
    } catch (error) {
      alert("не удалось добавить кроссовки");
    }
  };

  const onChangeSearchInput = (e) => {
    setSearchValue(e.target.value);
  };

  const isItemAdded = (id) => {
    return cartItems.some((obj) => Number(obj.parentId) === Number(id));
  };

  return (
    <>
      <AppContext.Provider
        value={{
          items,
          cartItems,
          favorites,
          isItemAdded,
          onAddToFavorite,
          onAddToCart,
          setCartOpened,
          setCartItems,
        }}
      >
        <div className="wrapper">
          <Drawer
            items={cartItems}
            onClose={() => setCartOpened(false)}
            onRemove={onRemoveItem}
            opened={cartOpened}
          />

          <Header onClickCart={() => setCartOpened(true)} />

          <Routes>
            <Route
              path="/"
              element={
                <Home
                  items={items}
                  cartItems={cartItems}
                  searchValue={searchValue}
                  setSearchValue={setSearchValue}
                  onChangeSearchInput={onChangeSearchInput}
                  onAddToFavorite={onAddToFavorite}
                  onAddToCart={onAddToCart}
                  isLoading={isLoading}
                />
              }
            />
            <Route path="favorites" element={<Favorites />} />
            <Route path="orders" element={<Orders />} />
          </Routes>
        </div>
      </AppContext.Provider>
    </>
  );
}

export default App;
