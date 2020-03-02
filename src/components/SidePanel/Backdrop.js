import React from 'react';


const backdrop = (props) => {
    return (
        props.show ? <div 
        className="backdrop"
        onClick={props.clicked}></div> : null);
}

export default backdrop;