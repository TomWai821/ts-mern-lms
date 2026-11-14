import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { AlertProvider } from './Context/AlertContext';
import { ModalProvider } from './Context/ModalContext';
import { UserProvider } from './Context/User/UserContext';
import { BookProvider } from './Context/Book/BookContext';
import { DefinitionProvider } from './Context/Book/DefinitionContext';
import { ContactProvider } from './Context/Book/ContactContext';
import { AuthProvider } from './Context/User/AuthContext';
import { SelfBookRecordProvider } from './Context/Book/SelfBookRecordContext';
import { RecommendBookProvider } from './Context/Book/RecommendBookContext';

const root = ReactDOM.createRoot
(
    document.getElementById('root') as HTMLElement
);

root.render
(
    <AuthProvider>
        <ContactProvider>
            <DefinitionProvider>
                <SelfBookRecordProvider>
                    <RecommendBookProvider>
                        <BookProvider>
                            <UserProvider>
                                <AlertProvider>
                                    <ModalProvider>
                                        <BrowserRouter>
                                            <App />
                                        </BrowserRouter>
                                    </ModalProvider>
                                </AlertProvider>
                            </UserProvider>
                        </BookProvider>
                    </RecommendBookProvider>
                </SelfBookRecordProvider>
            </DefinitionProvider>
        </ContactProvider>
    </AuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
