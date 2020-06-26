import React, {Component} from 'react'
import FlexBoxGridfrom from 'flexboxgrid'

import HeaderChild from './HeaderChild'
import Twit from 'twit'
import config from '../../config.js'
import { get } from 'https'
import { promises } from 'fs'
import DropDown from '../functional/DropDown'

class TwitterSearch extends Component{

    constructor (props){
        super(props)

        this.state = {
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
        this.textChange = this.textChange.bind(this);

        this.nameFilterChange = this.nameFilterChange.bind(this);
    }


    componentDidMount(){
    
        //needs to be after the components have mounted so they can update
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

                this.state.allTags =  [{ value : '', display : 'All'}].concat(this.state.allTags)

                this.state.firstNames = result.map(t =>{
                    return {value : t.name.first, display : t.name.first}
                });


                this.state.firstNames = [{value : '', display : 'All'}].concat(this.state.firstNames);

                this.FilterTweets(false);
            }

            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components. 
            
        ).catch((error) => {
            console.error(error);
        })
    }

    FilterTweets(onstart){
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
        if(onstart){
            this.state.fittingTweetNums = fittingNums;
        }
        else{
            this.setState({fittingTweetNums : fittingNums});
        }
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
        this.setState({
            nameFilter : event.target.value
        })

    }

    tagFilterChange = (event) =>{
        this.setState({
            tagFilter : event.target.value
        },() =>{
            this.FilterTweets(false);
        })
    }

    handleImageChange = (event) =>{
        return null;
    }

    //#endregion

    render(){

        return(
            
            <div>
                <div className="row start">
                    
                    <div className="col-xs-7">
                        <div className="box">
                            <form onSubmit = {this.handleSubmit}>
                            {
                                
                                this.state.tweets != null &&
                                <div>
                                    <DropDown title = "First Name" list = {this.state.firstNames} OnChange = {this.nameFilterChange}></DropDown>
                                    <button type = 'submit'>Search</button>

                                    <div>
                                    {
                                        this.state.selectedTweet != null && 
                                        <div>
                                            <h2>Name: {this.state.tweets[this.state.selectedTweet].name.first + ' ' + this.state.tweets[this.state.selectedTweet].name.last}</h2>
                                            <img src = {this.state.tweets[this.state.selectedTweet].picture}></img> 
                                        </div>
                                    }
                                    </div>
                                </div>
                            }
                            </form>
                        </div>
                    </div>

                    {/* displaying the search results */}
                    <div className="col-xs-4">
                        <div className="box">
                        <DropDown title = "Tag" list = {this.state.allTags} OnChange = {this.tagFilterChange}></DropDown>
                        { 
                            this.state.tweets != null && 
                            <div>
                                <h2 className = "header">Tag Users:</h2>
                                <div className = "row center-xs">    
                                    {this.state.fittingTweetNums.map((n) => <h3 className = "col-xs-2" key = {n.value} value={n.value}>{this.state.tweets[n.value].name.first}</h3>)}
                                </div>
                            </div>
                        }
                        </div>
                    </div>
                </div>
                
            </div>
        )
    }
}

export default TwitterSearch