import React, {Component} from 'react'
import HeaderChild from './HeaderChild'
import Twit from 'twit'
import config from '../../config.js'
import { get } from 'https';
import { promises } from 'fs';
import DropDown from '../functional/DropDown';

class HeaderParent extends Component{

    constructor (props){
        super(props)

        this.state = {
            parentName : 'Parent',
            searchWord : '',
            nameFilter: '',
            tagFilter: '',
            tweets: [],
            firstNames : [], //for the drop down list
            allTags : [],
            selectedTweet : null,
            fittingTweetNums : [] //for displaying tweets that fit the category
        }

        //binding the function to the component
        this.GreetParent = this.GreetParent.bind(this);
        this.textChange = this.textChange.bind(this);

        this.tweets = fetch("/tweets.json")
        .then(res => res.json())
        .then(
            (result) => {
                this.state.tweets = result;
                
                //looping through all the tags and adding them to an array
                var tempTags = [];
                
                result.map(t =>{
                    for(let i = 0; i < t.tags.length; i++){
                        if(!tempTags.includes(t.tags[i])){
                            tempTags.push(t.tags[i]);
                            this.state.allTags.push({value: t.tags[i], display: t.tags[i]});
                        }
                    }
                    return{value : t.tags}
                });
                this.setState({
                    allTags : [{ value : '', display : 'All'}].concat(this.state.allTags)
                })

                this.state.firstNames = result.map(t =>{
                    return {value : t.name.first, display : t.name.first}
                });
                this.setState({
                    firstNames : [{value : '', display : 'All'}].concat(this.state.firstNames)
                });

                this.FilterTweets();
            }

            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components. 
            
        ).catch((error) => {
            console.error(error);
        })
        
        this.nameFilterChange = this.nameFilterChange.bind(this);
    }

    FilterTweets(){
        let fittingNums = []; 
        let i = 0;
        var filteredTweet = this.state.tweets.filter((tweet) => {
            i++;
            if(tweet.tags != null){
                for(let j = 0; j < tweet.tags.length; j++){
                    // console.log(tweet.tags);
                    if(tweet.tags[j] === this.state.tagFilter){
                        fittingNums.push({value : i - 1, display: i - 1})
                        return true;
                    }
                }
                return false;
            }
            return false;
        });
        // console.log(fittingNums);
        this.setState({fittingTweetNums : fittingNums});
    }

    SearchWord(){
        
        // var t = new Twit({
        //     consumer_key:config.consumer_key,
        //     consumer_secret:config.consumer_secret,
        //     access_token:config.access_token,
        //     access_token_secret:config.access_token_secret    
        // });

        // var params = {
        //     // q : 'banana since:2011-11-11',
        //     q : this.state.searchWord.toString(),
        //     count : 2
        // };

        // t.get('search/tweets', params, 
        //     function(err, data, response){
        //         console.log(data);
        //     }
        // );
        // window.open('https://api.twitter.com/oauth2/token', "_blank");
        this.setState({
            selectedTweet : null
        })

        let i = 0;
        var filteredTweet = this.state.tweets.filter((tweet) => {
            i++;
            
            //ensures the first letter of the search word is a cap
            let text = this.state.nameFilter.toString();
            if(text[0] != null){
                text = text[0].toUpperCase() + text.slice(1)
                if(tweet.name.first === text){
                    this.setState({selectedTweet : i - 1},
                        ()=>{
                            console.log(this.state.selectedTweet)
                        })
                }
                return tweet.name.first === text;
            }
            else{
                return '';
            }
        });
    }

    GreetParent(greetFrom){
        //console.log(config);
        alert(`Hello ${this.state.parentName} from ${greetFrom}`);
        
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.SearchWord();
        // event.preventDefault() //prevents the standard behaviour of refreshing thepage on form submission
    }

    //#region updating ui
    textChange = (event) =>{
        this.setState({
            searchWord : event.target.value
        })
    }

    nameFilterChange = (event) =>{
        console.log(event.target.value);
        this.setState({
            nameFilter : event.target.value
        })

    }

    tagFilterChange = (event) =>{
        this.setState({
            tagFilter : event.target.value
        },() =>{
            this.FilterTweets();
        })
    }

    handleImageChange = (event) =>{
        return null;
    }

    //#endregion

    componentDidMount(){}

    render(){
        // let dropOptions = this.tweets.map((tweet) =>
        //     <option key={tweet.name.first}>{tweet.name.first}</option>
        // );

        return(
            
            <div>
                <h1>Twitter Search Test</h1>
                <form onSubmit = {this.handleSubmit}>
                
                {
                    this.state.tweets != null &&
                    <div>
                        <div>
                            <DropDown title = "First Name" list = {this.state.firstNames} OnChange = {this.nameFilterChange}></DropDown>
                        </div>
                        
                        <div>
                            <DropDown title = "Tag" list = {this.state.allTags} OnChange = {this.tagFilterChange}></DropDown>
                        </div>

                        
                    </div>
                }
                <button type = 'submit'>Search</button>

                {/* <label>Search for: </label>
                <input 
                    type='text' 
                    value={this.state.searchWord} 
                    onChange={this.textChange}
                /> */}

                {/* <button type = 'submit'>Search</button> */}

                </form>

                {/* displaying the search results */}
                <div>   
                    {
                        this.state.selectedTweet != null && 
                        <div>
                            <h2>Name: {this.state.tweets[this.state.selectedTweet].name.first + ' ' + this.state.tweets[this.state.selectedTweet].name.last}</h2>
                            <img src = {this.state.tweets[this.state.selectedTweet].picture}></img> 
                        </div>
                    }
                </div>

                { 
                    this.state.tweets != null && 
                    <div>
                        <h2>Tag Users:</h2>
                        {this.state.fittingTweetNums.map((n) => <h3 key = {n.value} value={n.value}>{this.state.tweets[n.value].name.first}</h3>)}
                    </div>
                }
                

                {/* <DropDown title = "List 1" list = {["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"]} onChange = {() => {}}></DropDown> */}
                

                {/* {this.state.firstNames.map((fn) => <h3 key={fn.value} value={fn.value}>{fn.display}</h3>)} */}


                {/* passes in a function to be called on click */}
                {/* <HeaderChild greetHandler ={this.GreetParent}></HeaderChild> */}
            </div>
        )
    }
}

export default HeaderParent