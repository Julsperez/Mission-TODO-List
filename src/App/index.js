import { TodoProvider } from '../TodoContext';
import { AppContext } from '../App/AppContext';

function App() {
  return (
    <TodoProvider>
      <AppContext />
    </TodoProvider>
  );
}

export default App ;
