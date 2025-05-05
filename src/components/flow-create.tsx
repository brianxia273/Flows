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
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/clientApp";
import { ThemeButton } from "./theme-button";
import { X } from "lucide-react";
import { PreferencePieChart } from "@/components/pie-chart";
import { serverTimestamp } from "firebase/firestore";

export function FlowCreate() {
  const [isBHovered, setIsBHovered] = useState(false);
  const [songName, setSongName] = useState("The Cup");
  const [songResults, setSongResults] = useState([]);
  const [songSelected, setSongSelected] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [openStage1, setOpenStage1] = useState(false);
  const [openStage2, setOpenStage2] = useState(false);
  const [openStage3, setOpenStage3] = useState(false);
  const [openStage4, setOpenStage4] = useState(false);
  const [flowName, setFlowName] = useState("");
  const [flowSongs, setFlowSongs] = useState([]);
  const [flowPreference, setFlowPreference] = useState({});
  const [flowTheme, setFlowTheme] = useState<string>("");
  const [songLoading, setSongLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);

  const themes = [
    { name: "set1", color1: "#3c87fd", color2: "#a16be3" },
    { name: "set2", color1: "#e53935", color2: "#ff7043" },
    { name: "set3", color1: "#10b981", color2: "#14b8a6" },
    { name: "set4", color1: "#ffec61", color2: "#ffb74d" },
  ];

  const checkIfFlowExists = async (flowName: string) => {
    const flowsRef = collection(db, "flows");
    const q = query(flowsRef, where("name", "==", flowName));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

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
        setErrorMessage("Failed to authenticate with Spotify");
        return null;
      }
    } catch (error) {
      setErrorMessage("Error connecting to Spotify");
      return null;
    }
  };

  const searchSongs = async (query) => {
    setSongLoading(true);
    setErrorMessage("");
    const token = await getSpotifyToken();

    if (!token) {
      setSongResults([]);
      setSongLoading(false);
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
          setSongResults([]);
        }
      } else {
        setErrorMessage("Error searching for songs");
        setSongResults([]);
      }
    } catch (error) {
      setErrorMessage("Error connecting to Spotify");
      setSongResults([]);
    } finally {
      setSongLoading(false);
    }
  };

  // const getAudioFeatures = async (trackID: string) => {
  //   setErrorMessage("");
  //   const token = await getSpotifyToken();
  //   try {
  //     const res = await fetch(
  //       `https://api.spotify.com/v1/audio-features/${trackID}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     if (!res.ok) {
  //       throw new Error(`AudioFeatures error: ${res.status}`);
  //     }
  //     const data = await res.json();
  //     return data;
  //   } catch (error) {
  //     console.error("getAudioFeatures failed", error);
  //     throw error;
  //   }
  // };

  // type AudioFeature = {
  //   id: string;
  //   acousticness: number;
  //   danceability: number;
  //   energy: number;
  //   instrumentalness: number;
  //   loudness: number;
  //   speechiness: number;
  //   tempo: number;
  //   valence: number;
  // };

  // const FEATURES = [
  //   "acousticness",
  //   "danceability",
  //   "energy",
  //   "instrumentalness",
  //   "loudness",
  //   "speechiness",
  //   "tempo",
  //   "valence",
  // ] as const;

  // type FeatureKey = (typeof FEATURES)[number];

  // const calculateFeatureWeights = async (
  //   flowSongs: { id: string }[],
  //   getAudioFeatures: (trackID: string) => Promise<AudioFeature>
  // ): Promise<Record<FeatureKey, number>> => {
  //   const allFeatures: AudioFeature[] = await Promise.all(
  //     flowSongs.map((song) => getAudioFeatures(song.id))
  //   );

  //   const featureValues: Record<FeatureKey, number[]> = {} as any;
  //   FEATURES.forEach((f) => (featureValues[f] = []));

  //   for (const songFeatures of allFeatures) {
  //     FEATURES.forEach((f) => {
  //       featureValues[f].push(songFeatures[f]);
  //     });
  //   }

  //   const rawWeights: Record<FeatureKey, number> = {} as any;
  //   FEATURES.forEach((f) => {
  //     const values = featureValues[f];
  //     const mean = values.reduce((acc, val) => acc + val, 0) / values.length;
  //     const variance =
  //       values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) /
  //       values.length;
  //     rawWeights[f] = 1 / (variance + 1e-6);
  //   });

  //   const totalWeight = Object.values(rawWeights).reduce(
  //     (sum, w) => sum + w,
  //     0
  //   );
  //   const normalizedWeights: Record<FeatureKey, number> = {} as any;
  //   FEATURES.forEach((f) => {
  //     normalizedWeights[f] = rawWeights[f] / totalWeight;
  //   });

  //   return normalizedWeights;
  // };
  const examplePreference = {
    acousticness: 0.08,
    danceability: 0.22,
    energy: 0.18,
    instrumentalness: 0.1,
    loudness: 0.15,
    speechiness: 0.05,
    tempo: 0.12,
    valence: 0.1,
  };

  useEffect(() => {
    if (songName.trim().length > 0) {
      searchSongs(songName);
    }
  }, [songName]);

  const handleInputChange = (e) => {
    setSongName(e.target.value);
  };

  const handleSongSelect = (song) => {
    setSelectedSong(song);
    setErrorMessage("");
  };

  const addSongToFlow = () => {
    if (!selectedSong) return;

    const songExists = songSelected.some((s) => s.id === selectedSong.id);

    if (!songExists) {
      setAddLoading(true);
      setSongSelected((prev) => [...prev, selectedSong]);
      setFlowSongs((prev) => [
        ...prev,
        {
          id: selectedSong.id,
          name: selectedSong.name,
          artists: selectedSong.artists.map((artist) => artist.name).join(", "),
          album: selectedSong.album.name,
          image: selectedSong.album.images[0].url,
        },
      ]);

      setSelectedSong(null);
      setAddLoading(false);
    } else {
      setErrorMessage("This song is already in your flow");
    }
  };

  const removeSongFromFlow = (songId) => {
    setSongSelected((prev) => prev.filter((song) => song.id !== songId));
    setFlowSongs((prev) => prev.filter((song) => song.id !== songId));
  };

  const makeFlow = (
    flowName: string,
    flowTheme: any,
    flowSongs: any,
    flowPreference: any
  ) => {
    return {
      name: flowName,
      theme: flowTheme,
      songs: flowSongs,
      preferences: flowPreference,
      createdAt: serverTimestamp(),
    };
  };

  return (
    <div>
      <Button
        className="w-[300px] h-[50px] bg-[#5d66e7] home-text shadow-md rounded-lg border-none text-sm"
        onMouseEnter={() => setIsBHovered(true)}
        onMouseLeave={() => setIsBHovered(false)}
        onClick={() => setOpenStage1(true)}
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
        Create Flow
      </Button>
      <Dialog open={openStage1} onOpenChange={setOpenStage1}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>1. Name your Flow</DialogTitle>
            <DialogDescription>
              Make it yours — name your flow after your routine, a project, or
              even a favorite vibe.
            </DialogDescription>
          </DialogHeader>
          <Input
            type="flowName"
            placeholder="Try names like 'Focus Mode', 'Workout', 'Chill Coding'"
            value={flowName}
            onChange={(e) => setFlowName(e.target.value)}
          />
          {errorMessage && (
            <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
          )}
          <DialogFooter>
            <Button
              disabled={!flowName.trim() || loading}
              onClick={async () => {
                setLoading(true);
                const flowExists = await checkIfFlowExists(flowName);
                if (!flowExists) {
                  setOpenStage1(false);
                  setOpenStage2(true);
                } else {
                  setErrorMessage(
                    "A flow with this name already exists. Please choose a different name."
                  );
                }
                setLoading(false);
              }}
            >
              {loading ? "Loading..." : "Next"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={openStage2} onOpenChange={setOpenStage2}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>2. Choose a Theme Color for {flowName}</DialogTitle>
            <div className="grid grid-cols-4 justify-center mt-10 mb-5">
              {themes.map((theme, index) => (
                <ThemeButton
                  key={index}
                  color1={theme.color1}
                  color2={theme.color2}
                  selected={flowTheme === theme.name}
                  onClick={() => setFlowTheme(theme.name)}
                />
              ))}
            </div>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => {
                setLoading(true);
                setOpenStage2(false);
                setOpenStage1(true);
                setLoading(false);
              }}
            >
              Back
            </Button>
            <Button
              disabled={!flowTheme.trim() || loading}
              onClick={() => {
                setLoading(true);
                setOpenStage2(false);
                setOpenStage3(true);
                setLoading(false);
              }}
            >
              {loading ? "Loading..." : "Next"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={openStage3} onOpenChange={setOpenStage3}>
        <DialogContent className="sm:max-w-[1000px] h-[700px]">
          <DialogHeader>
            <DialogTitle>3. Song Selection</DialogTitle>
            <DialogDescription>
              Start adding songs to your flow! Each song you add helps the app
              better understand your preferences and know your vibe.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-6">
            {/* Search Column */}
            <div className="flex flex-col">
              <div className="mb-4">
                <div className="flex items-center gap-3">
                  <Label htmlFor="name" className="whitespace-nowrap">
                    Song/Artist
                  </Label>
                  <Input
                    id="name"
                    value={songName}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>
                {errorMessage && (
                  <div className="text-red-500 text-sm mt-2">
                    {errorMessage}
                  </div>
                )}
              </div>

              <div className="border rounded-lg p-3 mb-4">
                <h3 className="font-medium mb-2">Search Results</h3>
                <div className="h-[280px] overflow-y-auto">
                  {songLoading ? (
                    <p className="text-center py-4">Loading...</p>
                  ) : songResults.length === 0 ? (
                    <p className="text-center py-4 text-gray-500">
                      No songs found
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {songResults.map((song) => (
                        <li
                          key={song.id}
                          className={`flex items-center gap-4 cursor-pointer p-2 rounded-lg ${
                            selectedSong && selectedSong.id === song.id
                              ? "bg-[#1e2424] text-white"
                              : "hover:bg-gray-100"
                          }`}
                          onClick={() => handleSongSelect(song)}
                        >
                          <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
                            <img
                              src={song.album.images[0].url}
                              alt={song.name}
                              className="w-full h-full object-cover rounded-md"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate">
                              {song.name}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {song.artists
                                .map((artist) => artist.name)
                                .join(", ")}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <Button
                type="button"
                disabled={!selectedSong || addLoading}
                onClick={addSongToFlow}
                className="w-full"
              >
                {addLoading ? "Loading..." : "Add to Flow"}
              </Button>
            </div>

            {/* Selected Songs Column */}
            <div className="flex flex-col">
              <div className="mb-4">
                <h3 className="font-medium mb-2">
                  Selected Songs ({songSelected.length})
                </h3>
              </div>
              <div className="border rounded-lg p-3 h-[334px] overflow-y-auto">
                {songSelected.length === 0 ? (
                  <p className="text-center py-10 text-gray-500">
                    No songs added yet. Search and add songs from the left
                    panel.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {songSelected.map((song) => (
                      <li
                        key={song.id}
                        className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-100"
                      >
                        <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
                          <img
                            src={song.album.images[0].url}
                            alt={song.name}
                            className="w-full h-full object-cover rounded-md"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate">{song.name}</p>
                          <p className="text-sm text-gray-500 truncate">
                            {song.artists
                              .map((artist) => artist.name)
                              .join(", ")}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-500 hover:text-red-500 hover:bg-red-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeSongFromFlow(song.id);
                          }}
                        >
                          <X size={18} />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={() => {
                setLoading(true);
                setOpenStage3(false);
                setOpenStage2(true);
                setLoading(false);
              }}
            >
              Back
            </Button>
            <Button
              type="button"
              disabled={songSelected.length === 0 || loading}
              onClick={async () => {
                setLoading(true);
                try {
                  // const preferences = await calculateFeatureWeights(
                  //   flowSongs,
                  //   getAudioFeatures
                  // );
                  setFlowPreference(examplePreference);
                } catch (error) {
                  console.log("Preference failed");
                }

                setOpenStage3(false);
                setOpenStage4(true);
                setLoading(false);
              }}
            >
              {loading ? "Loading..." : "Evaluate Flow Factors"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={openStage4} onOpenChange={setOpenStage4}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>4. Your Flow Factors *placehold</DialogTitle>
            <div className="grid grid-cols-4 justify-center mt-10 mb-5"></div>
          </DialogHeader>
          <PreferencePieChart preferences={examplePreference} />
          <DialogFooter>
            <Button
              onClick={() => {
                setLoading(true);
                setOpenStage4(false);
                setOpenStage3(true);
                setLoading(false);
              }}
            >
              Back
            </Button>
            <Button
              disabled={!flowTheme.trim() || loading}
              onClick={async () => {
                setLoading(true);
                try {
                  const flowData = makeFlow(
                    flowName,
                    flowTheme,
                    flowSongs,
                    flowPreference
                  );
                  console.log("Submitting flow:", flowData);
                  const docRef = await addDoc(
                    collection(db, "flows"),
                    flowData
                  );
                  console.log("Document written with ID:", docRef.id);
                  setSongSelected([]);
                  setFlowSongs([]);
                  setFlowName("");
                  setFlowTheme("");
                  setFlowPreference({});
                  setOpenStage4(false);
                  setLoading(false);
                } catch (error) {
                  console.error("Error adding document:", error);
                } finally {
                  setLoading(false);
                }
              }}
            >
              {loading ? "Loading..." : "Complete Flow"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
