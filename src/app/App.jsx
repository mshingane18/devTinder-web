import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Body from "./components/Body";
import Login from "./components/Login";
import Profile from "./components/Profile";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";
import Feed from "./components/Feed";
import SignUp from "./components/SignUp";
import Connections from "./components/Connections";
import Requests from "./components/Requests";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      Component: Body,
      children: [
        { path: "/", Component: Feed },
        { path: "/login", Component: Login },
        { path: "/feed", Component: Feed },
        { path: "/profile", Component: Profile },
        { path: "/connections", Component: Connections },
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
