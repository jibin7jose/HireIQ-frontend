import { useEffect, useRef, useState } from 'react';
import * as signalR from '@microsoft/signalr';

interface UseWebRTCProps {
  roomId: string;
  token: string | null;
}

export function useWebRTC({ roomId, token }: UseWebRTCProps) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [connectionState, setConnectionState] = useState<string>('disconnected');
  const [error, setError] = useState<string | null>(null);
  
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const hubConnectionRef = useRef<signalR.HubConnection | null>(null);

  const ICE_SERVERS = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
  };

  useEffect(() => {
    if (!token || !roomId) return;
    
    let isMounted = true;

    const init = async () => {
      try {
        // 1. Get User Media
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (!isMounted) {
            stream.getTracks().forEach(t => t.stop());
            return;
        }
        
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // 2. Setup RTCPeerConnection
        const pc = new RTCPeerConnection(ICE_SERVERS);
        peerConnectionRef.current = pc;

        // Add local tracks to peer connection
        stream.getTracks().forEach(track => {
          pc.addTrack(track, stream);
        });

        // Handle incoming remote tracks
        pc.ontrack = (event) => {
          console.log('Received remote track', event.streams);
          setRemoteStream(event.streams[0]);
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };

        // Handle ICE candidates
        pc.onicecandidate = (event) => {
          if (event.candidate && hubConnectionRef.current?.state === signalR.HubConnectionState.Connected) {
            hubConnectionRef.current.invoke('SendIceCandidate', roomId, event.candidate)
              .catch(err => console.error('Error sending ICE candidate', err));
          }
        };

        pc.onconnectionstatechange = () => {
          setConnectionState(pc.connectionState);
        };

        // 3. Setup SignalR Hub
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5128';
        const connection = new signalR.HubConnectionBuilder()
          .withUrl(`${API_URL}/hubs/video?access_token=${token}`)
          .withAutomaticReconnect()
          .build();
          
        hubConnectionRef.current = connection;

        // Hub Listeners
        connection.on('UserJoined', async (connectionId) => {
          console.log('User joined room, initiating offer...', connectionId);
          // When someone joins, create an offer
          try {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            await connection.invoke('SendOffer', roomId, offer);
          } catch (err) {
            console.error('Error creating offer', err);
          }
        });

        connection.on('ReceiveOffer', async (offer, connectionId) => {
          console.log('Received offer', offer);
          try {
            await pc.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            await connection.invoke('SendAnswer', roomId, answer);
          } catch (err) {
            console.error('Error handling offer', err);
          }
        });

        connection.on('ReceiveAnswer', async (answer, connectionId) => {
          console.log('Received answer', answer);
          try {
            await pc.setRemoteDescription(new RTCSessionDescription(answer));
          } catch (err) {
            console.error('Error handling answer', err);
          }
        });

        connection.on('ReceiveIceCandidate', async (candidate, connectionId) => {
          console.log('Received ICE candidate', candidate);
          try {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (err) {
            console.error('Error adding ICE candidate', err);
          }
        });

        connection.on('UserLeft', (connectionId) => {
          console.log('User left room', connectionId);
          setRemoteStream(null);
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = null;
          }
          setConnectionState('disconnected');
        });

        // Start connection
        await connection.start();
        console.log('Video Hub connected');
        
        await connection.invoke('JoinRoom', roomId);

      } catch (err: any) {
        console.error('Failed to initialize WebRTC', err);
        setError(err.message || 'Failed to access camera/microphone');
      }
    };

    init();

    return () => {
      isMounted = false;
      
      if (hubConnectionRef.current?.state === signalR.HubConnectionState.Connected) {
        hubConnectionRef.current.invoke('LeaveRoom', roomId).catch(console.error);
        hubConnectionRef.current.stop();
      }
      
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
      
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, token]);

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };
  
  const endCall = () => {
    if (hubConnectionRef.current?.state === signalR.HubConnectionState.Connected) {
      hubConnectionRef.current.invoke('LeaveRoom', roomId).catch(console.error);
    }
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    window.close(); // Attempt to close window or user can navigate back
    window.history.back();
  };

  return {
    localVideoRef,
    remoteVideoRef,
    connectionState,
    error,
    isMuted,
    isVideoOff,
    toggleMute,
    toggleVideo,
    endCall
  };
}
