import './App.css';
import MainView from './views/mainView';
import { SnackbarProvider } from 'notistack';

function App() {
  return (
    <div>
      <SnackbarProvider maxSnack={5}>
        <MainView />
      </SnackbarProvider>
    </div>
  );
}

export default App;
