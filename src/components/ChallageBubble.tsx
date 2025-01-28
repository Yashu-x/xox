"use client";
import React, { FC } from 'react';
import axios from 'axios';
import { Button } from './ui/button';

interface ChallagesProps {
  playerName: string;
  challageid: string;
}

const ChallageBubble: FC<ChallagesProps> = ({ playerName, challageid }) => {
  const handleAccept = async () => {
    try {
      
      const response = await axios.post('http://localhost:3000/api/challages/acceptchallages', {
        challengeId: challageid,
      });
      console.log('Accept Response:', response.data);
    } catch (error) {
      console.error('Error accepting challenge:', error);
    }
  };

  const handleDecline = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/challages/declinechallages', {
        challageId: challageid,
      });
      console.log('Decline Response:', response.data);
    } catch (error) {
      console.error('Error declining challenge:', error);
    }
  };

  return (
    <div>
      <h6>Challenge</h6>
      <h6>{challageid}</h6>
      <h6>{playerName}</h6>
      <Button onClick={handleAccept}>Accept</Button>
      <Button onClick={handleDecline}>Decline</Button>
    </div>
  );
};

export default ChallageBubble;
