import '../index.css';
import Navbar from "../component/NavBar/NavBar";
import ProviderContainer from "../features/shared/providers";
import ModalRenderer from '../features/shared/modalRenderer';
import EmotionCacheProvider from "../features/shared/EmotionCacheProvider";

export default function RootLayout({children}: {children: React.ReactNode}) 
{
    return (
        <html lang="zh-Hant">
            <body className="App">
                <EmotionCacheProvider>
                    <ProviderContainer>
                        <Navbar />
                        {children}
                        <ModalRenderer />
                    </ProviderContainer>
                </EmotionCacheProvider>
            </body>
        </html>
    );
}