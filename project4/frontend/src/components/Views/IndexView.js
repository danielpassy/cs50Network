import React from 'react';
import NewPost from '../NewPost'
import NewComment from '../NewComment'
import PostPreview from '../PostPreview'
import { LoginContext } from '../context'
import Paginator from '../Paginator'


const axios = require('axios')


class IndexView extends React.Component {
    static contextType = LoginContext

    constructor() {
        super()
        this.state = {
            post: [],
            error: null,
            currentPage:1,
            postCount:null
        }
        this.rerenderComment = this.rerenderComment.bind(this)
        this.rerenderPost = this.rerenderPost.bind(this)
        this.changePostPage = this.changePostPage.bind(this)

    }

    rerenderComment(data, postIndex) {
        // to work with strict mode
        this.setState((oldState) => {
            oldState.post[postIndex].comments.unshift(data)
            return oldState
        })
    }
    rerenderPost(data) {
        // to work with strict mode
        this.setState((oldState) => {
            oldState.post.unshift(data)
            return oldState
        })
    }

    componentDidMount() {
        this.getPost()
    }

    async changePostPage(pageNum) {
        if (pageNum === this.state.currentPage){ return 0 }
        const URL = window.location.origin + `/api/post/?page=${pageNum}`

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
    async getPost() {
        //fetch it using the this.state.friends
        axios.defaults.headers.common['Authorization'] = 'token ' + this.context.userToken

        const response1 = axios.get(`/api/post/`)
        let post
        try {
            post = await response1
        } catch (er) {
            console.error(er)
            this.setState((oldstate) => {
                oldstate.error = er
                return oldstate
            })
        }
        this.setState((oldstate) => {
            oldstate.post = post.data.results
            oldstate.postCount = post.data.count
            return oldstate
        })
    }

    render() {

        let Posts = this.state.post.map((value, index) => {
            return (
                <div className="postPreview col-xl-12" >
                    <PostPreview key={index} post={value} />
                    <NewComment
                        post={value} rerender={(data) => this.rerenderComment(data, index)} />
                </div>
            )
        })
        return (
            <div className="PostWrapWrap container">
                <div className='postWrap row m-3'>
                    <div className="Post col-xl-12 ">
                        <NewPost rerender={this.rerenderPost} />
                    </div>
                </div>

                {Posts}
                <Paginator postCount={this.state.postCount}
                                resultsPerPage={this.state.post.length}
                                changePostPage={this.changePostPage}
                                currentPage={this.state.currentPage}
                            />
            </div>
        )
    }
}

export default IndexView;