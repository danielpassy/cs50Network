import React from 'react'
import { Redirect } from 'react-router-dom';
import { LoginContext } from '../context'

class Access extends React.Component {

    static contextType = LoginContext

    constructor() {
        super()
        this.state = {
            username: "",
            password: "",
            password_retype: "",
            email: "",
            badrequest: "",
            login: true,
            redirect: false,
        }
        this.login = this.login.bind(this)
        this.handleForm = this.handleForm.bind(this)
        this.register = this.register.bind(this)
        this.toogleRegister = this.toogleRegister.bind(this)
        this.getUserAvatar = this.getUserAvatar.bind(this)


    }

    toogleRegister(e) {
        e.preventDefault();
        let b = this.state.login
        this.setState(oldState => {
            oldState.login = !b
            return oldState
        })
    }


    handleForm(event) {
        const { name, value } = event.target
        this.setState(oldState => {
            oldState[name] = value
            return oldState
        })
    }

    register(e) {
        e.preventDefault()
        if (this.state.password_retype !== this.state.password) {
            return this.setState({ badrequest: "passwords do not match" })

        }

        const URL = window.location.origin + '/api/register/'
        fetch(URL, {
            method: 'POST',
            headers: {
                'Authorization': 2, // GET THIS RIGHT
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({
                "username": this.state.username,
                "password": this.state.password,
                "password_retype": this.state.password_retype,
                "email": this.state.email
            })
        })
            .then(response => {
                if (!response.ok) {
                    console.log(response)
                    var err = new Error("Incorrect credentials");
                    throw err;
                }
                return response.json()
            })
            .then(data => {
                console.log(this.state)
                this.login(data)
            })

            .catch(e => {
                console.log(e)
                this.setState({ badrequest: e.message })
            })

    }

    async getUserAvatar(arg) {

        const URL = window.location.origin + `/api/user/${arg.id}/`
        const response = await fetch(URL, {
            method: 'GET',
            headers: {
                'Authorization': 'token ' + arg.token,
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json() 
        return data.avatar
    }

    async login(event) {
        if (event && event.preventDefault) {
            event.preventDefault();
        }
        const URL = 'api/api-token-auth/'
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "username": this.state.username,
                "password": this.state.password
            })
        })
        if (!response.ok) {
            return this.setState({ badrequest: response.error })
        }
        let data = await response.json()
        data.avatar = await this.getUserAvatar(data)
        this.context.changeLoggedIn(data)
        this.setState({ redirect: true })
    }


    render() {
        if (this.state.redirect) {
            return <Redirect push to='/home' />
        }

        if (this.state.login) {
            return (
                <div className="container-fluid main body">
                    <div className='form d-flex justify-content-center align-items-center'>
                        <form className="loginForm" action={this.login}>
                            <div className='form-group'>
                                {this.state.badrequest ? <div class="alert alert-danger" role="alert">
                                    {this.state.badrequest}
                                </div> : <div></div>}
                                <label for="username" > Username</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter email"
                                    name="username"
                                    onChange={this.handleForm}
                                    value={this.state.username} />
                                <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                                <br />
                                <label for="password" > Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Enter password"
                                    name="password"
                                    onChange={this.handleForm}
                                    value={this.state.password} />
                                <br />
                                <div className='center-align'><input
                                    type='Submit'
                                    value="Submit"
                                    className='btn btn-primary'
                                    onClick={this.login} ></input>
                                    <hr class="solid" />
                                    <p>Or Create an Account</p>
                                    <button className='btn btn-primary' onClick={this.toogleRegister}>Register</button>

                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )
        }
        else {
            return (
                <div className="container-fluid main body">
                    <div className='form d-flex justify-content-center align-items-center'>
                        <form className="loginForm" action={this.register}>
                            <div className='form-group'>
                                {this.state.badrequest ? <div class="alert alert-danger" role="alert">
                                    {this.state.badrequest}
                                </div> : <div></div>}
                                {this.state.login}
                                <label for="username" > Username</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Username"
                                    name="username"
                                    onChange={this.handleForm}
                                    value={this.state.username} />
                                <label for="password" > Password</label>
                                <input
                                    type="password"
                                    placeholder="Enter password"
                                    className="form-control"
                                    name="password"
                                    onChange={this.handleForm}
                                    value={this.state.password} />
                                <label for="password_retype" > Password</label>
                                <input
                                    type="password"
                                    placeholder="Enter password"
                                    className="form-control"
                                    name="password_retype"
                                    onChange={this.handleForm}
                                    value={this.state.password_retype} />

                                <label for="email" > Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Enter email"
                                    name="email"
                                    onChange={this.handleForm}
                                    value={this.state.email} />
                                <br />
                                <div className='center-align'><input
                                    type='submit'
                                    value="submit"
                                    className='btn btn-primary'
                                    onClick={this.register} ></input>
                                    <hr class="solid" />
                                    <p>Or Log In into you account</p>
                                    <button className='btn btn-primary' onClick={this.toogleRegister}>Log In</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )
        }

    }


}

export default Access