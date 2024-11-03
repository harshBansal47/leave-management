import './App.css';

import AdminLeavePage from './Components/AdminLeavePage';
import CreateLeaveForm from './Components/CreateLeaveForm';
import React from 'react';
import UserLeavePage from './Components/UserLeave';
import logo from './logo.svg';

function App() {
  return (
    <>

   {/* Create a create leave popup form */}


 {/**
  * 
  * Make a Current Leave table with status 
  */}
  <AdminLeavePage/>
{/* <UserLeavePage/> */}

{/* <CreateLeaveForm  onClose={()=>console.log("")} onLeaveCreate={(data)=>(console.log(data))}/> */}

    {/* Make a Leave history table:
    for both approved and rejected
    year
    month
    in each there are  */}
    
    </>
  );
}

export default App;