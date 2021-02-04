import React, {useState, useContext, useEffect} from 'react';
import { LoginContext } from './context'
import { Link } from 'react-router-dom'


function AccountID(props){

    const LoginStatus = useContext(LoginContext)
    const [dropdown, setDropDown] = useState(false); // integer state
    const [followUnfollow, setFollowUnfollow] = useState(); // integer state
    
    function isEqual(a, b){ return (a==b)? true : false}

    useEffect(() => {
        setFollowUnfollow(props.userData.followers? // Did the API call resolved already?
            props.userData.followers.some( // if yes, is any user in the followers array
                (e) => {
                    return isEqual(e.pk, LoginStatus.userID)} //  equal to the session user?
            )
            : 0); // if the data haven`t resolved, just set to 0
      }, [props]); // if you exclude, it doesn't let u change state
      
    async function followUnfollowFunc() {
        let currentState = followUnfollow // for use in development enviorment
        console.log(`test`)
        // the state occur prior to the request just to make it pretty.
        setFollowUnfollow(!followUnfollow)
        const URL = window.location.origin + `/api/user/follow/${props.userData.id}/`
        const response = await fetch(URL, {
            method: 'GET',
            headers: {
                'Authorization': 'token ' + LoginStatus.userToken,
                'Content-Type': 'application/json'
            }
        })

        if (!response.ok) {
            const message = `An error has occured: ${response.status}`;
            console.log(message)
            // error to do!  
            //this.setState({ badrequest: response.text() })
        }
    }


      // TODO: build dropdown.


    return (
        <div className='row pt-3'>
            <div className="avatar col-xs-10 col-md-4 d-flex justify-content-center">
                <img 
                    src={props.userData.avatar} 
                    className="PostAvatar rounded-circle align-self-start m-1 mr-2"
                    width="100"
                    height="120"
                    alt="User Avatar" />
            </div>
            <div className="profileData col-xs-10 col-md-8 d-flex justify-content-center flex-column container">
                <div className="name"> <h2>{props.userData.username}</h2></div>
                <div className="about"><h5>{props.userData.about}</h5></div>
                <div className="row">
                <Link className="" to="/home">
                    <div className="follower col-md-2 col-5 text-nowrap">{props.userData.num_followers? props.userData.num_followers: 0} Followers </div>
                </Link>
                <Link className="" to="/home">
                    <div className="follower col-md-2 col-5 text-nowrap">{props.userData.num_following? props.userData.num_following: 0} Following</div>
                </Link>
                </div>
                <div className="pt-3 pb-3">
                
                {!props.sameUser &&
                <div className="followUnfollow">
                    <form onClick={followUnfollowFunc}>
                    <input
                            type="button"
                            value={followUnfollow? 'Unfollow': 'Follow'}
                            className='btn btn-success followUnfollow' />
                    </form>
                </div>
                }
                </div>
            </div>
        </div>
    )

}

export default AccountID;