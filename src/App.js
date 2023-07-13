import { useState } from 'react';
import './app.scss';
import { Tabs , Tab, Button ,InlineLoading, FormGroup, Dropdown, TextInput, TabList, TabPanels, TabPanel, Table, TableCell, TableBody, TableRow} from '@carbon/react';
import Header from './components/headers';
import Query_param from './components/query_params';
import axios from 'axios';


function App() {
  const req = ['GET','PUT','POST','PATCH','DELETE'];
  const [lnk,setLnk]= useState('');
  const [met,setMet]= useState('GET');
  const [params,setParams]= useState({});
  const [headers,setHeaders]= useState({});
  const [response,setResponse]= useState({'data':{},'headers':{}});
  const [fetchInitiated,setFetchInitiated] = useState(false);
  const paramTransfer=(data)=>{
    const map = new Map();
    data.map((d)=> map.set(d.value1,d.value2));
    setParams(map);
  }
  const headerTransfer = (data)=>{
    const map= new Map();
    data.map((d)=> map.set(d.value1,d.value2));
    setHeaders(map);
  }

  const handleRun=()=>{
    setFetchInitiated(true);
    setResponse({'data':{},'headers':{}});
    
    axios({
      url: lnk,
      method:met,
      params:params,
      headers:headers,
    }).catch(e => e).then(response=>{
      console.log(response);
      setResponse(response);
      setFetchInitiated(false);
    })
    
  }
  function renderHeaderTable(headerTable){
    return(
      <div className='table'>
        <Table >
          <TableBody>
          { 
            Object.entries(headerTable).map((v,k)=>(
              <TableRow>
                <TableCell>{v[0]}</TableCell>
                <TableCell>{v[1]}</TableCell>
              </TableRow> 
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
  return (
    <div>
      <FormGroup className='component-container' >
        <Dropdown items={req} label='dp' id='default' initialSelectedItem={req[0]}  className='dropdown' onChange={(e)=>setMet(e.selectedItem)} />
        <TextInput  id= 'url' placeholder='https://' className='text-input' onChange={(e) => setLnk(e.target.value)}/>
        <Button type='submit' className='button' size='md' onClick={()=>handleRun()}>Run</Button>
      </FormGroup>
      <div className = 'tab-container'>
        <Tabs >
          <TabList>
            <Tab>Query Params</Tab>
            <Tab>Headers</Tab>
            <Tab>JSON</Tab>
          </TabList>
          <TabPanels>
            <TabPanel><Query_param paramTransfer={paramTransfer}/></TabPanel>
            <TabPanel><Header headerTransfer={headerTransfer}/></TabPanel>
            <TabPanel>{met},{lnk}</TabPanel>
          </TabPanels>
        </Tabs>
      </div>
      
        {
          response.status ? (
            <div className='response'>
              <h2>Response</h2>
              <div className='xi'>
              <div className='xo'>Status : {response.status}</div><div className='xo'>Size : {}</div><div className='xo'>Time : {}</div>
              </div>
              <div className='response-block' style={{'padding':'10px'}}>
                <Tabs>
                  <TabList>
                    <Tab>Body</Tab>
                    <Tab>Header</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>JSON editor</TabPanel>
                    <TabPanel >{response.header!=={} ? renderHeaderTable(response.headers):''}</TabPanel>
                  </TabPanels>
                </Tabs> 
              </div>
            </div>
          ):fetchInitiated ? (
            <InlineLoading status="active" iconDescription="Loading" description="Loading data..." className='loading'/>
          ):(
            <div/>
          )
        }
      
    </div>
  );
}

export default App;
