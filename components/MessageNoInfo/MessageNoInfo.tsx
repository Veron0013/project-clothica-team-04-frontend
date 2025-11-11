// components/MessageNoInfo/MessageNoInfo.tsx

"use client"


import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './MessageNoInfo.module.css';

interface MessageNoInfoProps {
	text: string
	buttonText: string
	route?: string // '/goods' | '/categories'
}


export default function MessageNoInfo({
    text,
    buttonText,
    route = '/goods' }: MessageNoInfoProps)
{
  const router = useRouter();

	const handleClick = () => {
		router.push(route)
	}

  return (
    <div className={styles['message_container']}>
      <p className={styles['message_text']}>{text}</p>
      <button onClick={handleClick} className={styles['message_button']}>
        {buttonText} 
      </button>
    </div>
  );
}

