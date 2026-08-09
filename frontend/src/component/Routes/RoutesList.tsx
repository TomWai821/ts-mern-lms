import { Routes, Route } from "react-router-dom"
import { lazy, Suspense } from "react"

// Another Pages
const MainPage = lazy(() => import("../Pages/MainPage"));
const LoginPage = lazy(() => import("../Pages/LoginPage"));
const RegisterPage = lazy(() => import("../Pages/RegisterPage"));
const BookPage = lazy(() => import("../Pages/TablePages/BookPage"));
const UserPage = lazy(() => import("../Pages/TablePages/UserPage"));
const ViewProfilePage = lazy(() => import("../Pages/ViewProfilePage"));
const DefinitionPage = lazy(() => import("../Pages/TablePages/DefinitionPage"));
const SelfLoanRecordPage = lazy(() => import("../Pages/TablePages/SelfRecordPage"));
const ContactPage = lazy(() => import("../Pages/TablePages/ContactPage"));

const RouteMap : Record<string, JSX.Element> = 
{
    "/": <MainPage/>,
    "/login": <LoginPage/>,
    "/register": <RegisterPage/>,
    "/profile": <ViewProfilePage/>,
    "/viewBook": <BookPage/>,
    "/viewUser": <UserPage/>,
    "/records": <SelfLoanRecordPage/>,
    "/definition": <DefinitionPage/>,
    "/contact": <ContactPage/>,
}

const RoutesList = () => 
{
    return(
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                {
                    Object.entries(RouteMap).map(([path, element], index) => 
                    (
                        <Route path={path} element={element} key={index}/>
                    ))
                }
            </Routes>
        </Suspense>
    )
    
}

export default RoutesList