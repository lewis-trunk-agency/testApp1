import React from 'react';
import FlexBoxGridfrom from 'flexboxgrid';

import logo from './logo.svg';
import './App.css';
// import HeaderParent from './components/classes/HeaderParent';
import DropDown from './components/functional/DropDown';
import PageTitle from './components/functional/PageTitle';
import TwitterSearch from './components/classes/TwitterSearch';
import PageFooter from './components/functional/PageFooter';

function App() {
  return (
    <div className="App stretch">

      <PageTitle title = "Twitter Search Test"></PageTitle>
      
      <TwitterSearch></TwitterSearch>
      
      <PageFooter textCentre = "FooterTextCentre" textLeft = "FooterTextLeft" textRight = "FooterTextRight"></PageFooter>
      
    </div>
  );
}

export default App;
