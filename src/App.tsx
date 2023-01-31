import {ChangeEvent, Dispatch, SetStateAction, useState} from 'react';
import './App.css'
import {Chat} from './chat'

type PhoneModalProps = {
  setShowModal: Dispatch<SetStateAction<boolean>>
  setPhoneNumber: Dispatch<SetStateAction<string>>
}

function PhoneModal(props: PhoneModalProps) {

  const [phoneNumber, setPhoneNumber] = useState('');

  function handleChange(ev: ChangeEvent<HTMLInputElement>) {
    setPhoneNumber(ev.target.value);
  }

  async function handleClick() {
    const number = phoneNumber.trim();
    if(!number.length) {
      return;
    }

    const baseUrl = import.meta.env.VITE_BACKEND_URL;

    const res = await fetch(`${baseUrl}/twilio/calls`, {
      method: 'POST',
      headers: {
	'Accept': 'application/json',
	'Content-Type': 'application/json'
      },
      body: JSON.stringify({
	phone: number
      })
    });

    if(!res.ok) {
      alert(res.statusText);
      return;
    }

    props.setShowModal(false);
    props.setPhoneNumber(phoneNumber);
  }

  return(
    <section style={{border: 'solid black .1em', borderRadius: '.3em', padding: '.5em', position: 'relative'}}>
      <h2>Introduce your phone number</h2>
      <input 
	onChange={handleChange}
	type='tel'
	style={{border: 'solid black .1em', width: '98%', borderRadius: '.3em', color: 'white', backgroundColor: '#0f0e17', padding: '.25em', marginBottom: '1em' }} 
      />

      <button onClick={handleClick} style={{margin: 'auto', display: 'block'}}>
	Continue
      </button>
    </section>
  )

}

function App() {
  const [showModal, setShowModal] = useState(true);

  const [phoneNumber, setPhoneNumber] = useState('');

  return (
    <div style={{padding: '2em'}}>
      <h1>
	RubleAI Demo - {phoneNumber}
      </h1>
      {
	showModal && <PhoneModal setShowModal={setShowModal} setPhoneNumber={setPhoneNumber} />
      }

      {
	!showModal && <Chat />
      }
    </div>
  )
}

export default App
