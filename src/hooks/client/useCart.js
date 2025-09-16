import { useDispatch, useSelector } from 'react-redux'
import { addCartPatch, delCartPatch, updateCartPatch } from "../../services/client/cartServies"
import { updateCartLength } from "../../actions/cart"
import { message } from 'antd'


export function useCart() {
  const dispatch = useDispatch()
  const lengthCart = useSelector((state) => state.cartReducer.lengthCart);

  // Hàm thêm sản phẩm (API + Redux)
  const add = async (productId, quantity, size) => {
    if (!size) {
      message.error("Vui lòng chọn kích cỡ!")
      return
    }
    try {
      const resAddToCart = await addCartPatch(productId, {
        quantity,
        cartId: localStorage.getItem("cartId"),
        size,
      })

      if (resAddToCart.code === 200) {
        const newLength = resAddToCart.totalQuantityProduts
        dispatch(updateCartLength(newLength))
        message.success("Thêm vào giỏ hàng thành công!")
      } else {
        message.error("Thêm vào giỏ hàng thất bại")
      }
    } catch (error) {
      message.error("Có lỗi xảy ra, vui lòng thử lại")
    }
  }

  const update = async (productId, quantity, size) => {
    if (!size) {
      message.error("Vui lòng chọn kích cỡ!")
      return null;
    }

    const resUpdateToCart = await updateCartPatch(productId, {
      quantity: quantity,
      cartId: localStorage.getItem("cartId"),
      size: size,
    });

    if (resUpdateToCart.code === 200) {
      dispatch(updateCartLength(resUpdateToCart.totalQuantityProduts));
      message.success(resUpdateToCart.message);
      return 1;
    } else {
      message.error(resUpdateToCart.message);
      return 0;
    }
  }

  const remove = async (productId, size) => {
    if (!size) {
      message.error("Vui lòng chọn kích cỡ!")
      return null;
    }

    const response = await delCartPatch(productId, {
      cartId: localStorage.getItem("cartId"),
      size: size,
    })
    if (response.code === 200) {
      dispatch(updateCartLength(response.totalQuantityProduts));
      message.success(response.message);
      return 1;
    } else {
      message.error(response.message);
      return 0;
    }
  }

  // productId, {
  //         quantity: quantity,
  //         cartId: localStorage.getItem("cartId"),
  //         size: selectedSize,
  //       }

  // const remove = (id) => dispatch(removeFromCart(id))
  // const update = (id, qty) => dispatch(updateQuantity(id, qty))

  return { lengthCart, add, update, remove }
}
