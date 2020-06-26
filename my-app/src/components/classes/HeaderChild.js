import React from 'react'

function HeaderChild(props){
    return (
        <div>
            {/* calling the passed-in function stored in props */}
            <button onClick = {() => props.greetHandler('child')}>Search</button>
        </div>
    )

}

export default HeaderChild