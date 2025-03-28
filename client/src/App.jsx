import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import About from "./pages/About";
import CreatePost from "./pages/CreatePost";
import UpdatePost from "./pages/UpdatePost";
import NotFound from "./pages/NotFound";
import PostPage from "./pages/PostPage";
import Search from "./pages/Search";

import Header from "./components/Header";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute";
import ScrollToTop from "./components/ScrollToTop";

export default function App() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/about" element={<About />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/search" element={<Search />} />
                <Route path="/post/:postSlug" element={<PostPage />} />
                <Route path="*" element={<NotFound />} />

                <Route element={<PrivateRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                </Route>

                <Route element={<OnlyAdminPrivateRoute />}>
                    <Route path="/create-post" element={<CreatePost />} />
                    <Route
                        path="/update-post/:postId"
                        element={<UpdatePost />}
                    />
                </Route>
            </Routes>
            <Footer />
        </BrowserRouter>
    );
}
