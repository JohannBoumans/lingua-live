"use client"

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface Captions {
  [key: string]: string;
}

const PeerPage = () => {
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const socketRef = useRef<Socket>();
  const peerConnectionRef = useRef<RTCPeerConnection>();
  const [myUniqueId, setMyUniqueId] = useState<string>("");
  const [captions, setCaptions] = useState<Captions>({});

  useEffect(() => {
    // Configuration de Socket.IO
    socketRef.current = io('lingua-live-server-b1ec6cd6d3e5.herokuapp.com`');

    socketRef.current.on('connect', () => {
      console.log('Connected to server');
      setMyUniqueId(socketRef.current?.id || "");
    });

    // Gestion de la signalisation WebRTC
    // socketRef.current.on('offer', async (offer) => {
    //   await handleOffer(offer);
    // });

    // socketRef.current.on('answer', async (answer) => {
    //   await peerConnectionRef.current?.setRemoteDescription(answer);
    // });

    // socketRef.current.on('ice-candidate', async (candidate) => {
    //   await peerConnectionRef.current?.addIceCandidate(candidate);
    // });

    // socketRef.current.on('transcription', (data) => {
    //   setCaptions(prev => ({
    //     ...prev,
    //     [myUniqueId]: data.transcription
    //   }));
    // });

    return () => {
      peerConnectionRef.current?.close();
      socketRef.current?.disconnect();
    };
  }, [myUniqueId]);

  const initializePeerConnection = () => {
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
      ]
    };
}

//     const peerConnection = new RTCPeerConnection(configuration);
    
//     peerConnection.onicecandidate = (event) => {
//       if (event.candidate) {
//         socketRef.current?.emit('ice-candidate', event.candidate);
//       }
//     };

//     peerConnection.ontrack = (event) => {
//       if (remoteVideoRef.current) {
//         remoteVideoRef.current.srcObject = event.streams[0];
//       }
//     };

//     peerConnectionRef.current = peerConnection;
//     return peerConnection;
//   };

//   const handleOffer = async (offer: RTCSessionDescriptionInit) => {
//     const peerConnection = initializePeerConnection();
//     await peerConnection.setRemoteDescription(offer);
    
//     const answer = await peerConnection.createAnswer();
//     await peerConnection.setLocalDescription(answer);
    
//     socketRef.current?.emit('answer', answer);
//   };

//   const handleCall = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true,
//       });

//       // Affichage de la vidéo locale
//       if (myVideoRef.current) {
//         myVideoRef.current.srcObject = stream;
//       }

//       // Configuration WebRTC
//       const peerConnection = initializePeerConnection();
      
//       // Ajout des tracks au peer connection
//       stream.getTracks().forEach(track => {
//         peerConnection.addTrack(track, stream);
//       });

//       // Création et envoi de l'offre
//       const offer = await peerConnection.createOffer();
//       await peerConnection.setLocalDescription(offer);
//       socketRef.current?.emit('offer', offer);

//       // Configuration de l'audio pour la transcription
//       const audioContext = new AudioContext();
//       const source = audioContext.createMediaStreamSource(stream);
//       const processor = audioContext.createScriptProcessor(4096, 1, 1);

//       source.connect(processor);
//       processor.connect(audioContext.destination);

//       processor.onaudioprocess = (e) => {
//         const audioData = e.inputBuffer.getChannelData(0);
//         socketRef.current?.emit('audioData', audioData);
//       };
//     } catch (error) {
//       console.error('Error accessing media devices:', error);
//     }
//   };

useEffect(() => {
    socketRef?.current?.on('message', data => {
        console.log(data, 'CLIENT GREETING ?')
    })
}, [])

  const handleHello = () => {
    console.log('handle hello !')
        socketRef.current?.emit('message', { message: 'HELLO MY FRIEND' })
    }

  return (
    <div className='flex flex-col justify-center items-center p-12'>
      <p>your id : {myUniqueId}</p>
      <div className="relative">
        <video className='w-72' playsInline ref={myVideoRef} autoPlay muted />
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
          {captions[myUniqueId]}
        </div>
      </div>
      {/* <button 
        onClick={handleCall}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Call
      </button> */}
      <button 
        onClick={handleHello}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Say Hello !
      </button>
      <div className="relative mt-4">
        <video className='w-72' playsInline ref={remoteVideoRef} autoPlay />
      </div>
    </div>
  );
};

export default PeerPage;












//WITH PEER JS !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// "use client"

// import { useEffect, useRef, useState } from 'react';
// import Peer from 'peerjs';
 
// interface Captions {
//   [key: string]: string;
// }

// const PeerPage = () => {
//   const myVideoRef = useRef<HTMLVideoElement>(null);
//   const callingVideoRef = useRef<HTMLVideoElement>(null);
//   const [peerInstance, setPeerInstance] = useState<Peer | null>(null);
//   const [myUniqueId, setMyUniqueId] = useState<string>("");
//   const [idToCall, setIdToCall] = useState('');
//   const [captions, setCaptions] = useState<Captions>({});

//   const generateRandomString = () => Math.random().toString(36).substring(2);

//   const handleCall = () => {
//     if (peerInstance) {
//       navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true,
//       }).then(stream => {
//         const call = peerInstance.call(idToCall, stream);
//         call?.on('stream', userVideoStream => {
//           if (callingVideoRef.current) {
//             callingVideoRef.current.srcObject = userVideoStream;
//           }
//         });
//       });
//     }
//   };

//   useEffect(() => {
//     if(myUniqueId){
//       let peer: Peer;
//       if (typeof window !== 'undefined') {
//         peer = new Peer(myUniqueId, {
//           host: `lingua-live-server-b1ec6cd6d3e5.herokuapp.com`,
//           path: '/stream',
//           secure: true,
//           debug: 3
//         });

//         setPeerInstance(peer);
    
//         // connection.send('odfslk')
//         navigator.mediaDevices.getUserMedia({
//           video: true,
//           audio: true,
//         }).then(stream => {
//           if (myVideoRef.current) {
//             myVideoRef.current.srcObject = stream;
//           }

//           peer.on('call', call => {
//             call.answer(stream);
//             call.on('stream', userVideoStream => {
//               if (callingVideoRef.current) {
//                 callingVideoRef.current.srcObject = userVideoStream;
//               }
//             });
//           });
//         });

//         peer.on('connection', (conn) => {
//           conn.on('data', (data: any) => {
//             console.log(data, 'DATA')
//             if (data.type === 'transcription') {
//                 console.log(data.transcription, 'TRANSCRIPTION')
//               setCaptions(prev => ({
//                 ...prev,
//                 [data.peerId]: data.transcription
//               }));
//             }
//           });
//         });
//       }
//       return () => {
//         if (peer) {
//           peer.destroy();
//         }
//       };
//     }
//   }, [myUniqueId]);

//   const handleData = () => {
//     if (peerInstance) {
//         const conn = peerInstance.connect(idToCall);

//         conn.on('open', () => {
//             // Envoyer le message "HELLO" au serveur
//             conn.send({ type: 'greeting', message: 'HELLO' });
//         });

//         conn.on('data', (data) => {
//             console.log('Received data HELLO ??:', data);
//         });
//     }
//   }

//   useEffect(() => {
//     setMyUniqueId(generateRandomString);
//   }, []);

//   console.log(captions, 'CAPTIONS')

//   return (
//     <div className='flex flex-col justify-center items-center p-12'>
//       <p>your id : {myUniqueId}</p>
//       <div className="relative">
//         <video className='w-72' playsInline ref={myVideoRef} autoPlay />
//         <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
//           {captions[myUniqueId]}
//         </div>
//       </div>

//       <input 
//         className='text-black' 
//         placeholder="Id to call" 
//         value={idToCall} 
//         onChange={e => setIdToCall(e.target.value)} 
//       />
//       <button onClick={handleCall}>Call</button>
//       <button onClick={handleData}>Says HELLO</button>
//       <div className="relative">
//         <video className='w-72' playsInline ref={callingVideoRef} autoPlay/>
//         <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
//           {captions[idToCall]}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PeerPage;








// "use client"

// import { useEffect, useRef, useState } from 'react';
// import Peer from 'peerjs';
 
// const PeerPage = () => {
//   const myVideoRef = useRef<HTMLVideoElement>(null);
//   const callingVideoRef = useRef<HTMLVideoElement>(null);

//   const [peerInstance, setPeerInstance] = useState<Peer | null>(null);
//   const [myUniqueId, setMyUniqueId] = useState<string>("");
//   const [idToCall, setIdToCall] = useState('');

//   const generateRandomString = () => Math.random().toString(36).substring(2);

//   console.log(myVideoRef, callingVideoRef, 'CALL REF')
//   // Here we declare a function to call the identifier and retrieve 
//   // its video stream.
//   const handleCall = () => {
//     navigator.mediaDevices.getUserMedia({
//       video: true,
//       audio: true,
//     }).then(stream => {
//         const call = peerInstance?.call(idToCall, stream);
//         console.log(call, `ID: ${idToCall}`, stream, 'HANDLE CALL')
//       if (call) {
//         call.on('stream', userVideoStream => {
//           if (callingVideoRef.current) {
//             console.log(userVideoStream, 'USER VIDEO STREAM')
//             callingVideoRef.current.srcObject = userVideoStream;
//           }
//         });
//       }
//     });
//   };

//   useEffect(() => {
//     if(myUniqueId){
//         let peer: Peer;
//         if (typeof window !== 'undefined') {
//             peer = new Peer(myUniqueId, {
//                 host: `lingua-live-server-b1ec6cd6d3e5.herokuapp.com`,
//                 // port: 8080,
//                 path: '/stream',
//                 secure: true,
//                 debug: 3
//             });

//           setPeerInstance(peer);
    
//           navigator.mediaDevices.getUserMedia({
//             video: true,
//             audio: true,
//           }).then(stream => {
//             if (myVideoRef.current) {
//               myVideoRef.current.srcObject = stream;
//             }

//             peer.on('call', call => {
//               call.answer(stream);
//               call.on('stream', userVideoStream => {
//                 if (callingVideoRef.current) {
//                   callingVideoRef.current.srcObject = userVideoStream;
//                 }
//               });
//             });
//           });
//         }
//         return () => {
//             if (peer) {
//               peer.destroy();
//             }
//           };
//     }
//   }, [myUniqueId]);

//   useEffect(() => {
//     setMyUniqueId(generateRandomString);
//   }, [])

//   return (
//     <div className='flex flex-col justify-center items-center p-12'>
//       <p>your id : {myUniqueId}</p>
//       <video className='w-72' playsInline ref={myVideoRef} autoPlay />
//       <input className='text-black' placeholder="Id to call" value={idToCall} onChange={e => setIdToCall(e.target.value)} />
//       <button onClick={handleCall}>Call</button>
//       <video className='w-72' playsInline ref={callingVideoRef} autoPlay/>
//     </div>
//   );
// };

// export default PeerPage;