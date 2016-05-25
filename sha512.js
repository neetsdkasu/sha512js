/* SHA512 for JavaScript
 *
 * The MIT License (MIT)
 * Copyright (c) 2016 Leonardone @ NEETSDKASU
 */

function SHA512JS() {
	
	function IntClass(sz) {
		// sz ... byte size (i.e. sz = 8 -> 64bit Int)
		var BITLEN = 16;
		var MASK = 0xFFFF;
		
		var INTBITS = sz << 3;
		var SHIFTMASK = INTBITS - 1;
		var LEN = INTBITS >> 4;
		var SIZE = LEN + 1;
		var ROTMASK = LEN - 1;
		
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
			for (j = s.length - 4; j >= 0 && i < LEN; j -= 4) { // BITLEN(16) -> 4 Hex-characters
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
			k = (s & SHIFTMASK) >> 4; // div BITLEN(16)
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
			k = (r & SHIFTMASK) >> 4; // div BITLEN(16)
			for (i = 0; i < LEN; i++) {
				v[i] = v1[(i + k) & ROTMASK];
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
				dest[j]     = v[i] >> 8; // BITLEN(16) -> 2 bytes
				dest[j + 1] = v[i] &  0xFF;
				j += 2;
			}
		};
	};
	
	var Int64 = new IntClass(8);
	
	this.getInt64 = function() { return Int64; };
	
	
	var _init_hash_value = [
		Int64.parse('6a09e667f3bcc908'),
		Int64.parse('bb67ae8584caa73b'),
		Int64.parse('3c6ef372fe94f82b'),
		Int64.parse('a54ff53a5f1d36f1'),
		Int64.parse('510e527fade682d1'),
		Int64.parse('9b05688c2b3e6c1f'),
		Int64.parse('1f83d9abfb41bd6b'),
		Int64.parse('5be0cd19137e2179')
	];
	
	var __init_hash = function(x) {
		var i, hash = x.hash;
		for (i = 0; i < 8; i++) {
			hash[i] = _init_hash_value[i]
		}
		x.a = hash[0];
		x.b = hash[1];
		x.c = hash[2];
		x.d = hash[3];
		x.e = hash[4];
		x.f = hash[5];
		x.g = hash[6];
		x.h = hash[7];
	};
	
	var __Ch = function(x, y, z) {
		return Int64.bwXor(
			Int64.bwAnd(x, y),
			Int64.bwAnd(Int64.bwNot(x), z)
			);
	};
	
	var __Maj = function(x, y, z) {
		return Int64.bwXor(
			Int64.bwAnd(x, y),
			Int64.bwXor(
				Int64.bwAnd(x, z),
				Int64.bwAnd(y, z)
			));
	};
	
	var __ucSigma0 = function(x) {
		return Int64.bwXor(
			Int64.shiftR(x, 28),
			Int64.bwXor(
				Int64.shiftR(x, 34),
				Int64.shiftR(x, 39)
			));
	};
	
	var __ucSigma1 = function(x) {
		return Int64.bwXor(
			Int64.shiftR(x, 14),
			Int64.bwXor(
				Int64.shiftR(x, 18),
				Int64.shiftR(x, 41)
			));
	};
	
	var __lcSigma0 = function(x) {
		return Int64.bwXor(
			Int64.shiftR(x, 1),
			Int64.bwXor(
				Int64.shiftR(x, 8),
				Int64.rotateR(x, 7)
			));
	};
	
	var __lcSigma1 = function(x) {
		return Int64.bwXor(
			Int64.shiftR(x, 19),
			Int64.bwXor(
				Int64.shiftR(x, 61),
				Int64.rotateR(x, 6)
			));
	};
	
	this.create = function() {
		var x = {
			"hash": new Array(8),
			"w": new Array(80)
		};
		__init_hash(x);
		return x;
	};
	
	this.init = __init_hash;
	
	var __calcWj = function(x, data, offset) {
		var j, w = x.w;
		for (j = 0; j < 16; j++) {
			w[j] = data[offset + j];
		}
		for (j = 16; j < 80; j++) {
			w[j] = Int64.add(
				__lcSigma1(w[j - 2]),
				Int64.add(
					w[j - 7],
					Int64.add(
						__lcSigma0(w[j - 15]),
						w[j - 16]
				)));
		}
	};
	
	var __update = function(x, data, offset) {
		
		__calcWj(x, data, offset);
	};
	
	this.update = __update;
	
	this.getHash = function(x, dest, offset) {
		// ByteArray
		var i;
		for (i = 0; i < 8; i++) {
			Int64.copyBytes(x.hash[i], dest, offset + i * 8);
		}
	};
}
