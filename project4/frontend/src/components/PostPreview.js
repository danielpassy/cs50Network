import React from 'react';
import PlainCommentPost from './PlainCommentPost'
import { Link } from 'react-router-dom'
const axios = require('axios')

// This component should be wrapped on the PostView
// it also display the first 2comments of each post


class PostPreview extends React.Component {


    constructor(props) {
        super(props)
        this.state = {
            post: false,
            comments: false,
            error: null
        }
        this.editComment = this.editComment.bind(this)
        this.editPost = this.editPost.bind(this)
    }
    // need some hooks to hide unhide part of the post_text

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

    render() {
        const comments = this.props.post.comments.slice(0, 2).map((comments, index) => {
            return (
                <PlainCommentPost
                    post={comments}
                    key={index} />
            )
        });
        return (
            <div className="post m-1 mb-0 ">
                <div className='UserInfo d-flex m-1 position-relative'>
                    <Link to={'/post/' + this.props.post.id}>
                        <PlainCommentPost
                            post={this.props.post} />
                        <div className='position-absolute timeStamp'>{this.props.post.create_at}</div>
                    </Link>
                </div>
                {this.props.post.comments != false ?  <Link to={'/post/' + this.props.post.id}>
                        <div className="commentsWrap">
                            {comments}
                        </div>
                    </Link> : ''}

            </div>
        )
    }
}

export default PostPreview;