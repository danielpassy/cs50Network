import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom'
import { LoginContext } from './context'
import LikeButton from './LikeButton'
const axios = require('axios')


function Post(props) {
    const [commentOptions, setCommentOptions] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [content, setContent] = useState("");
    const LoginStatus = useContext(LoginContext)


    function toggleOptions() {
        setCommentOptions(!commentOptions)
    }
    function toggleEdit() {
        setContent(props.post.content)
        setEditMode(!editMode)
        setCommentOptions(!commentOptions)
    }
    async function editPost(event) {
        if (event && event.preventDefault) {
            event.preventDefault();
        }
        const URL = window.location.origin + `/api/post/${props.post.id}/`
        const body = {
            "content": content,
            "posts": props.post.id
        }

        axios.defaults.headers.common['Authorization'] = 'token ' + LoginStatus.userToken

        const response = await axios.put(URL, body)

        if (!response.ok) {
            const message = `An error has occured: ${response.status}`;
        }
        setEditMode(false)
        props.editPost(response.data)
    }
    function del() {
        setEditMode(!editMode)
    }

    function keyPress(e) {
        console.log("f")
        if (e.key === "Escape") {
            // write your logic here.
        }
    }

    const isAuthor = (props.post.author.id == LoginStatus.userID)

    const dropDownMenu =
        <div class="dropdown-menu d-block position-relative drop-down-edit-deleted-comment-post">
            <a onClick={toggleEdit} className="dropdown-item">Edit</a>
            <a class="dropdown-item" >Delete</a>
        </div>


    const editWrapper =
        <div className="container">
            <form id='newPost' className='row flex-row'>
                <input type="text"
                    placeholder="what's in your mind?"
                    className=' col-8 col-md-9 col-xl-10 flex-grow-0 textAnswer form-control mr-2'
                    name="answer"
                    form='newPost'
                    id="postanswer"
                    value={content}
                    onChange={(e) => setContent(e.target.value)} />
                <input
                    type="submit"
                    value="Save"
                    className='col-3 col-md-2 col-xl-1 btn btn-light newPostSubmit'
                    onClick={editPost} />
            </form>
        </div>

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
                    {editMode ? editWrapper :
                        <p className='row col-12'>{props.post.content}</p>}

                </div>
                <LikeButton
                    post={props.post}
                    type={'post'}
                    edit={props.editPost} />
            </div>
            <div className='position-absolute timeStamp'>{props.post.create_at}</div>

            {/* the dropdown is indeed complicated */}
            {(isAuthor) ?
                ((commentOptions) ?
                    <p onClick={() => toggleOptions()} className='position-relative edit-deleted-comment-post-moved'>...</p>
                    : <p onClick={() => toggleOptions()} className='position-relative edit-deleted-comment-post'>...</p>)
                : []}

            {(commentOptions && isAuthor ?
                dropDownMenu : [])}
        </div>
    )

}

export default Post;