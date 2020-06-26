import React from 'react'

function DropDown(props){
    
    const { title, list } = props


    return (
        <div>
            <label>{title}: </label>
            <select onChange = {(event) => {props.OnChange(event)}}>
                {list.map((item) => <option key={item.value} value={item.value}>{item.value}</option>)}
            </select>
        </div>
    )

}

export default DropDown
