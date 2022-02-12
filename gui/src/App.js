import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Main from './components/main/Main';

function App() {
  return (
    <Router>
      <Routes>
        {/* rutele principale */}
        <Route path='/*' element={<Main/>}></Route>       
      </Routes>
    </Router>
  );
}

export default App;