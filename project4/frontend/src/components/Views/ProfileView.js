import React from 'react';
import PostPreview from '../PostPreview'
import AccountID from '../AccountID'
import NewPost from '../NewPost'
import Paginator from '../Paginator'

import { LoginContext } from '../context'


class Profile extends React.Component {

    static contextType = LoginContext

    constructor(props) {
        super(props)
        this.state = {
            user: null,
            post: false,
            mouseOverAvatar: false,
            sameUser: [],
            userData: [],
            rerenderizer: false,
            error: null,
            postCount: null,
            currentPage: 1
        }
        this.isSameuser = this.isSameuser.bind(this)
        this.rerenderPost = this.rerenderPost.bind(this)
        this.changePostPage = this.changePostPage.bind(this)
        this.editProfile = this.editProfile.bind(this)
    }
    static getDerivedStateFromProps(props, state) {

        try {
            if (props.match.params.userid) {
                return {
                    user: props.match.params.userid
                };
            }
        }
        catch (e) {
            return {}
        }
    }
    async componentDidMount() {
        await this.isSameuser()
        Promise.all([this.getUserProfile(), this.getUserPost()])
            .then(([userData, postData]) => {
                console.log(postData)
                this.setState((oldState) => {
                    oldState.userData = userData
                    oldState.post = postData.results
                    oldState.postCount = postData.count
                    return oldState
                })
            })
            .catch((e) => {
                return this.setState({ userData: "unknow error" })
            })
    }
    async getUserProfile() {

        const URL = window.location.origin + `/api/user/${this.state.user}/`
        const response = await fetch(URL, {
            method: 'GET',
            headers: {
                'Authorization': 'token ' + this.context.userToken,
                'Content-Type': 'application/json'
            }
        })

        if (!response.ok) {
            const message = `An error has occured: ${response.status}`;
            console.log(message)
            this.setState((oldState) => { oldState.error = response.text() })
        }


        const data = await response.json()
        return data
    }
    async getUserPost() {

        const URL = window.location.origin + `/api/user/post/${this.state.user}/`

        const response = await fetch(URL, {
            method: 'GET',
            headers: {
                'Authorization': 'token ' + this.context.userToken,
                'Content-Type': 'application/json'
            }
        })

        if (!response.ok) {
            const message = `An error has occured: ${response.status}`;
            console.log(message)
            this.setState({ badrequest: response.text() })
        }

        const data = response.json()

        return data

    }
    async changePostPage(pageNum) {

        if (pageNum === this.state.currentPage){ return 0 }
        const URL = window.location.origin + `/api/user/post/${this.state.user}/?page=${pageNum}`

        const response = await fetch(URL, {
            method: 'GET',
            headers: {
                'Authorization': 'token ' + this.context.userToken,
                'Content-Type': 'application/json'
            }
        })

        if (!response.ok) {
            const message = `An error has occured: ${response.status}`;
            console.log(message)
            return this.setState({ badrequest: response.text() })
        }
        const data = await response.json()

        return this.setState((oldState) => {
            oldState.post = data.results
            oldState.currentPage = pageNum
            return oldState
        })
            
    }

    editProfile(command){
        command = command ? 1 : -1 
        this.setState((oldState) => {
            oldState.userData.num_followers += command
            return oldState
        })
    }

    isSameuser() {
        try {
            if (this.props.match.params.userid == this.context.userID) {
                this.setState((oldState) => {
                    oldState.sameUser = true;
                    return oldState
                })
            } else {
                this.setState((oldState) => {
                    oldState.sameUser = false;
                    return oldState
                })
            }
        } catch {
            this.setState((oldState) => {
                oldState.user = this.context.userID
                oldState.sameUser = true;
                return oldState
            })
        }
        return Promise.resolve(1)

    }
    rerenderPost(data) {
        // to work with strict mode
        this.setState((oldState) => {
            oldState.post.unshift(data)
            return oldState
        })
    }
    render() {
        let Posts = 'hi'
        if (this.state.post) {
            Posts = this.state.post.map((value, index) => {
                return (
                    <div className="postPreview col-6 col-md-4 col-xl-4" >
                        <PostPreview
                            key={index}
                            post={value} />
                    </div>
                )
            })

        }
       return (
            <div>
                <div className="AccountIDWrap container ">
                    {/*  avatar dropdown will be handle on the AccountID component 
                     Follow Unfollow button will be handle also, and not show if onwer*/}
                    <AccountID sameUser={this.state.sameUser}
                        userData={this.state.userData}
                        edit={this.editProfile} />
                </div>
                <div className="container">
                    <div className="row justify-content-center m-3">
                        <div className="col-10">
                            {this.state.sameUser &&
                                <NewPost
                                    rerender={this.rerenderPost}
                                    type={'post'} />}
                        </div>
                    </div>
                </div>
                <div>
                    <div className="postPreviewWrapWrap container">
                        <div className='postPreviewWrap row'>
                            {Posts}
                            <Paginator postCount={this.state.postCount}
                                resultsPerPage={this.state.post.length}
                                changePostPage={this.changePostPage}
                                currentPage={this.state.currentPage}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Profile;