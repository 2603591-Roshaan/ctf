/**
 * CyberCTF - Built-in Cyber Toolbelt
 * Decoder, Encoder, Hash Identifier & Generator for beginners
 */
(function(window) {
  'use strict';

  const CyberTools = {
    // Base64
    base64Encode: (str) => {
      try {
        return btoa(unescape(encodeURIComponent(str)));
      } catch (e) {
        return "Error encoding: " + e.message;
      }
    },
    base64Decode: (str) => {
      try {
        // Clean whitespace and handle URL-safe base64
        let clean = str.trim().replace(/-/g, '+').replace(/_/g, '/');
        while (clean.length % 4) clean += '=';
        return decodeURIComponent(escape(atob(clean)));
      } catch (e) {
        return "Error decoding Base64 (invalid characters or padding): " + e.message;
      }
    },

    // Hex
    hexEncode: (str) => {
      try {
        return Array.from(new TextEncoder().encode(str))
          .map(b => b.toString(16).padStart(2, '0'))
          .join(' ');
      } catch (e) {
        return "Error: " + e.message;
      }
    },
    hexDecode: (hex) => {
      try {
        const clean = hex.replace(/[^0-9a-fA-F]/g, '');
        if (clean.length % 2 !== 0) return "Error: Hex string length must be even.";
        const bytes = new Uint8Array(clean.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
        return new TextDecoder().decode(bytes);
      } catch (e) {
        return "Error decoding Hex: " + e.message;
      }
    },

    // Binary
    binaryEncode: (str) => {
      try {
        return Array.from(new TextEncoder().encode(str))
          .map(b => b.toString(2).padStart(8, '0'))
          .join(' ');
      } catch (e) {
        return "Error: " + e.message;
      }
    },
    binaryDecode: (bin) => {
      try {
        const parts = bin.trim().split(/\s+/).filter(Boolean);
        const bytes = parts.map(p => {
          if (!/^[01]{1,8}$/.test(p)) throw new Error("Invalid binary byte: " + p);
          return parseInt(p, 2);
        });
        return new TextDecoder().decode(new Uint8Array(bytes));
      } catch (e) {
        return "Error decoding Binary: " + e.message;
      }
    },

    // ROT / Caesar Cipher
    rotN: (str, n = 13) => {
      n = ((n % 26) + 26) % 26;
      return str.replace(/[a-zA-Z]/g, (char) => {
        const base = char <= 'Z' ? 65 : 97;
        return String.fromCharCode(((char.charCodeAt(0) - base + n) % 26) + base);
      });
    },

    // URL Encode / Decode
    urlEncode: (str) => encodeURIComponent(str),
    urlDecode: (str) => {
      try {
        return decodeURIComponent(str.replace(/\+/g, ' '));
      } catch(e) {
        return "Error: " + e.message;
      }
    },

    // Single Byte XOR
    xorSingleByte: (hexStr, keyByte) => {
      try {
        const clean = hexStr.replace(/[^0-9a-fA-F]/g, '');
        if (clean.length % 2 !== 0) return "Hex length must be even";
        const bytes = clean.match(/.{1,2}/g).map(b => parseInt(b, 16));
        const res = bytes.map(b => b ^ keyByte);
        return new TextDecoder('utf-8', { fatal: false }).decode(new Uint8Array(res));
      } catch (e) {
        return "Error: " + e.message;
      }
    },

    // Cryptographic Hashes (SHA-256, SHA-1, MD5)
    async sha256(text) {
      const msgBuffer = new TextEncoder().encode(text);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    },
    async sha1(text) {
      const msgBuffer = new TextEncoder().encode(text);
      const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
      return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    },

    // Identify what a string might be
    identify: (str) => {
      const s = str.trim();
      if (!s) return "Enter text above to analyze.";
      const results = [];

      // Check Base64
      if (/^[A-Za-z0-9+/]+={0,2}$/.test(s) && s.length % 4 === 0 && s.length >= 4) {
        results.push("✨ Likely <b>Base64</b> encoding");
      }
      // Check Hex
      const hexClean = s.replace(/\s+/g, '');
      if (/^[0-9a-fA-F]+$/.test(hexClean) && hexClean.length % 2 === 0) {
        results.push(`✨ Likely <b>Hexadecimal</b> data (${hexClean.length / 2} bytes)`);
        if (hexClean.length === 32) results.push("🎯 Exact length of an <b>MD5 hash</b> (32 hex characters)");
        if (hexClean.length === 40) results.push("🎯 Exact length of a <b>SHA-1 hash</b> (40 hex characters)");
        if (hexClean.length === 64) results.push("🎯 Exact length of a <b>SHA-256 hash</b> (64 hex characters)");
      }
      // Check Binary
      if (/^[01\s]+$/.test(s) && s.replace(/\s/g, '').length >= 8) {
        results.push("✨ Likely <b>Binary (0s and 1s)</b> stream");
      }
      // Check JWT
      if (/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]*$/.test(s)) {
        results.push("✨ Format matches a <b>JSON Web Token (JWT)</b> (3 dot-separated parts)");
      }
      // Check URL encoding
      if (/%[0-9a-fA-F]{2}/.test(s)) {
        results.push("✨ Contains <b>URL percent-encoded</b> sequences (like %20, %3D)");
      }
      // Flag format
      if (/flag\{.*\}/i.test(s)) {
        results.push("🚩 Looks like a <b>CTF Flag</b>!");
      }

      if (results.length === 0) {
        return "Uncertain format. Could be standard plain text, custom cipher, or raw ASCII.";
      }
      return results.join("<br>");
    }
  };

  window.CyberTools = CyberTools;
})(window);
