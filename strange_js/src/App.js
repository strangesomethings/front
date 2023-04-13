import { Route, Routes } from 'react-router-dom';
import Room from './pages/Room';
import Main from './pages/Main';

// TODO : key를 줘서 주소를 입력해서 다른 화면으로 이동하는것을 막자. 
function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/:id" element={<Room />} />
      {/* <Route path="/room" element={<Room />} /> */}
    </Routes>
  );
}

export default App;
