import { useEffect } from 'react';
import './App.css';
import AllRoute from './components/AllRoute';
import { cartCreateGet, findCartByUserId, updateUserPatch } from './services/client/cartServies';
import { getCookie } from './helpers/cookie';

function App() {
  const tokenUser = getCookie("tokenUser");
  // khi có user đăng nhập thì thêm user vào cart hiện tại
  // khi chưa có user đăng nhập thì tạo mới một giỏ hàng
  useEffect(() => {
    const cartId = localStorage.getItem("cartId");

    if (!cartId) {
      if (tokenUser) {
        // đã đăng nhập
        // thì sẽ lấy giỏ hàng của user đưa lên, nếu không thì tạo giỏ hàng mới và thêm user_id vào
        // Gửi yêu cầu đến backend để tạo giỏ hàng
        const fetchApi = async () => {
          try {
            const response = await findCartByUserId(tokenUser);
            if (response.code === 200) {
              localStorage.setItem("cartId", response.cart._id);
            }
          } catch (error) {
            console.error("Lỗi khi tạo giỏ hàng:", error);
          }
        };

        fetchApi();
      } else {
        // chưa đăng nhập thì tạo cart mới
        // Gửi yêu cầu đến backend để tạo giỏ hàng
        const fetchApi = async () => {
          try {
            const resCart = await cartCreateGet();
            localStorage.setItem("cartId", resCart.cartId);
          } catch (error) {
            console.error("Lỗi khi tạo giỏ hàng:", error);
          }
        };

        fetchApi();
      }
    } else {
      // nếu có giỏ hàng và đã đăng nhập thì lấy giõ hàng hiện tại đưa vào
      if (tokenUser) {
        const fetchApi = async () => {
          try {
            const response = await updateUserPatch({ cartId: cartId}, tokenUser);
            if (response.code === 200) {
              localStorage.setItem("cartId", response.cartId);
            }
          } catch (error) {
            console.error("Lỗi khi tạo giỏ hàng:", error);
          }
        };

        fetchApi();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <AllRoute />
    </>
  );
}

export default App;
