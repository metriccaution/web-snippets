import { FC, useEffect, useRef } from "react";

export interface PlayerProps {
  playing?: boolean;
  source: string;
  startAtSeconds: number;
  onTimeUpdate: (event: { currentTime: number; duration: number }) => void;
  onComplete: () => void;
}

/**
 * The actual audio element itself, complete with controls
 */
const Player: FC<PlayerProps> = ({
  playing,
  source,
  startAtSeconds,
  onTimeUpdate,
  onComplete,
}) => {
  const ref = useRef<HTMLAudioElement>(null);

  // Play / pause by prop
  useEffect(() => {
    if (playing) {
      ref.current?.play();
    } else {
      ref.current?.pause();
    }
  }, [playing, source, ref]);

  // Adjust the start time when jumping in
  useEffect(() => {
    if (ref.current) {
      ref.current.currentTime = startAtSeconds;
    }
  }, [startAtSeconds, ref]);

  return (
    <audio
      ref={ref}
      src={source}
      onTimeUpdate={() =>
        onTimeUpdate({
          currentTime: ref.current?.currentTime ?? 1,
          duration: ref.current?.duration ?? 1,
        })
      }
      onEnded={() => onComplete()}
    />
  );
};

export default Player;
