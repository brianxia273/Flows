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
  const [songResults, setSongResults] = useState([]); // Store search results
  const [selectedSong, setSelectedSong] = useState(null); // Store selected song
  const [loading, setLoading] = useState(false);

  const getSpotifyToken = async () => {
    const client_id = process.env.SPOTIFY_CLIENT_ID;
    const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
    const authToken = btoa(`${client_id}:${client_secret}`);

    const res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${authToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    const data = await res.json();
    return data.access_token;
  };

  // Function to search songs on Spotify
  const searchSongs = async (query) => {
    setLoading(true);
    const token = await getSpotifyToken();
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
    setSongResults(data.tracks.items); // Store the search results in the state
    setLoading(false);
  };

  // Trigger search when the song name changes
  useEffect(() => {
    searchSongs(songName); // Perform initial search for the default song
  }, [songName]);

  // Handle input change and search songs accordingly
  const handleInputChange = (e) => {
    setSongName(e.target.value);
    searchSongs(e.target.value); // Search for songs as the user types
  };

  // Handle song selection
  const handleSongSelect = (song) => {
    setSelectedSong(song); // Set the selected song
  };

  // Handle confirm selection (Choose Song button)
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
      <DialogTrigger className="w-[300px] h-[50px]">
        <Button
          variant="outline"
          className="w-[300px] h-[50px] bg-[#5d66e7] home-text shadow-md rounded-lg border-none"
          onMouseEnter={() => setIsBHovered(true)}
          onMouseLeave={() => setIsBHovered(false)}
          style={{
            background: isBHovered ? "#383d8b" : "#5d66e7",
            boxShadow: "#5d66e7",
          }}
        >
          <BsSoundwave
            style={{
              fontSize: "2.2rem",
              color: "#ebf6f9",
              verticalAlign: "middle",
              display: "inline-block",
            }}
          />
          Select Song
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Song Selection</DialogTitle>
          <DialogDescription>Find your song here.</DialogDescription>
        </DialogHeader>

        {/* Song Search Input */}
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Song Name
            </Label>
            <Input
              id="name"
              value={songName}
              onChange={handleInputChange} // Trigger search as user types
              className="col-span-3"
            />
          </div>
        </div>

        {/* Display Search Results */}
        <div className="grid gap-4 py-4">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul className="space-y-2">
              {songResults.map((song) => (
                <li
                  key={song.id}
                  className={`flex items-center gap-4 cursor-pointer ${
                    selectedSong && selectedSong.id === song.id
                      ? "bg-blue-500 text-white"
                      : ""
                  }`}
                  onClick={() => handleSongSelect(song)}
                >
                  <img
                    src={song.album.images[0].url}
                    alt={song.name}
                    className="w-16 h-16"
                  />
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

        {/* Choose Song Button */}
        <DialogFooter>
          <Button
            type="button"
            onClick={handleChooseSong}
            disabled={!selectedSong} // Disable if no song is selected
          >
            Choose Song
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
