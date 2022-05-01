import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { ChakraProvider } from '@chakra-ui/react';
import DataList from './datalist.jsx';

import { ipcRenderer } from 'electron';

function Complete() {
  const [data, setData] = React.useState([]);

  ipcRenderer.on('rows', (event, rows) => {
    console.log(rows.length);
    setData(rows);
  });

  return (
    <AppContainer>
      <ChakraProvider>
        <h1>tozan - File hash table of duplicates</h1>
        <DataList data={data} />
      </ChakraProvider>
    </AppContainer>
  );
}
function render() {
  ReactDOM.render(<Complete />, document.getElementById('root'));
}

render();
