import React from 'react';
import {FaTrashAlt, FaPencilAlt} from 'react-icons/fa';

import './style.css';

function DevItem({dev, deleteDev}) {

	return (
	   <li className="dev-item">
			<header>
				<div id="dev-content">
					<img src={dev.avatar_url} alt={dev.name}/>
					<div className="user-info">
					  <strong>{dev.name}</strong>
					  <span>{dev.techs.join(', ')}</span>
					</div>
				</div>
				<div className="icons-content">
					<FaTrashAlt className="icons" color= '#8e4dff' onClick={() => {deleteDev(dev._id)}} />
				</div>
			</header>
			<p>{dev.bio}</p>
			<a href={`https://github.com/${dev.github_username}`}>Acessar perfil no Github</a>
		</li>
	);
}

export default DevItem;
