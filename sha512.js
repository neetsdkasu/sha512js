/* SHA512 for JavaScript
 *
 * The MIT License (MIT)
 * Copyright (c) 2016 Leonardone @ NEETSDKASU
 */

function SHA512JS() {
	
	var Int64 = new function() {
		
		var SIZE = 5;
		var LEN = 4;
		var BITLEN = 16;
		var MASK = 0xFFFF;
		
		this.valueOf = function(n) {
			// n: Number(Integer)
			var i, v = new Array(SIZE);
			for (i = 0; i < SIZE; i++) {
				v[i] = n & MASK;
				n >>= BITLEN;
			}
			return v;
		};
		
		this.parse = function(s) {
			// s: Hex String
			var i, v = new Array(SIZE), j;
			i = 0;
			for (j = s.length - 4; j >= 0 && i < LEN; j -= 4) {
				v[i] = parseInt('0x' + s.substring(j, j + 4));
				i++;
			}
			if (j > -4 && i < LEN) {
				v[i] = parseInt('0x' + s.substring(0, j + 4));
				i++;
			}
			for (; i < SIZE; i++) {
				v[i] = 0;
			}
			return v;
		};
		
		this.add = function(v1, v2) {
			var i, v = new Array(SIZE), t = 0;
			for (i = 0; i < LEN; i++) {
				t += v1[i] + v2[i];
				v[i] = t & MASK;
				t >>= BITLEN;
			}
			v[LEN] = 0;
			return v;
		};
		
		this.bwXor = function(v1, v2) {
			var i, v = new Array(SIZE);
			for (i = 0; i < LEN; i++) {
				v[i] = v1[i] ^ v2[i];
			}
			v[LEN] = 0;
			return v;
		};
		
		this.bwAnd = function(v1, v2) {
			var i, v = new Array(SIZE);
			for (i = 0; i < LEN; i++) {
				v[i] = v1[i] & v2[i];
			}
			v[LEN] = 0;
			return v;
		};
		
		this.bwOr  = function(v1, v2) {
			var i, v = new Array(SIZE);
			for (i = 0; i < LEN; i++) {
				v[i] = v1[i] | v2[i];
			}
			v[LEN] = 0;
			return v;
		};
		
		this.bwNot = function(v1) {
			var i, v = new Array(SIZE);
			for (i = 0; i < LEN; i++) {
				v[i] = v1[i] ^ MASK;
			}
			v[LEN] = 0;
			return v;
		};
		
		this.shiftR = function(v1, s) {
			var i, v = new Array(SIZE), k, m, p;
			k = (s & 63) >> 4; // div BITLEN(16)
			for (i = 0; i + k < LEN; i++) {
				v[i] = v1[i + k];
			}
			s &= MASK;
			m = (1 << s) - 1; // mask
			p = BITLEN - s;   // shiftL
			for (i = 0; i < LEN; i++) {
				v[i] >>= s;
				v[i] |= (v[i + 1] & m) << p;
			}
			return v;
		};
		
		this.rotateR = function(v1, r) {
			var i, v = new Array(SIZE), k, m, p;
			k = (r & 63) >> 4; // div BITLEN(16)
			for (i = 0; i < LEN; i++) {
				v[i] = v1[(i + k) & 3]; // % LEN(4)
			}
			r &= MASK;
			m = (1 << r) - 1;  // mask
			p = BITLEN - r;    // shiftL
			v[LEN] = v[0] & m; // lowest bits
			for (i = 0; i < LEN; i++) {
				v[i] >>= r;
				v[i] |= (v[i + 1] & m) << p;
			}
			v[LEN] = 0;
			return v;
		};
		
		this.toHex = function(v) {
			var i, c, s = '';
			for (i = LEN - 1; i >= 0; i--) {
				c = v[i].toString(16);
				while (c.length < 4) { c = '0' + c; } // 4 hex-characters at BITLEN(16)
				s += c;
			}
			return s;
		};
		
		this.copyBytes = function(v, dest, offset) {
			var i, j = offset;
			for (i = LEN - 1; i >= 0; i--) {
				dest[j]     = v[i] >> 8; // BITLEN(16)
				dest[j + 1] = v[i] &  0xFF;
				j += 2;
			}
		};
	};
	
	this.getInt64 = function() { return Int64; };
	
}
