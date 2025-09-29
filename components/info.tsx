'use client'

import { useState } from "react"
import { Button } from "./ui/button"
import { InfoIcon, X } from "lucide-react"
import { ScrollArea } from "./ui/scroll-area"
import Image from "next/image"
import Link from "next/link"

export default function Info() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      {/* Toggle Button */}
      <Button
        hidden={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className="m-2 relative overflow-hidden bg-black/20 backdrop-blur-xl border border-white/20 text-white hover:bg-black/30 transition-all duration-500 shadow-xl hover:shadow-2xl hover:scale-105 rounded-2xl px-6 py-3 group"
      >
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative flex items-center gap-2">
          <InfoIcon className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
          <span className="font-medium">Show Insights</span>
        </div>
      </Button>

      {/* Black & White Glass Info Card */}
      {isOpen && (
        <div className="left-0 h-screen over w-96 z-50 animate-in slide-in-from-top-5 duration-500">
          <div className="h-screen">
            {/* Glass morphism layer */}
            <div className="absolute inset-0 backdrop-blur-2xl bg-black/40 border border-white/20"></div>

            {/* Content container */}
            <div className="relative h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 className="text-xl font-bold text-white">
                  Mars 2020: Perseverance Mission
                </h2>
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="ghost"
                  size="sm"
                  className="text-white/70 hover:text-white hover:bg-white/10 rounded-full p-2 transition-all duration-300"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Content */}
              <ScrollArea className="h-full overflow-hidden">
                <div className="flex-1 p-6 space-y-6 overflow-y-auto min-h-0">

                  {/* Perseverance Rover Info */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white/90 flex items-center gap-2">
                      <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                      Perseverance Rover
                    </h3>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <p className="text-white/80 text-sm leading-relaxed">
                        The rover's primary goal is to <span className="font-bold">seek signs of ancient microbial life</span> (biosignatures) and collect core samples of Martian rock and regolith for potential pickup by a future <span className="font-bold">Mars Sample Return</span> mission.
                        <br /><br />
                        <span className="font-bold">Launch:</span> July 30, 2020 • <span className="font-bold">Landing:</span> Feb. 18, 2021
                      </p>
                      <Image src={'/rover-1.webp'} height={200} width={500} alt="rover" />
                    </div>
                  </div>

                  {/* Jezero Crater Landing Site */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white/90 flex items-center gap-2">
                      <div className="w-2 h-2 bg-200/60 rounded-full"></div>
                      Jezero Crater Landing Site
                    </h3>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <p className="text-white/80 text-sm leading-relaxed">
                        Jezero Crater was chosen because scientists believe it was once flooded with water, containing an <span className="font-bold">ancient river delta</span>. It holds <span className="font-bold">carbonate minerals</span> and <span className="font-bold">clay deposits</span> that are ideal for preserving evidence of past microbial life.
                      </p>
                    <Image src={'/crater.webp'} height={400} width={400} alt="jazero crater"/>
                    </div>
                  </div>

                  {/* Key Science Objectives */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white/90 flex items-center gap-2">
                      <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                      Four Science Objectives
                    </h3>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <ul className="list-disc list-inside text-white/80 text-sm leading-relaxed space-y-1 ml-4">
                        <li>Study Mars' Past Habitability.</li>
                        <li>Seek Signs of Past Microbial Life.</li>
                        <li>Collect and Cache Martian Samples.</li>
                        <li>Prepare for Future Human Missions (testing MOXIE).</li>
                      </ul>
                    </div>
                  </div>

                  {/* Ingenuity Mars Helicopter */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white/90 flex items-center gap-2">
                      <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                      Ingenuity Mars Helicopter
                    </h3>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <p className="text-white/80 text-sm leading-relaxed">
                        Strapped to Perseverance's belly, Ingenuity was a technology demonstration that successfully achieved the <span className="font-bold">first powered, controlled flight on another planet</span>, completing 72 historic flights.
                      </p>
                    </div>
                  </div>
                    <Link className="text-blue-400 underline text-sm" href="https://science.nasa.gov/mission/mars-2020-perseverance/" target="_blank">Learn More</Link>

                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}