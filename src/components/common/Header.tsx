"use client";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CircularProgress, { circularProgressClasses } from "@mui/material/CircularProgress";
// import "@styles/globals.css";
import Linkedin_Icon from "@components/icons/Linkedin_Icon";
import { constants, getApiUrl, getUrl } from "@lib/index";
import { AppContext } from "@lib/providers/provider";
import { LayerDocument } from "@models/layer";
import CX_Logo_Light from "@images/logos/cx-logo-light.svg";

export function Header() {
  const { layer, setLayer } = useContext(AppContext);
  const router = useRouter();
  const { status } = useSession();
  const [layers, setLayers] = useState<LayerDocument[]>([]);
  // Mutable ref object that persists for the full lifetime of the component.
  // It does not cause re-renders when its value changes, and hence solves the infinite re-renders issue.
  const isFetchingRef = useRef(false);
  console.log("Header -> status", status, "layer", layer, "layers", layers);

  const fetchLayers = useCallback(async () => {
    if (isFetchingRef.current) return; // Prevent multiple fetches
    console.log("Header -> fetchData");
    isFetchingRef.current = true; // Set fetching status to true

    try {
      // "/api/?startDate=2023-10-01&endDate=2023-10-02"
      const response = await fetch(getApiUrl(constants.routes.api.getLayers));
      const result = await response.json();
      // console.log("Header -> fetchLayers -> result", result);

      if (!result?.error) {
        setLayers(result);

        if (result.length === 1) {
          setLayer(result[0]);
        }
      }
    } catch (error) {
      console.error("Header -> fetchLayers -> error", error);
    } finally {
      isFetchingRef.current = false; // Reset fetching status
    }
  }, []); // No dependencies, so it won't be recreated

  // Fetch the initial data
  useEffect(() => {
    console.log("Header -> useEffect -> init -> fetchData");
    const fetchAndSet = async () => {
      try {
        await fetchLayers();
      } catch (error) {
        console.error("Header -> useEffect -> init -> fetchAndSet -> error", error);
      }
    };

    // Initial fetch
    fetchAndSet().then(() => console.log("Header -> useEffect -> init -> fetchAndSet success"));
  }, [fetchLayers]);

  const showSession = () => {
    if (status === "authenticated") {
      return (
        <button
          className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          onClick={() => {
            signOut({ redirect: false }).then(() => {
              router.push("/");
            });
          }}
        >
          Sign Out
        </button>
      );
    } else if (status === "loading") {
      return <span className="text-[#888] text-sm mt-7">Loading...</span>;
    } else {
      return (
        <Link
          href={getUrl(constants.routes.login)}
          className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          Sign In
        </Link>
      );
    }
  };

  return (
    <>
      <header className="px-60">
        <div className="Header flex justify-between items-center py-8">
          {/* Left Side */}
          <div className="flex items-center">
            <Link href="/">
              <Image priority src={CX_Logo_Light} alt="connextar-logo" className="mr-20" width={230} />
            </Link>
          </div>

          <nav>
            <ul className="flex gap-10 py-5 px-3 bg-white font-bold">
              {layers.length > 0 ? (
                layers.map((layerItem, index) => (
                  <li
                    key={"layer-" + layerItem._id || index}
                    className={`px-3 py-1 cursor-pointer ${layer?._id === layerItem._id ? "bg-gray-200" : "hover:bg-gray-100"}`}
                    onClick={() => setLayer(layerItem)}
                  >
                    <p>{layerItem.name}</p>
                  </li>
                ))
              ) : (
                <CircularProgress
                  variant="indeterminate"
                  disableShrink
                  sx={(theme) => ({
                    color: "#1a90ff",
                    animationDuration: "550ms",
                    position: "absolute",
                    left: 0,
                    [`& .${circularProgressClasses.circle}`]: {
                      strokeLinecap: "round",
                    },
                    ...theme.applyStyles("dark", {
                      color: "#308fe8",
                    }),
                  })}
                  size={40}
                  thickness={4}
                />
              )}
              <li>{showSession()}</li>
            </ul>
          </nav>

          {/* Right Side */}
          <div className="flex items-center">
            <div className="flex items-center">
              <div className="px-3 py-2 group/linkedin">
                <Link href="https://www.linkedin.com/in/amir1988/" className="group/link" target={"_blank"}>
                  <Linkedin_Icon width={26} height={24} className="header-social-icons" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
