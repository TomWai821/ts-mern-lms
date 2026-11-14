/*
import { Routes, Route } from "react-router-dom"
import { lazy, Suspense } from "react"

// Another Pages
const MainPage = lazy(() => import("../../app/main-pages/MainPage"));
const LoginPage = lazy(() => import("../../features/auth/LoginPage"));
const RegisterPage = lazy(() => import("../../features/auth/RegisterPage"));
const BookPage = lazy(() => import("../../app/books/page"));
const UserPage = lazy(() => import("../../app/users/UserPage"));
const ViewProfilePage = lazy(() => import("../../features/profile/ViewProfilePage"));
const DefinitionPage = lazy(() => import("../../features/definition/pages/DefinitionPage"));
const SelfLoanRecordPage = lazy(() => import("../../app/self-records/page"));
const ContactPage = lazy(() => import("../../app/contact/page"));

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
*/