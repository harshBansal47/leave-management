import React from 'react';
import logo from './logo.svg';
import './App.css';
import AdminLeavePage from './Components/AdminLeavePage';
import UserLeavePage from './Components/UserLeave';


function App() {
  return (
    <>

   {/* Create a create leave popup form */}


 {/**
  * Make a Current Leave table with status 
  */}
  {/* <AdminLeavePage/> */}
<UserLeavePage/>

    {/* Make a Leave history table:
    for both approved and rejected
    year
    month
    in each there are  */}
    
    </>
  );
}

export default App;