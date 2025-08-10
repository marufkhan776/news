import '../styles/globals.css';
import { ThemeProvider } from '../contexts/ThemeContext';
import ErrorBoundary from '../components/UI/ErrorBoundary';

function MyApp({ Component, pageProps }) {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default MyApp;