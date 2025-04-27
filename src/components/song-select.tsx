import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BsSoundwave } from "react-icons/bs";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function SongSelect() {
  const [isBHovered, setIsBHovered] = useState(false);
  const [songName, setSongName] = useState("The Cup");
  const [songResults, setSongResults] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [loading, setLoading] = useState(false);

  const getSpotifyToken = async () => {
    const client_id = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const client_secret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;

    const authToken = btoa(`${client_id}:${client_secret}`);

    try {
      const res = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          Authorization: `Basic ${authToken}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
      });

      const data = await res.json();

      if (res.ok) {
        return data.access_token;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  };

  const searchSongs = async (query) => {
    setLoading(true);
    const token = await getSpotifyToken();

    if (!token) {
      console.error("Failed to get Spotify token, aborting search.");
      setSongResults([]);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `https://api.spotify.com/v1/search?q=${query}&type=track&limit=5`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        if (data && data.tracks && data.tracks.items) {
          setSongResults(data.tracks.items);
        } else {
          console.log("No songs found in the response.");
          setSongResults([]);
        }
      } else {
        console.error("Error fetching songs:", data.error.message);
        setSongResults([]);
      }
    } catch (error) {
      setSongResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchSongs(songName);
  }, [songName]);

  const handleInputChange = (e) => {
    setSongName(e.target.value);
    searchSongs(e.target.value);
  };

  const handleSongSelect = (song) => {
    setSelectedSong(song);
  };

  const handleChooseSong = () => {
    if (selectedSong) {
      alert(
        `You selected: ${selectedSong.name} by ${selectedSong.artists
          .map((artist) => artist.name)
          .join(", ")}`
      );
    }
  };

  return (
    <Dialog>
      <DialogTrigger
        className="w-[300px] h-[50px] bg-[#5d66e7] home-text shadow-md rounded-lg border-none text-sm"
        onMouseEnter={() => setIsBHovered(true)}
        onMouseLeave={() => setIsBHovered(false)}
        style={{
          background: isBHovered ? "#383d8b" : "#5d66e7",
          boxShadow: "#5d66e7",
        }}
      >
        <BsSoundwave
          style={{
            fontSize: "1.2rem",
            color: "#ebf6f9",
            verticalAlign: "middle",
            display: "inline-block",
          }}
        />{" "}
        Select Song
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Song Selection</DialogTitle>
          <DialogDescription>Find your song here.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Song/Artist
            </Label>
            <Input
              id="name"
              value={songName}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
        </div>

        <div className="grid gap-4 py-4 h-[300px] overflow-y-auto">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul className="space-y-2">
              {songResults.map((song) => (
                <li
                  key={song.id}
                  className={`flex items-center gap-4 cursor-pointer ${
                    selectedSong && selectedSong.id === song.id
                      ? "bg-[#1e2424] text-white rounded-lg"
                      : ""
                  }`}
                  onClick={() => handleSongSelect(song)}
                >
                  <div className="w-16 h-16 flex items-center justify-center">
                    {" "}
                    <img
                      src={song.album.images[0].url}
                      alt={song.name}
                      className="max-w-13 max-h-13 outline-2 outline-[#1e2424] rounded-md"
                    />
                  </div>
                  <div>
                    <p className="font-semibold">{song.name}</p>
                    <p className="text-sm text-gray-500">
                      {song.artists.map((artist) => artist.name).join(", ")}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            onClick={handleChooseSong}
            disabled={!selectedSong}
          >
            Choose Song
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
