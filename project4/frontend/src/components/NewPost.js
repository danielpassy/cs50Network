import React, { useState, useContext } from 'react';
import Picker from 'emoji-picker-react';
import { LoginContext } from './context'
const axios = require('axios')

/**
*   This component display an input option for a new comment/Post
*   it requires the following props:
*   type: 'post' or 'comment'
*   rerender: to add the post/comment in the list 
**/

function NewPost(props) {

    const [chosenEmoji, setChosenEmoji] = useState(null);
    const [content, setContent] = useState("");
    const [warnBar, setWarnBarn] = useState(null)
    const [status, setStatus] = useState(null)
    const LoginStatus = useContext(LoginContext)


    const onEmojiClick = (event, emojiObject) => {
        setChosenEmoji(emojiObject);
    };

    async function submitNewPost(event) {
        if (event && event.preventDefault) {
            console.log("hi")
            event.preventDefault();
        }

        const URL = window.location.origin + '/api/post/'
        const body = { "content": content }

        axios.defaults.headers.common['Authorization'] = 'token ' + LoginStatus.userToken

        const response = await axios.post(URL, body)

        if (!response.ok) {
            const message = `An error has occured: ${response.status}`;
            setWarnBarn("alert alert-danger")
            setStatus('error')
        }

        setWarnBarn("alert alert-success")
        setStatus('Your post was created!')
        props.rerender(response.data)
    }

    return (
        <div className="newPost Container flex-row">

            <div className={warnBar ? warnBar : 'd-none'} role="alert">
                {status}
            </div>
            <div className="row flex-row">
                <div className="col-xs-2 p-auto m-auto">
                    <img
                        className="postAvatar rounded-circle align-self-start m-1 mr-2 "
                        width="50"
                        height="50"
                        src={LoginStatus.userAvatar}
                        alt="User Avatar" />
                </div>
                <div className="flex-grow-1 m-auto">
                    <input type="text"
                        placeholder="what's in your mind?"
                        className='flex-grow-0 textAnswer form-control'
                        name="answer"
                        form='Testing'
                        id="postanswer"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onSubmit={alert} />
                </div>
                <form id='newPost'
                    className=' pl-1 m-auto submit-form pt-2 pb-2 pl-2'
                    name="Testing">
                        <input
                            type="button"
                            value="Submit"
                            className='btn btn-light newPostSubmit w-100'
                            onClick={submitNewPost} />
                </form>

                {/* <div className="avatar col-xs-3"></div>
                <div className="TextArea flex-grow-1"></div>
                <div className="Emojis col-xs-3">
                <div>
                    {chosenEmoji ? (
                        <span>You chose: {chosenEmoji.emoji}</span>
                    ) : (
                        <span>No emoji Chosen</span>
                    )}
                    <Picker onEmojiClick={onEmojiClick} />
                    </div>
                </div> */}
                {/* https://www.npmjs.com/package/emoji-picker-react */}

            </div>
        </div>
    )

}

export default NewPost;