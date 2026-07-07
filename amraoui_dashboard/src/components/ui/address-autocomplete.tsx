'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { MapPin, Loader2 } from 'lucide-react';

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (address: string, zip?: string, city?: string) => void;
  placeholder?: string;
  className?: string;
  iconClassName?: string;
}

export function AddressAutocomplete({ 
  value, 
  onChange, 
  onSelect,
  placeholder = "Enter address",
  className = "",
  iconClassName = ""
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!value || value.length < 3 || !showSuggestions) {
        setSuggestions([]);
        return;
      }

      setIsSearching(true);
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&addressdetails=1&limit=5`);
        const data = await res.json();
        setSuggestions(data);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 500);
    return () => clearTimeout(timeoutId);
  }, [value, showSuggestions]);

  const formatAddress = (item: any) => {
    if (!item.address) return item.display_name;
    
    const addr = item.address;
    const parts = [
      addr.amenity || addr.building || addr.shop || addr.office || addr.leisure || addr.tourism,
      addr.house_number,
      addr.road || addr.pedestrian || addr.path,
      addr.neighbourhood || addr.suburb || addr.quarter,
      addr.city || addr.town || addr.village || addr.municipality,
      addr.state || addr.province,
      addr.country
    ].filter(Boolean);
    
    // Remove duplicates (e.g., city and municipality might be the same)
    const uniqueParts = Array.from(new Set(parts));

    return uniqueParts.join(', ') || item.display_name;
  };

  const handleSelect = (suggestion: any) => {
    const formattedAddress = formatAddress(suggestion);
    const zip = suggestion.address?.postcode || '';
    const city = suggestion.address?.city || suggestion.address?.town || suggestion.address?.village || '';
    
    onChange(formattedAddress);
    if (onSelect) {
      onSelect(formattedAddress, zip, city);
    }
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <MapPin className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 ${iconClassName}`} />
      <Input
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => {
          if (value.length >= 3) setShowSuggestions(true);
        }}
        placeholder={placeholder}
        className={className}
      />
      {isSearching && (
        <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-slate-400" />
      )}
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-100 rounded-xl shadow-lg overflow-hidden max-h-60 overflow-y-auto">
          {suggestions.map((item, index) => (
            <div 
              key={item.place_id || index}
              className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 transition-colors flex items-start gap-3"
              onClick={() => handleSelect(item)}
            >
              <MapPin className="h-4 w-4 text-brand-blue shrink-0 mt-0.5" />
              <p className="text-sm text-slate-700 line-clamp-2">{formatAddress(item)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
