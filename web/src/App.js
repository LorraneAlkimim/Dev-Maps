import React, {useState, useEffect} from 'react';
import api from './services/api';

import './global.css';
import './App.css';
import './Sidebar.css';
import './Main.css';

import DevForm from './components/DevForm';
import DevItem from './components/DevItem';

function App() {
  const [devs, setDevs] = useState([]);


  useEffect(() => {
    async function loadDevs() {
      const response = await api.get('/devs');

      setDevs(response.data);
    }

    loadDevs();
  }, []);


  async function handleAddDev(data) {
    const response = await api.post('/devs', data);
   
      setDevs([...devs, response.data])
  }


  async function deleteDev(_id) {

      await api.delete(`http://localhost:3333/devs:_id?_id=${_id}`);
      setDevs(devs.filter(dev=>dev._id!==_id));
  } 


  return (
    <div id="app">
      <aside>
        <strong>Cadastrar</strong>
        <DevForm onSubmit={handleAddDev}/>
      </aside>

      <main>
        <ul>
          {devs.map( dev => (
              <DevItem key={dev._id} dev={dev} deleteDev={deleteDev} />
            ))}
        </ul>
      </main>
    </div>
  );
}

export default App;
