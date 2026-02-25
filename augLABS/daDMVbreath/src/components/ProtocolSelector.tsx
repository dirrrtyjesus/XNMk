/**
 * da DMV breath — Protocol Selector Component
 * Dropdown for choosing breathing protocol
 */

import { useState, useRef, useEffect } from 'react';
import type { BreathProtocol } from '../types/breath';
import { PROTOCOLS, getCycleDuration, formatTime } from '../features/breath/protocols';

interface ProtocolSelectorProps {
    currentProtocol: BreathProtocol;
    onSelect: (protocol: BreathProtocol) => void;
    disabled?: boolean;
}

export function ProtocolSelector({
    currentProtocol,
    onSelect,
    disabled
}: ProtocolSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (protocol: BreathProtocol) => {
        onSelect(protocol);
        setIsOpen(false);
    };

    return (
        <div className={`dropdown ${isOpen ? 'open' : ''}`} ref={dropdownRef}>
            <button
                className="protocol-selector"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
            >
                <span className="protocol-selector-label">Protocol:</span>
                <span className="protocol-selector-value">{currentProtocol.name}</span>
                <span className="protocol-selector-icon">▼</span>
            </button>

            <div className="dropdown-menu">
                {PROTOCOLS.map(protocol => {
                    const cycleDuration = getCycleDuration(protocol);
                    const totalDuration = cycleDuration * protocol.totalCycles;

                    return (
                        <div
                            key={protocol.id}
                            className={`dropdown-item ${protocol.id === currentProtocol.id ? 'active' : ''}`}
                            onClick={() => handleSelect(protocol)}
                        >
                            <div className="dropdown-item-title">{protocol.name}</div>
                            <div className="dropdown-item-desc">
                                {protocol.description}
                                <br />
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                                    {protocol.totalCycles} cycles • ~{formatTime(totalDuration)}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
