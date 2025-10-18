import React, { useState, useRef } from 'react';

const Piano: React.FC = () => {
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Piano key frequencies for C4, D4, E4, F4, G4
  const keyFrequencies = [261.63, 293.66, 329.63, 349.23, 392.00];
  const keyLabels = ['C', 'D', 'E', 'F', 'G'];

  // Never Gonna Give You Up melody (simplified to fit 5 keys)
  // Using indices: 0=C, 1=D, 2=E, 3=F, 4=G
  const melody = [
    4, 2, 1, 2, 4, 4, 4, 2, 1, 2, 2, 2,
    4, 3, 1, 0, 4, 2, 1, 2, 4, 4, 4, 2, 1, 2, 2
  ];

  const playNote = (frequency: number, duration: number = 0.3) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const audioContext = audioContextRef.current;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'triangle';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  };

  const handleKeyClick = (keyIndex: number) => {
    // Play the note for this key
    playNote(keyFrequencies[keyIndex]);

    // Also play the next note in the melody
    if (currentNoteIndex < melody.length) {
      const melodyNoteIndex = melody[currentNoteIndex];
      setTimeout(() => {
        playNote(keyFrequencies[melodyNoteIndex], 0.4);
      }, 100);
      setCurrentNoteIndex((prev) => (prev + 1) % melody.length);
    }
  };

  return (
    <div style={{
      backgroundColor: 'var(--bg-secondary)',
      padding: '1.5rem',
      borderRadius: '16px',
      boxShadow: '0 0 0 1px var(--border-default), 0 8px 24px rgba(0, 0, 0, 0.12)',
      border: '1px solid var(--border-default)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.75rem',
      transition: 'all 0.3s ease',
      width: 'fit-content'
    }}>
      {/* Title */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          color: 'var(--text-primary)',
          fontSize: '32px',
          fontWeight: 'bold',
          marginBottom: '0.5rem',
          fontFamily: 'Inter, sans-serif'
        }}>
          Piano Keys
        </div>
        <div style={{
          color: 'var(--text-muted)',
          fontSize: '20px',
          fontWeight: 'normal',
          fontFamily: 'Inter, sans-serif'
        }}>
          play me
        </div>
      </div>

      {/* Piano Keys */}
      <div style={{
        display: 'flex',
        gap: '8px',
        alignItems: 'flex-end'
      }}>
        {keyFrequencies.map((freq, index) => (
          <button
            key={index}
            onClick={() => handleKeyClick(index)}
            onMouseDown={(e) => e.currentTarget.style.transform = 'translateY(4px)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            style={{
              width: '40px',
              height: '120px',
              backgroundColor: 'var(--surface-elevated)',
              border: '2px solid var(--border-default)',
              borderRadius: '0 0 8px 8px',
              cursor: 'pointer',
              transition: 'all 0.1s ease',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              fontWeight: 'bold',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              paddingBottom: '8px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}
          >
            {keyLabels[index]}
          </button>
        ))}
      </div>

      {/* Progress indicator */}
      <div style={{
        color: 'var(--text-muted)',
        fontSize: '12px',
        fontFamily: 'Inter, sans-serif'
      }}>
        Note {currentNoteIndex + 1} of {melody.length}
      </div>
    </div>
  );
};

export default Piano;
