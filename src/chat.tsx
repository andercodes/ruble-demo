import { ChangeEvent, KeyboardEvent, useRef, useState } from 'react'
import useWebSocket from 'react-use-websocket';

type MessageProps = {
  message: string
}

function RubleMessage(props: MessageProps) {
  return (
    <article style={{marginBottom: '2em', width: '90%'}}>
      <h2>Ruble</h2>
      <p>{props.message}</p>
    </article>
  )
}

function UserMessage(props: MessageProps & {sentiment: string}) {
  return (
    <article style={{marginBottom: '1em', textAlign: 'right', width: '90%', marginLeft: 'auto'}}>
      <h2>Me</h2>
      <p>{props.message}</p>
      <small>sentiment: {props.sentiment}</small>
    </article>
  )
}

export function Chat() {
  const [currentMessage, setCurrentMessage] = useState('');

  const [messages, setMessages] = useState([] as JSX.Element[]);
  const [streamSid, setStreamSid] = useState('');

  const { sendMessage } = useWebSocket(
    import.meta.env.VITE_WEBSOCKET_URL, 
    {
      onMessage: (message) => {
	const parsedData = JSON.parse(message.data);

	switch(parsedData.event) {
	  case 'message': 
	    setMessages(messages.concat(
	      <UserMessage message={parsedData.message} sentiment={parsedData.sentiment}/>,
	      <RubleMessage message={parsedData.response}/>,
	  ));
	  break;

	  case 'start': 
	    setStreamSid(parsedData.streamSid)
	  break;
	}
      }
    }
  );

  const chatContainerRef = useRef<HTMLDivElement>(null);

  function handleEnter(ev: KeyboardEvent<HTMLInputElement>) {
    if(ev.key === 'Enter') {
      ev.preventDefault();

      let message = currentMessage.trim();

      if(!message.length) {
	return;
      }
      if(!message.endsWith('.')) {
	message += '.';
      }

      sendMessage(JSON.stringify({
	streamSid,
	event: 'message',
	message: message,
      }))


      if(chatContainerRef.current) {
	chatContainerRef.current.scrollTo(0, chatContainerRef.current.scrollHeight)
	setCurrentMessage('');
      }
    }
  }

  function handleChange(ev: ChangeEvent<HTMLInputElement>) {
    setCurrentMessage(ev.target.value);
  }

  return (
    <section style={{border: 'solid black .1em', borderRadius: '.3em', padding: '.5em', position: 'relative'}}>
      <section ref={chatContainerRef} style={{height: '50vh', overflowY: 'scroll', paddingRight: '.9em', marginBottom: '1em'}}>
	{messages}
      </section>

      <input 
	onKeyDown={handleEnter} 
	onChange={handleChange}
	value={currentMessage} 
	style={{border: 'solid black .1em', width: '98%', borderRadius: '.3em', color: 'white', backgroundColor: '#0f0e17', padding: '.25em' }} 
      />
    </section>
  )
}

