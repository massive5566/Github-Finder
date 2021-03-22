import React, { Component, Fragment } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// Commponents
import Navbar from '../src/components/layout/Navbar';
import Users from '../src/components/users/Users';
import Search from '../src/components/users/Search';
import Alert from './components/layout/Alert';
import axios from 'axios';
import About from './components/pages/About';
import User from './components/users/User';

class App extends Component {
	state = {
		users: [],
		user: {},
		repos: [],
		loading: false,
		alert: null,
	};
	async componentDidMount() {
		this.setState({ loading: true });
		const res = await axios.get(
			`https://api.github.com/users?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
		);
		this.setState({ users: res.data, loading: false });
	}

	// search Users
	searchUsers = async text => {
		this.setState({ loading: true });
		const res = await axios.get(
			`https://api.github.com/search/users?q=${text}&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
		);
		this.setState({ users: res.data.items, loading: false });
		this.setState({ loading: false });
	};

	// Get Single User
	getUser = async username => {
		const res = await axios.get(
			`https://api.github.com/users/${username}?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
		);
		this.setState({ user: res.data, loading: false });
	};

	// Get Single User Repos
	getUserRepos = async username => {
		const res = await axios.get(
			`https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
		);
		this.setState({ repos: res.data, loading: false });
	};

	// clear User state
	clearUsers = () => this.setState({ users: [], loading: false });

	// setAlert
	setAlert = (msg, type) => {
		this.setState({ alert: { msg: msg, type: type } });
		setTimeout(() => this.setState({ alert: null }), 5000);
		this.setState({ loading: false });
	};

	render() {
		const { users, loading, alert, user, repos } = this.state;
		return (
			<Router>
				<div className='App'>
					<Navbar title='Github Finder' icon='fab fa-github' />
					<div className='container'>
						<Alert alert={alert} />
						<Switch>
							<Route
								exact
								path='/'
								render={props => (
									<Fragment>
										<Search
											searchUsers={this.searchUsers}
											clearUsers={this.clearUsers}
											showClear={users.length > 0 ? true : false}
											setAlert={this.setAlert}
										/>
										<Users loading={loading} users={users} />
									</Fragment>
								)}
							/>
							<Route exact path='/about' component={About} />
							<Route
								exact
								path='/user/:login'
								render={props => (
									<User
										{...props}
										getUser={this.getUser}
										getUserRepos={this.getUserRepos}
										repos={repos}
										user={user}
										loading={loading}
									/>
								)}
							/>
						</Switch>
					</div>
				</div>
			</Router>
		);
	}
}

export default App;
