import React, { Component } from 'react';
import axios from 'axios';
import { parseString } from 'xml2js';
import {
  BrowserRouter,
  Route,
  Switch
} from 'react-router-dom';

import './App.css';

import apiKey from './config';

// Components
import Search from './components/Search';
import Nav from './components/Nav';
import Results from './components/Results';
import ErrorPage from './components/ErrorPage';


class App extends Component {
  loading = ['../loading.gif', '../loading.gif', '../loading.gif', '../loading.gif'];
  state = {
    images: [],
    query: "tree"
  };

  getImages = () => {
    this.setState({images: []});
    const url = 'https://www.flickr.com/services/rest/';
    axios.get(`${url}` +
      `?method=flickr.photos.search` +
      `&api_key=${apiKey}` +
      `&text=${this.state.query}` +
      `&per_page=24`)
      .then(response => {
        let images;
        parseString(response.data, (err, parsed) => {
          images = parsed.rsp.photos[0].photo;
        })
        return images;
      })
      .then(photos => {
        const imageURLs = [];
        if (photos) {
          for (let i = 0; i < photos.length; i++) {
            const {
              farm,
              id,
              server,
              secret
            } = photos[i].$;

            const url = `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}.jpg`
            imageURLs.push(url);
          }
          return imageURLs;
        } else {
          return [];
        }
      })
      .then(imageURLs => {
        this.setState({
          images: imageURLs
        })
      })
      .catch(error => {
        console.log('ERROR: ', error);
      })
  }

  setQuery = (query) => {
    this.setState({query});
  }
  


  render() {
    return (
      <BrowserRouter>
        <div className="container">
          <Search handleSubmit={this.setSearchText} />
          <Nav />
          <Switch>
          <Route path="/search/:query"
            render={props => (
            <Results 
              match={props.match}
              images={this.state.images}
              query={this.state.query}
              getImages={this.getImages}
              setQuery={this.setQuery}
            />)}
          />
          <Route path="/" component={ErrorPage} />
          </Switch>
        </div>
      </BrowserRouter>
    )
  }
}

export default App;
