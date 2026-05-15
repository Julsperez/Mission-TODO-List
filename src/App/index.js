import { AuthProvider } from '../context/AuthContext';
import { TodoProvider } from '../TodoContext';
import { AppContext } from '../App/AppContext';

function App() {
  return (
    <AuthProvider>
      <TodoProvider>
        <AppContext />
      </TodoProvider>
    </AuthProvider>
  );
}

export default App ;
