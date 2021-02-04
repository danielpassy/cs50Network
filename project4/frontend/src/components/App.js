import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import FeedView from './Views/FeedView'
import IndexView from './Views/IndexView'
import ProfileView from './Views/ProfileView'
import PostView from './Views/PostView'
import LoginView from './Views/LoginView'
import NotFoundView from './Views/NotFoundView'
import NavBar from './NavBar'
import { LoginContext } from './context'


class App extends React.Component {

    constructor() {
        super()
        this.state = {
            userID: this.getuserID(),
            userToken: this.getuserToken(),
            userAvatar: this.getuserAvatar(),
        }
        this.getuserID = this.getuserID.bind(this)
        this.getuserToken = this.getuserToken.bind(this)
        this.changeLoggedIn = this.changeLoggedIn.bind(this)
        this.getuserAvatar = this.getuserAvatar.bind(this)
    }

    changeLoggedIn(data) {
        if (sessionStorage.getItem('user')) {
            sessionStorage.removeItem('user')
            sessionStorage.removeItem('userID')
            sessionStorage.removeItem('userAvatar')
            this.setState({ userToken: false, userID: false, userAvatar: false })
        } else {
            sessionStorage.setItem('user', data.token)
            sessionStorage.setItem('userID', data.id)
            sessionStorage.setItem('userAvatar', data.avatar)
            this.setState({ userToken: data.token, userID: data.id, userAvatar: data.avatar })
        }
    }



    // at some point this can be combined into an array.....
    getuserID() {
        if (sessionStorage.getItem('userID')) {
            return sessionStorage.getItem('userID')
        }
        return false
    }

    getuserToken() {
        if (sessionStorage.getItem('user')) {
            return sessionStorage.getItem('user')
        }
        return false
    }
    getuserAvatar() {
        if (sessionStorage.getItem('userAvatar')) {
            return sessionStorage.getItem('userAvatar')
        }
        return false
    }



    render() {

        return (
            <LoginContext.Provider value={{ ...this.state, changeLoggedIn: this.changeLoggedIn }} >
                <div className='BackGround'>
                    <NavBar />
                    <Switch>
                        <Route path="/login" component={LoginView} />
                        <Route path="/feed"
                            render={() => this.getuserToken() ?
                                <FeedView friends={false} key={Math.random()}/> : <Redirect to="/login" />} />
                        <Route path="/index"
                            render={() => this.getuserToken() ?
                                <IndexView friends={true} key={Math.random()}/> : <Redirect to="/login" />} />
                        <Route path="/home"
                            render={() => this.getuserToken() ?
                                <ProfileView key={Math.random()}/> : <Redirect to="/login" />} />
                        <Route path="/users/:userid"
                            render={(props) => this.getuserToken() ?
                                <ProfileView {...props} key={Math.random()}/> : <Redirect to="/login" />} />
                        <Route path="/post/:postid"
                            render={(props) => this.getuserToken() ?
                                <PostView {...props} key={Math.random()}/> : <Redirect to="/login" />} />
                        <Route render={() => this.getuserToken() ?
                            <NotFoundView key={Math.random()}/> : <Redirect to="/login" />} />
                    </Switch>
                </div>
            </LoginContext.Provider>

        )
    }
}

export default App;
