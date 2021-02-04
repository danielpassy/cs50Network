import React from 'react';
import NewComment from '../NewComment'
import { LoginContext } from '../context'
import Post from '../Post'
import Comment from '../Comment'
const axios = require('axios')

// This component is used for a single post page.


class PostView extends React.Component {
    static contextType = LoginContext

    constructor(props) {
        super(props)
        this.state = {
            post: false,
            comments: false,
            error: null
        }
        this.createComment = this.createComment.bind(this)
        this.editComment = this.editComment.bind(this)
        this.editPost = this.editPost.bind(this)
    }

    componentDidMount() {
        axios.defaults.headers.common['Authorization'] = 'token ' + this.context.userToken
        this.getPost()
    }

    createComment(data) {
        // to work with strict mode
        this.setState((oldState) => {
            // the array is reversed
            oldState.comments.push(data)
            return oldState
        })
    }

    editComment(index, data) {
        this.setState((oldState) => {
            oldState.comments[index] = data
            return oldState
        })
    }

    editPost(data) {
        this.setState((oldState) => {
            oldState.post = data
            return oldState
        })
    }

    async getPost() {
        //fetch it using the this.state.friends
        const baseURL = window.location.origin
        let post, comments
        const response1 = axios.get(baseURL + `/api/post/${this.props.match.params.postid}`)
        const response2 = axios.get(baseURL + `/api/post/comment/${this.props.match.params.postid}`)
        try {
            [post, comments] = await Promise.all([response1, response2])
        } catch (er) {
            console.error(er)
            this.setState((oldstate) => {
                oldstate.error = `Under Maintenance`
                return oldstate
            })
            return 0
        }
        comments.data = comments.data.reverse()
        this.setState((oldstate) => {
            oldstate.post = post.data
            oldstate.comments = comments.data
            return oldstate
        })
    }

    render() {
        let Comments
        if (this.state.post) {
            Comments = this.state.comments.map((comment, index) => {
                return <Comment
                    post={comment}
                    key={index}
                    editComment={(content) => this.editComment(index, content)} />
            })

            return (
                <div className="PostWrapWrap container mt-3">
                    <div className="post">
                        <Post
                            post={this.state.post}
                            type={'post'}
                            editPost={this.editPost}  />
                        <div className="commentsWrap">
                            {Comments}
                        </div>
                    </div>
                    <NewComment
                        rerender={this.createComment}
                        post={this.state.post} />
                </div>
                
            )
        }
        return (
            <div className="PostWrapWrap container">
                {this.state.error ? this.state.error : `loading`}
            </div>
        )
    }
}

export default PostView;