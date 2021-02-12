import React from 'react';
import CustomNavbar from '../../CustomNavbar';

function ProfilePage() {
   return <div>
      <CustomNavbar /> 
   <Table characterData={characters} removeCharacter={removeOneCharacter} />
   <h2>Profile</h2>
   </div>;
 }


function TableHeader() {
  return (
    <thead>
      <tr>
        <th>Name</th>
        <th>Job</th>
      </tr>
    </thead>
  );
}

function TableBody (props) {
  //const rows = props.characterData.map((row, index) => {
   return (
      <tr key={index}>
        <td>{row.name}</td>
        <td>{row.job}</td>
        <td>{row.id}</td>
      <td>
          //<button onClick={() => props.removeCharacter(index)}>Delete</button>
        </td>
      </tr>
    );
  });
  return (
      <tbody>
         {rows}
      </tbody>
   ); 
}

function Table(props) {
   return (
      <table>
      <TableHeader />
      <TableBody characterData={props.characterData} removeCharacter={props.removeCharacter} />
      </table>
   );
}



export default ProfilePage;
