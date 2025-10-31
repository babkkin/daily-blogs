import React from 'react';
import { ExternalLink } from 'lucide-react';

export default function BlogWebsiteDisplay() {
  return (
    <div className="relative min-h-[600px] p-8 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl">
      {/* Main large preview - slightly tilted */}
      <div className="relative group w-[70%] mx-auto transform -rotate-1 hover:rotate-0 transition-transform duration-300 z-10">
        <div className="relative bg-slate-200 rounded-b-xl overflow-hidden shadow-2xl">
          <img
            src="/Prev1.png"
            alt="Blog preview"
            className="w-full h-auto"
          />
          
        </div>
      </div>

      {/* Small scattered images */}
      {/* Top left image */}
      <div className="absolute top-8 left-4 w-48 transform -rotate-6 hover:rotate-0 hover:scale-110 transition-all duration-300 group cursor-pointer z-20 shadow-xl hover:shadow-2xl">
        <div className="relative bg-slate-200 rounded-lg overflow-hidden">
          <img
            src="/Prev2.png"
            alt="Blog preview 2"
            className="w-full h-auto object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </div>

      {/* Top right image */}
      <div className="absolute top-12 right-8 w-40 transform rotate-12 hover:rotate-0 hover:scale-110 transition-all duration-300 group cursor-pointer z-20 shadow-xl hover:shadow-2xl">
        <div className="relative bg-slate-200 rounded-lg overflow-hidden aspect-square">
          <img
            src="/Prev3.png"
            alt="Blog preview 3"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </div>

      {/* Bottom right image */}
      <div className="absolute bottom-8 right-12 w-44 transform rotate-3 hover:rotate-0 hover:scale-110 transition-all duration-300 group cursor-pointer z-20 shadow-xl hover:shadow-2xl">
        <div className="relative bg-slate-200 rounded-lg overflow-hidden">
          <img
            src="/Prev4.png"
            alt="Blog preview 4"
            className="w-full h-auto object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </div>

      {/* Bottom left image */}
      <div className="absolute bottom-12 left-8 w-36 transform -rotate-12 hover:rotate-0 hover:scale-110 transition-all duration-300 group cursor-pointer z-20 shadow-xl hover:shadow-2xl">
        <div className="relative bg-slate-200 rounded-lg overflow-hidden aspect-square">
          <img
            src="/Prev5.png"
            alt="Blog preview 5"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </div>
    </div>
  );
}