"use client";
// import { BrowserRouter } from "react-router-dom";
import { AlertProvider } from "../../Context/AlertContext";
import { BookProvider } from "../../Context/Book/BookContext";
import { ContactProvider } from "../../Context/Book/ContactContext";
import { DefinitionProvider } from "../../Context/Book/DefinitionContext";
import { SelfBookRecordProvider } from "../../Context/Book/SelfBookRecordContext";
import { ModalProvider } from "../../Context/ModalContext";
import { AuthProvider } from "../../Context/User/AuthContext";
import { UserProvider } from "../../Context/User/UserContext";

interface ProviderContainerProps 
{
    children: React.ReactNode;
}

const ProviderContainer = (props: ProviderContainerProps) => 
{
    const { children } = props;
    
    return(
        <AuthProvider>
            <ContactProvider>
                <DefinitionProvider>
                    <SelfBookRecordProvider>
                        <BookProvider>
                            <UserProvider>
                                <AlertProvider>
                                    <ModalProvider>
                                        {children}
                                    </ModalProvider>
                                </AlertProvider>
                            </UserProvider>
                        </BookProvider>
                    </SelfBookRecordProvider>
                </DefinitionProvider>
            </ContactProvider>
        </AuthProvider>
    )
}

export default ProviderContainer;