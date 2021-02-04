import React, { useState, useEffect, useContext } from 'react';
import { LoginContext } from './context'
import { HeartFill, Heart, HandThumbsDown } from 'react-bootstrap-icons';
const axios = require('axios')


function LikeButton(props) {
    const LoginStatus = useContext(LoginContext)
    const [likeState, setLikeState] = useState(false)
    const [dislikeState, setDislikeState] = useState(false)

    useEffect(() => {
        setLikeState(props.post.authorLiked)
        setDislikeState(props.post.authorDisliked)
    }, [])

    async function LikeDislike(option) {
        
        axios.defaults.headers.common['Authorization'] = 'token ' + LoginStatus.userToken
        const EndPoint = window.location.origin + `/api/${props.type}/${option}/${props.post.id}/`
        try {
            const response = await axios.get(EndPoint)
            if (option == 'like'){
                if (likeState == false) setDislikeState(false)
                setLikeState(!likeState)
            }
            else {
                if(dislikeState == false) setLikeState(false)
                setDislikeState(!dislikeState)
            }
            console.log(response.data)
            props.edit(response.data)
        } catch {
            return 0
        }
    }

    return <div>
        <Heart fill={likeState?'red':''} className='heart mb-2' onClick={() => LikeDislike('like')} /> {props.post.likeCount}
        <HandThumbsDown fill={dislikeState?'red':''} className='ml-2 heart mb-2' onClick={() => LikeDislike('dislike')} /> {props.post.dislikeCount}
    </div>

}

export default LikeButton;