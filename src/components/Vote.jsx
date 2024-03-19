import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./home.css";

export const Vote = () => {

  const [rollNo1, setRollNo1] = useState('');
  const [rollNo2, setRollNo2] = useState('');

  const [voted, setVoted] = useState(false);

  const [voted1, setVoted1] = useState(false);

  const [rollNo1Image, setRollNo1Image] = useState(null);
  const [rollNo2Image, setRollNo2Image] = useState(null);

  const [winner, setWinner] = useState(null);
  const [winnerimg, setwinnerimg] = useState(null);


  const getCurrentMembers = async () => {
    try {
      const response = await axios.get('https://facevotebackend.onrender.com/getmembers');
      // setWinner("");


      setRollNo1(response.data.rollNo1);
      setRollNo2(response.data.rollNo2);



    } catch (error) {
      console.error('Error fetching current members:', error);
    }
  };

  const fetchImage = async () => {
    try {

      setRollNo1Image(`https://glauniversity.in:8103/${rollNo1}.jpg`)
      setRollNo2Image(`https://glauniversity.in:8103/${rollNo2}.jpg`)


      getwinner();

    } catch (error) {
      console.error(`Error fetching image for roll number :`, error);
    }
  };

  const getwinner = async () => {
    const res = await axios.get('https://facevotebackend.onrender.com/winner');

    setWinner(res.data.winner);
    setwinnerimg(`https://glauniversity.in:8103/${res.data.winner}.jpg`);

  }

  const gettoken = async () => {
    try {
      const res = await axios.get("https://facevotebackend.onrender.com/token")

      localStorage.setItem("deviceId", JSON.stringify(res.data.newtoken));

      // setdeviceId(res);
      setVoted(false);
      setVoted1(false);
    }
    catch (err) {
      console.log(err);
    }
  }

  const handlevote = async (votedRollNo) => {

    // setdeviceId(JSON.parse(localStorage.getItem('deviceId')))


    const deviceId = JSON.parse(localStorage.getItem('deviceId'))

    if (!deviceId) {

      console.error('Device ID not found');
    }

    try {
      const res = await axios.post('https://facevotebackend.onrender.com/vote', { votedRollNo, deviceId });

      // console.log(res);

      if (res.status === 207) {
        setVoted1(false);
        setVoted(true)
      }
      else if (res.status === 200)
        setVoted1(true);

    }
    catch (err) {
      console.log(err);
      setVoted(false);
    }

  }


  useEffect(() => {
    fetchImage();
    setVoted(false);
    setVoted1(false);
  }, [rollNo1, rollNo2]);

  useEffect(() => {
    const token = localStorage.getItem("deviceId");
    if (!token)
      gettoken();

    setInterval(() => {
      getCurrentMembers();
    }, 2000);



  }, []);

  return (
    <div>

      <div className="worksphere">
        <h1 className="title3">F A C E V O T E</h1>
        <h1 className="title2">F A C E V O T E</h1>

        <h1 className="title1">F A C E V O T E</h1>

        <h1 className="title2">F A C E V O T E</h1>
        <h1 className="title3">F A C E V O T E</h1>

      </div>
      <br/>

      <div className='textarea'>
      {voted && <p>you already voted!! <br></br>DON'T CHEAT BE HONEST !</p>}
      {voted1 && <p>S U C C E S S F U L L Y <br></br> V O T E D ! ! </p>}

      </div>

      <div className='members'>

        <div className='img1'>
          <img src={rollNo1Image} alt="{pic}" onError={(e) => {
            e.target.src = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'; // Replace 'alternate_image.jpg' with the URL of your alternate image
            e.target.alt = 'Alternate Image';
          }} ></img>
          <p>contestant 1</p>
          {!voted && (<button onClick={() => handlevote(rollNo1)}>Vote</button>)}



        </div>
        <div className='img2'>
          <img src={rollNo2Image} alt="{pic}" onError={(e) => {
            e.target.src = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'; // Replace 'alternate_image.jpg' with the URL of your alternate image
            e.target.alt = 'Alternate Image';
          }} ></img>

          <p>contestant 2</p>
          {!voted && (<button onClick={() => handlevote(rollNo2)}>Vote</button>)}


        </div>

      </div>

      <div className="winner">
        <h1> W I N N E R </h1>
        <h1>{winner ? <img src={winnerimg} alt='img'></img>
          : <p>No winner yet</p>}</h1>
      </div>
    </div>
  )
}
