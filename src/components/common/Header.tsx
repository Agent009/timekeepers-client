"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import "@styles/globals.css";
import CX_Logo_Light from "@images/logos/cx-logo-light.svg";
import Linkedin_Icon from "@components/icons/Linkedin_Icon";

export function Header() {
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
              <li>
                <Link href="#">
                  <p className="text-black/80">Computer Vision</p>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <p className="text-black/80">Stable Diffusion</p>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <p className="text-black/80">Text Generation</p>
                </Link>
              </li>
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
