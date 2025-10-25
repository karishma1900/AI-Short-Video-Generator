"use client";

import { useEffect, useState ,useContext} from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import "../App.css";
import { Button } from '@/components/ui/button'
import Image from "next/image";

function Header() {
  const [stars, setStars] = useState([]);
  const { isSignedIn } = useUser(); // Detect if the user is signed in

  useEffect(() => {
    const newStars = Array.from({ length: 150 }, () => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 3}s`,
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="app2">
      <div className="gradient-orb-1"></div>
      <div className="gradient-orb-2"></div>
      <div className="gradient-orb-3"></div>

      <div className="stars">
        {stars.map((star, i) => (
          <div
            key={i}
            className="star"
            style={{
              top: star.top,
              left: star.left,
              animationDelay: star.delay,
            }}
          />
        ))}
      </div>

      <nav className="navbar">
         <div className='flex gap-3 items-center'>
        <Image src={'/logo.png'} alt="logo" width={50} height={50} />
        <h2 className='font-bold text-white text-xl'>Ai Short Video</h2>
        </div>
        <ul className="nav-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#solutions">Solutions</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#resources">Resources</a></li>
        </ul>
        <div className="nav-buttons">
          {/* Show UserButton if signed in, else show SignIn and Get Started buttons */}
          {isSignedIn ? (
            <>
           
              <UserButton afterSignOutUrl="/" />
            
              <a href="/dashboard">
                <button className="btn-primary">Dashboard</button>
              </a>
            </>
          ) : (
            <>
              <a href="/sign-in">
                <button className="btn-secondary">Sign In</button>
              </a>
              <a href="/sign-up">
                <button className="btn-primary">
                  <span>Get Started</span>
                </button>
              </a>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Header;
