import React from 'react'
import MyStyles from '../../MyStyles.css'
import FlexBoxGrid from 'flexboxgrid'

function PageTitle(props){
    
    const { title } = props


    return (
        <div >
            <h1 className="row center-xs center-lg pageTitle">{title}</h1>
        </div>
    )

}

export default PageTitle