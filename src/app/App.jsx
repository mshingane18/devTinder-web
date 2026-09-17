import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Body from "./components/Body";
import Login from "./components/Login";
import Profile from "./components/Profile";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";
import Feed from "./components/Feed";
import Connections from "./components/Connections";
import Requests from "./components/Requests";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Chat from "./components/Chat";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      Component: Body,
      children: [
        { path: "/", Component: Feed },
        { path: "/login", Component: Login },
        { path: "/forgot-password", Component: ForgotPassword },
        { path: "/reset-password/:token", Component: ResetPassword },
        { path: "/feed", Component: Feed },
        { path: "/profile", Component: Profile },
        { path: "/connections", Component: Connections },
        { path: "/chat/:connectionId", Component: Chat },
        { path: "/requests", Component: Requests },
      ],
    },
  ]);
  return (
    <>
      <Provider store={appStore}>
        <RouterProvider router={router} />
      </Provider>
    </>
  );
}

export default App;
