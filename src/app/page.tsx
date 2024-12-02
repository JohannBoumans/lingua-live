"use client"

import { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
 
interface Captions {
  [key: string]: string;
}

const PeerPage = () => {
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const callingVideoRef = useRef<HTMLVideoElement>(null);
  const [peerInstance, setPeerInstance] = useState<Peer | null>(null);
  const [myUniqueId, setMyUniqueId] = useState<string>("");
  const [idToCall, setIdToCall] = useState('');
  const [captions, setCaptions] = useState<Captions>({});

  const generateRandomString = () => Math.random().toString(36).substring(2);

  const handleCall = () => {
    if (peerInstance) {
      navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      }).then(stream => {
        const call = peerInstance.call(idToCall, stream);
        call?.on('stream', userVideoStream => {
          if (callingVideoRef.current) {
            callingVideoRef.current.srcObject = userVideoStream;
          }
        });
      });
    }
  };

  useEffect(() => {
    if(myUniqueId){
      let peer: Peer;
      if (typeof window !== 'undefined') {
        peer = new Peer(myUniqueId, {
          host: `lingua-live-server-b1ec6cd6d3e5.herokuapp.com`,
          path: '/stream',
          secure: true,
          debug: 3
        });

        setPeerInstance(peer);
    
        navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        }).then(stream => {
          if (myVideoRef.current) {
            myVideoRef.current.srcObject = stream;
          }

          peer.on('call', call => {
            call.answer(stream);
            call.on('stream', userVideoStream => {
              if (callingVideoRef.current) {
                callingVideoRef.current.srcObject = userVideoStream;
              }
            });
          });
        });

        peer.on('connection', (conn) => {
          conn.on('data', (data: any) => {
            console.log(data, 'DATA')
            if (data.type === 'transcription') {
                console.log(data.transcription, 'TRANSCRIPTION')
              setCaptions(prev => ({
                ...prev,
                [data.peerId]: data.transcription
              }));
            }
          });
        });
      }
      return () => {
        if (peer) {
          peer.destroy();
        }
      };
    }
  }, [myUniqueId]);

  useEffect(() => {
    setMyUniqueId(generateRandomString);
  }, []);

  console.log(captions, 'CAPTIONS')

  return (
    <div className='flex flex-col justify-center items-center p-12'>
      <p>your id : {myUniqueId}</p>
      <div className="relative">
        <video className='w-72' playsInline ref={myVideoRef} autoPlay />
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
          {captions[myUniqueId]}
        </div>
      </div>

      <input 
        className='text-black' 
        placeholder="Id to call" 
        value={idToCall} 
        onChange={e => setIdToCall(e.target.value)} 
      />
      <button onClick={handleCall}>Call</button>

      <div className="relative">
        <video className='w-72' playsInline ref={callingVideoRef} autoPlay/>
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
          {captions[idToCall]}
        </div>
      </div>
    </div>
  );
};

export default PeerPage;








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