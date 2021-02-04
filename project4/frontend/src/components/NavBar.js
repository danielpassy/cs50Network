import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom'
import { HouseDoor, App, People, PersonPlus, Search} from 'react-bootstrap-icons';
import { DropdownButton, Dropdown } from 'react-bootstrap'
import { useHistory } from 'react-router-dom';
import { LoginContext } from './context'


function useForceUpdate(){
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => ++value); // update the state to force render
}

function NavBar() {



	// this is a hook, it adds "state" to a functional component
	const [isSearchCollapsed, setSearchCollapse] = useState(true);
	const history = useHistory();
	const LoginStatus = useContext(LoginContext)
	// flip state

    const forceUpdate = useForceUpdate();

	function signOut(){

		LoginStatus.changeLoggedIn()
		// forcing update on both the navbar and all components
		// forceUpdate()
		history.push('/login')
	}


	const handleSearchCollapse = () => {
		setSearchCollapse(!isSearchCollapsed)

	};

  	function redirect(arg){
		history.push(`/${arg}`)
	}


	const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
		<a
		  href=""
		  ref={ref}
		  onClick={e => {
			e.preventDefault();
			onClick(e);
		  }}
		>
		  {/* Render custom icon here */}
		  {children}
		</a>
	  ));

	

	return (
		<nav className="navbar navbar-expand-md navbar-dark bg-dark">
			<Link className="navbar-brand mr-auto" to="/home">
				<HouseDoor />
			</Link>

			{/* <button
				className="navbar-toggler ml-auto"
				type="button"
				data-toggle="collapse"
				data-target="#navbarNav"
				onClick={handleNavCollapse}
			>
				<span className="navbar-toggler-icon"></span>
			</button> */}

			{/* renders the nav bar according to the state */}
			<div className="navbar-expand" id="navbarNav">
				<ul className="navbar-nav ml-auto">
					<li className="nav-item">
						<form 
							className="mx-2 my-auto">
							<input type="text" 
								className={isSearchCollapsed? 'nav-link d-none searchNavBar w-100': "nav-link searchNavBar form-control"} 
								name="search" 
								id="searc" />
							</form>
					</li>
				
					<li className="nav-item">
						<a className="nav-link" onClick={handleSearchCollapse}>
							<Search />
						</a>
					</li>
					<li className="nav-item">
						<Link className="nav-link" to="/index">
							<PersonPlus />
						</Link>
					</li>
					<li className="nav-item">
						<Link className="nav-link" to="/feed">
							<People />
						</Link>
					</li>
					<li className="nav-item">
						<div className="nav-link" to="/Examples">
							<Dropdown>
								<Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
									<App />
								</Dropdown.Toggle>
									{LoginStatus.userToken?
								<Dropdown.Menu>
								<Dropdown.Item eventKey="1" onClick={() => redirect('home')}>My Profile</Dropdown.Item>
								<Dropdown.Item eventKey="2" onClick={ () => redirect('myaccount')}>Edit my account</Dropdown.Item>
								<Dropdown.Item eventKey="3" onClick={() => signOut()}>Sign Out</Dropdown.Item>
								</Dropdown.Menu>
								: 
								<Dropdown.Menu>
								<Dropdown.Item eventKey="1" onClick={() => redirect('Login')}>Login</Dropdown.Item>
								</Dropdown.Menu>
								}
							</Dropdown>
						</div>
					</li>
				</ul>
			</div>
		</nav>
	);

}

export default NavBar;