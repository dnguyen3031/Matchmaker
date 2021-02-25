import React from 'react';
import { Button, Row } from "react-bootstrap";
import Collapse from 'react-bootstrap/Collapse';

function FriendBar() {
   const [openFriends, setOpenFriends] = React.useState(true);
   const [openGroups, setOpenGroups] = React.useState(true);
   return <div> 
     <Row>
               <Button block
                  onClick={() => setOpenFriends(!openFriends)}
                  aria-expanded={openFriends}
                  >
                  Friends
                  </Button>
                  <Collapse in={openFriends}>
                  <div>
                     <div>Anim</div>
                     <div>Anim</div>
                     <div>Anim</div>
                     <div>Anim</div>
                     <div>Anim</div>
                     <div>Anim</div>
                     <div>Anim</div>
                  </div>
                  </Collapse>
               </Row>
               <Row>
               <Button block
                  onClick={() => setOpenGroups(!openGroups)}
                  aria-expanded={openGroups}
                  >
                  Groups
                  </Button>
                  <Collapse in={openGroups}>
                  <div>
                     <div>Anim</div>
                     <div>Anim</div>
                     <div>Anim</div>
                     <div>Anim</div>
                     <div>Anim</div>
                     <div>Anim</div>
                     <div>Anim</div>
                  </div>
                  </Collapse>
               </Row>
   </div>;
 }
 
export default FriendBar;