// import { useEffect } from 'react';
// import './App.css';
// import AllRoute from './components/AllRoute';
// import { cartCreateGet, findCartByUserId, updateUserPatch } from './services/client/cartServies';
// import { getCookie } from './helpers/cookie';

// function App() {
//   const tokenUser = getCookie("tokenUser");
//   // khi có user đăng nhập thì thêm user vào cart hiện tại
//   // khi chưa có user đăng nhập thì tạo mới một giỏ hàng
//   useEffect(() => {
//     const cartId = localStorage.getItem("cartId");

//     if (!cartId) {
//       if (tokenUser) {
//         // đã đăng nhập
//         // thì sẽ lấy giỏ hàng của user đưa lên, nếu không thì tạo giỏ hàng mới và thêm user_id vào
//         // Gửi yêu cầu đến backend để tạo giỏ hàng
//         const fetchApi = async () => {
//           try {
//             const response = await findCartByUserId(tokenUser);
//             if (response.code === 200) {
//               localStorage.setItem("cartId", response.cart._id);
//             }
//           } catch (error) {
//             console.error("Lỗi khi tạo giỏ hàng:", error);
//           }
//         };

//         fetchApi();
//       } else {
//         // chưa đăng nhập thì tạo cart mới
//         // Gửi yêu cầu đến backend để tạo giỏ hàng
//         const fetchApi = async () => {
//           try {
//             const resCart = await cartCreateGet();
//             localStorage.setItem("cartId", resCart.cartId);
//           } catch (error) {
//             console.error("Lỗi khi tạo giỏ hàng:", error);
//           }
//         };

//         fetchApi();
//       }
//     } else {
//       // nếu có giỏ hàng và đã đăng nhập thì lấy giõ hàng hiện tại đưa vào
//       if (tokenUser) {
//         const fetchApi = async () => {
//           try {
//             const response = await updateUserPatch({ cartId: cartId}, tokenUser);
//             if (response.code === 200) {
//               localStorage.setItem("cartId", response.cartId);
//             }
//           } catch (error) {
//             console.error("Lỗi khi tạo giỏ hàng:", error);
//           }
//         };

//         fetchApi();
//       }
//     }
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   return (
//     <>
//       <AllRoute />
//     </>
//   );
// }

// export default App;

import { useEffect } from 'react';
import './App.css';
import AllRoute from './components/AllRoute';
import { cartCreateGet, findCartByUserId, updateUserPatch } from './services/client/cartServies';
import { getCookie } from './helpers/cookie';

function App() {
  const tokenUser = getCookie("tokenUser");

  useEffect(() => {
    const initCart = async () => {
      let cartId = localStorage.getItem("cartId");

      // Nếu chưa có cartId hoặc cartId là "null" thì reset về null
      if (!cartId || cartId === "null" || cartId === "undefined") {
        cartId = null;
      }

      try {
        if (!cartId) {
          // Chưa có giỏ hàng trong localStorage
          if (tokenUser) {
            // Đã đăng nhập → thử tìm giỏ hàng theo userId
            const response = await findCartByUserId(tokenUser);
            if (response.code === 200 && response.cart && response.cart._id) {
              localStorage.setItem("cartId", response.cart._id);
              cartId = response.cart._id;
            } else {
              // Không tìm thấy giỏ hàng → tạo mới
              const resCart = await cartCreateGet();
              if (resCart?.cartId) {
                localStorage.setItem("cartId", resCart.cartId);
                cartId = resCart.cartId;
                // Gắn user vào giỏ hàng vừa tạo
                await updateUserPatch({ cartId: resCart.cartId }, tokenUser);
              }
            }
          } else {
            // Chưa đăng nhập → tạo giỏ hàng mới
            const resCart = await cartCreateGet();
            if (resCart?.cartId) {
              localStorage.setItem("cartId", resCart.cartId);
              cartId = resCart.cartId;
            }
          }
        } else {
          // Đã có cartId → nếu đã đăng nhập thì gắn user vào giỏ hàng
          if (tokenUser) {
            await updateUserPatch({ cartId }, tokenUser);
          }
        }
      } catch (error) {
        console.error("Lỗi khi xử lý giỏ hàng:", error);
      }
    };

    initCart();
  }, [tokenUser]);

  return (
    <>
      <AllRoute />
    </>
  );
}

export default App;
