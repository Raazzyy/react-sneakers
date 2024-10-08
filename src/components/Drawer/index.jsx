import React from 'react';
import AppContext from '../../context';
import Info from "../Info";
import axios from "axios";
import styles from "./Drawer.module.scss"

function Drawer({ onClose, onRemove, items = [], opened}) {
  const { cartItems, setCartItems } = React.useContext(AppContext)
  const  [orderId, setOrderId] = React.useState(null)
  const  [isOrderComplete, setIsOrderComplete] = React.useState(false)
  const  [isLoading, setIsLoading] = React.useState(false)
  const totalPrice = cartItems.reduce((sum, obj) => obj.price + sum,0)

  const onClickOrder = async () => {
    try {
      setIsLoading(true)
      const { data } = await axios.post('https://1fde4466c256dae2.mokky.dev/orders',{
        items: cartItems,
      })
      await axios.patch('https://1fde4466c256dae2.mokky.dev/cart', [])
      setOrderId(data.id)
      setIsOrderComplete(true)
      setCartItems([]);
     
    } catch (error) {
      alert('Ошибка при создание заказа :(')
    }
    setIsLoading(false)
  } 
  return (
    <>
      <div className={`${styles.overlay} ${opened ? styles.overlayVisible : ''}`}>
        <div className={styles.drawer}>
          <h2 onClick={onClose} className="d-flex justify-between mb-30">
            Корзина <img className="cu-p" src="/img/remove.svg" alt="" />
          </h2>

          {items.length > 0 ? (
            <div className="d-flex flex-column flex">
              <div className="items flex">
                {items.map((obj) => (
                  <div key={obj.id} className="cartItem d-flex align-center mb-20">
                    <div
                      style={{ backgroundImage: `url(${obj.imageUrl})` }}
                      className="cartItemImg"
                    ></div>
                    <div className="mr-20 flex">
                      <p className="mb-5">{obj.title}</p>
                      <b>{obj.price} руб.</b>
                    </div>
                    <img
                      onClick={() => onRemove(obj.id)}
                      className="removeBtn"
                      src="/img/remove.svg"
                      alt=""
                    />
                  </div>
                ))}
              </div>
              <div className="cartTotalBlock">
                <ul>
                  <li>
                    <span>Итого:</span>
                    <div></div>
                    <b>{totalPrice} руб. </b>
                  </li>
                  <li>
                    <span>Налог 5%:</span>
                    <div></div>
                    <b>{(totalPrice * 0.05).toFixed(2)} руб. </b>
                  </li>
                </ul>
                <button disabled={isLoading} onClick={onClickOrder} className="greenButton">
                  Оформить заказ <img src="/img/arrow.svg" alt="" />
                </button>
              </div>
            </div>
          ) : (
            <Info 
            title={isOrderComplete ? "Заказ оформлен!" : "Корзина пустая"}
            description={isOrderComplete ? `Ваш заказ №${orderId} скоро будет передан курьерской доставке` : "Добавьте хотя бы одну пару кроссовок, чтобы сделать заказ."}
            image={isOrderComplete ? "/img/order-complete.svg" : "/img/cart-empty.svg"}/>

          )}
        </div>
      </div>
    </>
  );
}

export default Drawer;
