import React from "react";
import axios from "axios";
import Card from "../components/Card";
import Info from "../components/Info";
import AppContext from "../context";

function Orders() {
  // const { onAddToFavorite, onAddToCart } = React.useContext(AppContext);
  const [orders, setOrders] = React.useState([]);
  const [isOrderComplete, setIsOrderComplete] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          "https://1fde4466c256dae2.mokky.dev/orders"
        );
        // console.log(data.map((obj) => obj.items).flat());
        setOrders(data.reduce((prev, obj) => [...prev, ...obj.items], []));
        setIsLoading(false);
      } catch (error) {
        alert("Error on request order");
        console.error(error);
      }
    })();
  }, []);

  return (
    <div className="content p-40">
      <div className="d-flex align-center justify-between mb-40">
        <h1>Мои заказы</h1>
      </div>
      {orders.length > 0 ? (
        <>
          <div className="sneakers">
            {(isLoading ? [...Array(8)] : orders).map((item, index) => (
              <Card key={index} loading={isLoading} {...item} />
            ))}
          </div>
        </>
      ) : (
        <Info
          title={isOrderComplete ? "" : "У вас нет заказов"}
          description={
            isOrderComplete ? `` : "Вы нищеброд?  Оформите хотя бы один заказ."
          }
          image={isOrderComplete ? "" : "/img/sad-ord.svg"}
        />
      )}
    </div>
  );
}

export default Orders;
