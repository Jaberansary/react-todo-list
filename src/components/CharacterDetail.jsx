/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import {ArrowUpCircleIcon} from "@heroicons/react/24/outline";
import Loader from "./Loader.jsx";
import {toast } from "react-hot-toast";
import axios from "axios";
// eslint-disable-next-line react/prop-types
function CharacterDetail({selectedId,onAddFavourite,isAddToFavourite}) {
  const [character,setCharacter] = useState(null);
  const [isLoading,setIsLoading] = useState(false);
  const [episodes,setEpisodes]=useState([]);

  useEffect(()=>{
  async function fetchData(){
    try{
      setIsLoading(true);
      const {data}= await axios.get(`https://rickandmortyapi.com/api/character/${selectedId}`);
      setCharacter(data);
      const episodesId=data.episode.map((e)=>e.split("/").at(-1));
      const{ data: episodeData }= await axios.get(`https://rickandmortyapi.com/api/episode/${episodesId}`);
      setEpisodes([episodeData].flat())
    }
    catch(error){
      toast.error(error.response.data.error);
    }
    finally{
      setIsLoading(false);
    }
  }
  if(selectedId) fetchData();
},[selectedId]);

if (isLoading)
return(
  <div style={{flex:1}}>
    <Loader/>
  </div>
);
if(!character || !selectedId)
return(
  <div style={{flex:1,color:"var(--slate-300)"}}>Please Select a Character.</div>
);

return (
    <div style={{flex:1}}>
     <CharacterSubInfo 
     onAddFavourite={onAddFavourite} 
     character={character} 
     isAddToFavourite={isAddToFavourite}/>
     <EpisodeList episodes={episodes}/>
      </div>
  
  

 
    
  )
}

export default CharacterDetail
function CharacterSubInfo({character,isAddToFavourite,onAddFavourite}){
  return(
    <div className="character-detail">
    <img 
    src={character.image}
     alt={character.name}
      className="character-detail__img"
      />
    <div className="character-detail__info">
      <h3 className="name">
        <span> {character.gender==="Male" ? <span>&#128104;&#127995;</span> : <span>&#128105;&#127995;</span>}</span>
     <span> &nbsp;{character.name}</span>
      </h3>
      <div className="info">
        <span 
        className={`status ${character.status==="Dead" ? "red" : ""}`}>
           </span>
        <span>&nbsp;{character.status}</span>
        <span>-&nbsp;{character.species}</span>
      </div>
   
 
 
  <div className="location">
    <p>Last known location:</p>
    <p>{character.location.name}</p>
  </div>
  <div className="actions">
    {isAddToFavourite ? (
    <p>Already Added To Favourite</p>
    ):(
     <button onClick={()=>onAddFavourite(character)} 
     className="btn btn--primary"> Add to Favourite</button>
    )}
   
  </div>
  </div>
  </div>
  )
}
function EpisodeList({episodes}){
  const [sortBy,setSortby]=useState(true);

  let sortedEpisodes;

  if(sortBy){
    sortedEpisodes = [... episodes].sort(
      (a, b) => new Date(a.created) - new Date(b.created)
      );
  } else {
    sortedEpisodes = [... episodes].sort(
      (a, b) => new Date(b.created) - new Date(a.created)
      );
  }
  return(
    <div className="character-episodes episodes-detail">
    <div className="title">
      <h2>List of Episodes:</h2>
      <button className="arrow" onClick={() => setSortby((is)=>!is)}>
        <ArrowUpCircleIcon 
        className="icon" 
        style={{rotate:sortBy?"0deg":"180deg",width:"1.3rem",height:"1.3rem"}}/>
        </button>
    </div>
      <ul>
        {sortedEpisodes.map((item, index) => (
          <li key={item.id}>
            <div>{String(index + 1).padStart(2,"0")} - {item.episode} :
             <strong> {item.name}</strong></div>
            <div className="badge badge--secondary">
              {item.air_date}
            </div>
          </li>
        ))
        }
      </ul>
    </div>
  )
}