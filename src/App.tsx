import React from 'react';
import logo from './logo.svg';
import './App.css';
import MainView from './views/mainView';

const { ipcRenderer, dialog } = window.require('electron');

function helloWorld() {
  console.log('Fetching JSON')
  fetch('https://s3.eu-west-1.amazonaws.com/directory.spatineo.com/tmp/tuulituhohaukka-stac/catalog/root2.json', { method: 'GET' })
    .then((response) => {
      response.json().then((json: any) => {
        console.log('Saving JSON');
        ipcRenderer.invoke('saveJson', { filename: 'bar.json', data: json }).then((result: any) => {
          console.log('SAVED!', result)
        })
      })
    })
}

const openFileBrowser = async () => {
  const response = await ipcRenderer.invoke('openFileSystem')
  console.log(response)
}


function App() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px' }}>
      <MainView />
    </div>
  );
}

export default App;
