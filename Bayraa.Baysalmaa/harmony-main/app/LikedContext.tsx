import React, { createContext, useContext, useState, ReactNode } from "react";

// Лiked контекст үүсгэх
interface LikedContextType {
  likedEvents: string[];
  toggleLike: (eventId: string) => void;
}

const LikedContext = createContext<LikedContextType | undefined>(undefined);

export const useLiked = () => {
  const context = useContext(LikedContext);
  if (!context) {
    throw new Error("useLiked must be used within a LikedProvider");
  }
  return context;
};

interface LikedProviderProps {
  children: ReactNode;
}

export const LikedProvider = ({ children }: LikedProviderProps) => {
  const [likedEvents, setLikedEvents] = useState<string[]>([]); // likedEvents нь string[] төрлийн байх

  const toggleLike = (eventId: string) => {
    setLikedEvents((prevLikes) => {
      if (prevLikes.includes(eventId)) {
        return prevLikes.filter((id) => id !== eventId);
      } else {
        return [...prevLikes, eventId];
      }
    });
  };

  return (
    <LikedContext.Provider value={{ likedEvents, toggleLike }}>
      {children}
    </LikedContext.Provider>
  );
};
