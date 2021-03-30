
import { render } from '@testing-library/react';
import React, { Fragment, Component} from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './App.css';
import Navbar from './components/layout/Navbar';
import Users from './components/users/Users';
import User from './components/users/User';
import Search from './components/users/Search';
import Alert from './components/layout/Alert';
import About from './components/pages/About'
import axios from 'axios'


class App extends Component 
{
  state = {
    users: [],
    user: {},
    repos: [],
    loading: false,
    alert:null
  }


/*async componentDidMount ()
 { 
    
    this.setState({ loading:true});
    const res = await axios.get(`https://api.github.com/users?client=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);
    this.setState({ users: res.data, loading:false});
  }*/

 

  //Searching Users
  searchUsers =  async text => {

    this.setState({ loading:true});
    
    const res = await axios.get(`https://api.github.com/search/users?q=${text}&client=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);
    this.setState({ users: res.data.items, loading:false});

  }
  

  //Getting Single Github user
  getUser = async (username) => {

    this.setState({ loading:true});
    
    const res = await axios.get(`https://api.github.com/users/${username}?&client=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);
    this.setState({ user: res.data, loading:false});


  } 

  //get user's repos
  getUserRepos = async (username) => {

    this.setState({ loading:true});    
    const res = await axios.get(`https://api.github.com/users/${username}/repos?per_page=5sort=created:asc&client=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);
    this.setState({ repos: res.data, loading:false});

  } 


//Clearing the users component 
clearUsers = () => this.setState({ users: [], loading:false})

  //Setting alert for searching without any text
setAlert = (msg) => {
    this.setState({alert: {msg:msg}} );
    setTimeout(() => this.setState({ alert:null}), 5000);
  }

  render()
  { 
    return (
      <Router>
      <div className="App">
        <Navbar />
        <div className ="container"> 
          <Alert alert ={this.state.alert} />
          <Switch>
            <Route exact path = '/'render = {props => (
              <Fragment>
                  <Search 
                      searchUsers = {this.searchUsers} 
                      clearUsers = {this.clearUsers}
                      showClear = { this.state.users.length > 0 ? true : false}
                      setAlert = {this.setAlert}/>
                      <Users  loading ={this.state.loading} users = {this.state.users}/>
                      </Fragment>
            ) }/>

            <Route exact path = '/about' component = {About} />
            <Route exact path = '/user/:login' render = {props => (
              <User 
              { ...props }
               getUser = {this.getUser}
               getUserRepos = {this.getUserRepos} 
               user = {this.state.user} 
               repos={this.state.repos}
               loading = {this.state.loading} 
              />
            )} />
          </Switch>
          </div>
      </div>
      
      </Router>
    );
  }
}
 


export default App;
