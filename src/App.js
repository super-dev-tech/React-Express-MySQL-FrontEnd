import React, { Component } from "react"
import { connect } from "react-redux"
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import "./App.css"

import AddTutorial from "./components/tutorial/add-tutorial.component"
import Tutorial from "./components/tutorial/tutorial.component"
import TutorialsList from "./components/tutorial/tutorials-list.component"

import Login from "./components/auth/login.component"
import Register from "./components/auth/register.component"
import Profile from "./components/auth/profile.component"
import Home from "./components/access/home.component"
import BoardUser from "./components/access/board-user.component"
import BoardModerator from "./components/access/board-moderator.component"
import BoardAdmin from "./components/access/board-admin.component"

import { logout } from "./actions/auth"
import { clearMessage } from "./actions/message"

import { history } from "./helpers/history"

class App extends Component {
	constructor(props) {
		super(props)
		this.logOut = this.logOut.bind(this)

		this.state = {
			showModeratorBoard: false,
			showAdminBoard: false,
			currentUser: undefined,
		}

		history.listen((location) => {
			props.dispatch(clearMessage()) // clear message when changing location
		})
	}

	componentDidMount() {
		const user = this.props.user
		console.log("user", user)

		if (user) {
			this.setState({
				currentUser: user,
				showModeratorBoard: user.roles.includes("ROLE_MODERATOR"),
				showAdminBoard: user.roles.includes("ROLE_ADMIN"),
			})
		}
	}

	logOut() {
		this.props.dispatch(logout())
	}

	render() {
		const { currentUser, showModeratorBoard, showAdminBoard } = this.state

		return (
			<Router history={history}>
				<div>
					<nav className="navbar navbar-expand navbar-dark bg-dark">
						<Link to={"/"} className="navbar-brand">
							Nenad
						</Link>
						<div className="navbar-nav mr-auto">
							<li className="nav-item">
								<Link to={"/tutorials"} className="nav-link">
									Tutorials
								</Link>
							</li>
							<li className="nav-item">
								<Link
									to={"/tutorials/add"}
									className="nav-link"
								>
									Add
								</Link>
							</li>
							<li className="nav-item">
								<Link to={"/home"} className="nav-link">
									Home
								</Link>
							</li>

							{showModeratorBoard && (
								<li className="nav-item">
									<Link to={"/mod"} className="nav-link">
										Moderator Board
									</Link>
								</li>
							)}

							{showAdminBoard && (
								<li className="nav-item">
									<Link to={"/admin"} className="nav-link">
										Admin Board
									</Link>
								</li>
							)}

							{currentUser && (
								<li className="nav-item">
									<Link to={"/user"} className="nav-link">
										User
									</Link>
								</li>
							)}
						</div>

						{currentUser ? (
							<div className="navbar-nav ml-auto">
								<li className="nav-item">
									<Link to={"/profile"} className="nav-link">
										{currentUser.username}
									</Link>
								</li>
								<li className="nav-item">
									<a
										href="/login"
										className="nav-link"
										onClick={this.logOut}
									>
										LogOut
									</a>
								</li>
							</div>
						) : (
							<div className="navbar-nav ml-auto">
								<li className="nav-item">
									<Link to={"/login"} className="nav-link">
										Login
									</Link>
								</li>

								<li className="nav-item">
									<Link to={"/register"} className="nav-link">
										Sign Up
									</Link>
								</li>
							</div>
						)}
					</nav>

					<div className="container mt-3">
						<Switch>
							<Route
								exact
								path={["/", "/home"]}
								component={Home}
							/>
							<Route exact path="/login" component={Login} />
							<Route
								exact
								path="/register"
								component={Register}
							/>
							<Route exact path="/profile" component={Profile} />
							<Route path="/user" component={BoardUser} />
							<Route path="/mod" component={BoardModerator} />
							<Route path="/admin" component={BoardAdmin} />

							<Route
								exact
								path="/tutorials"
								component={TutorialsList}
							/>
							<Route
								exact
								path="/tutorials/add"
								component={AddTutorial}
							/>
							<Route path="/tutorials/:id" component={Tutorial} />
						</Switch>
					</div>
				</div>
			</Router>
		)
	}
}

function mapStateToProps(state) {
	const { user } = state.auth
	return {
		user,
	}
}

export default connect(mapStateToProps)(App)
