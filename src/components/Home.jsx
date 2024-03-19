import React, { useState, useEffect } from 'react';
import axios from 'axios';

import "./home.css";
import Timer from './Timer';

function Home() {

    const [rollNo1, setRollNo1] = useState('');
    const [rollNo2, setRollNo2] = useState('');
    
    const [winner, setWinner] = useState(null);
    const [winnerimg, setwinnerimg] = useState(null);

    const [deviceId, setdeviceId] = useState();
    const [voted, setVoted] = useState(false);

    const [rollNo1Image, setRollNo1Image] = useState(null);
    const [rollNo2Image, setRollNo2Image] = useState(null);


    const getCurrentMembers = async () => {
        try {
            const response = await axios.get('/getmembers');
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
        } catch (error) {
            console.error(`Error fetching image for roll number :`, error);
        }
    };

    const gettoken = async () => {
        try {
            const response = await axios.get('/token');
            console.log(response);

            setdeviceId(response);
            setVoted(false);

            // localStorage.setItem('deviceId', response);

        } catch (error) {
            console.error('Error fetching current members:', error);
        }
    };

    useEffect(() => {

        getCurrentMembers();
    }, []);

    // Function to handle voting

    const handleVote = async (votedRollNo) => {
        // const deviceId = localStorage.getItem('deviceId');

        if (!deviceId) {
            console.error('Device ID not found');
            return;
        }
        try {

            await axios.post('/vote', { votedRollNo, deviceId });
            setVoted(true);
            // After voting, fetch new pair of members
            // getCurrentMembers();
        } catch (error) {
            console.error('Error voting:', error);
        }
    };

    // winerrrrrrrr
    const interval = setInterval(() => {
        // Fetch the winner from the backend every 10 minutes
        axios.get('/winner')
            .then(response => {
                setWinner(response.data.winner);
                setwinnerimg(`https://glauniversity.in:8103/${response.data.winner}.jpg`)

                getCurrentMembers();
            })
            .catch(error => {
                console.error('Error fetching winner:', error);
            });

    }, 20000); 

   

    

    useEffect(() => {

        gettoken();
        fetchImage();
        // const intervalId = setInterval(fetchServerTime, 60000);

    // return () => clearInterval(intervalId);

    }, [rollNo1, rollNo2]); // Update the timer when roll numbers change


    return (
        <div>
            <div>
                <h2 className='headline'>Vote </h2>

                <div className='mainbody'>

                    {/* <Timer serverTime={serverTime} /> */}

                    {voted && <p>You have already voted</p>}

                    <div className='members'>

                        <div className='img1'>
                            <img src={rollNo1Image} alt='img'  ></img>
                            <p>Member 1: {rollNo1}</p>
                            {!voted && (<button onClick={() => handleVote(rollNo1)}>Vote</button>)}


                        </div>
                        <div className='img2'>
                            <img src={rollNo2Image} alt='img'  ></img>

                            <p>Member 2: {rollNo2}</p>
                            {!voted && (<button onClick={() => handleVote(rollNo2)}>Vote</button>)}
                        </div>

                    </div>
                </div>


            </div>

            <div>
                <h1>{winner ? <img src={winnerimg} alt='img'></img>
                    : <p>No winner yet</p>}</h1>
            </div>

        

        </div>
    );
}

export default Home;
