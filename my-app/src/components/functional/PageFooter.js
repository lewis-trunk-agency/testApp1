import React from 'react'
import MyStyles from '../../MyStyles.css'
import FlexBoxGrid from 'flexboxgrid'

function PageFooter(props){
    const { textLeft, textCentre, textRight } = props

    const style = MyStyles.parentView;

    return (
        <div className = "row center-xs flex-end">
            <h1 className="row center-xs col-xs-2 pageFooter">{textLeft}</h1>
            <h1 className="row center-xs col-xs-2 pageFooter">{textCentre}</h1>
            <h1 className="row center-xs col-xs-2 pageFooter">{textRight}</h1>

            

        </div>

        
    )

}

export default PageFooter