import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Body from "./components/Body";
import Login from "./components/Login";
import Profile from "./components/Profile";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";
import Feed from "./components/Feed";
import SignUp from "./components/SignUp";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      Component: Body,
      children: [
        { path: "/signup", Component: SignUp },
        { path: "/login", Component: Login },
        { path: "/feed", Component: Feed },
        { path: "/profile", Component: Profile },
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
