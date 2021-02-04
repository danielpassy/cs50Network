import React from 'react';
import { Link } from 'react-router-dom'
import LikeButton from './LikeButton'

function CommentPreview(props) {
    return (
        <div className='UserInfo d-flex position-relative'>
            <Link to={'/users/' + props.post.author.id}>
                <img
                    className="PostAvatar rounded-circle align-self-start m-1 mr-2"
                    width="50"
                    height="50"
                    src={props.post.author.avatar}
                    alt="User Avatar" />
            </Link>
            <div className="media-body mr-2">
                <Link to={'/users/' + props.post.author.id}>
                    <h5
                        className="name">
                        {props.post.author.username}
                    </h5>
                </Link>
                <div className="">
                    <p className='row col-12'>
                        {props.post.content}
                    </p>
                </div>
                <LikeButton
                    post={props.post}
                    type={'post'}
                    edit={false} />
            </div>
        </div>
    )

}

export default CommentPreview;