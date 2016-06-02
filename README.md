SHA512 for JavaScript
=====================


###Example1


```html
<script type="text/javascript" src="sha512.js"></script>
<script type="text/javascript">
	
	var data = [ 0x61, 0x62, 0x63, 0x64 ]; // Array of 8bit Integers
	
	var cnt = SHA512JS.create();
	
	SHA512JS.init(cnt);
	
	SHA512JS.updateByByteArray(cnt, data, 0, data.length);
	
	SHA512JS.finish(cnt);
	
	var hash = SHA512JS.toHexString(cnt); // d8022f2060ad6efd297ab73dcc5355c9b214054b0d1776a136a669d26a7d3b14f73aa0d0ebff19ee333368f0164b6419a96da49e3e481753e7e96b716bdccb6f
	
</script>
```

###Example2
String 'abcd' == ByteArray [ 0x61, 0x62, 0x63, 0x64 ].   

```html
<script type="text/javascript" src="sha512.js"></script>
<script type="text/javascript">
	
	var data = 'abcd'; // String (use lower 8bit of character code)
	
	var cnt = SHA512JS.create();
	
	SHA512JS.init(cnt);
	
	SHA512JS.updateByByteString(cnt, data, 0, data.length);
	
	SHA512JS.finish(cnt);
	
	var hash = SHA512JS.toHexString(cnt); // d8022f2060ad6efd297ab73dcc5355c9b214054b0d1776a136a669d26a7d3b14f73aa0d0ebff19ee333368f0164b6419a96da49e3e481753e7e96b716bdccb6f
	
</script>
```


###Example3
Be careful   
NumberArray(16) [ 0x6162, 0x6364 ] == ByteArray [ 0x61, 0x62, 0x63, 0x64 ].  
NumberArray(16) [ 0x6100, 0x6300 ] == ByteArray [ 0x61, 0x00, 0x63, 0x00 ].  
NumberArray(16) [ 0x62, 0x64 ] == ByteArray [ 0x00, 0x62, 0x00, 0x64 ].  


```html
<script type="text/javascript" src="sha512.js"></script>
<script type="text/javascript">
	
	var data = [ 0x6162, 0x6364 ]; // Array of 16bit Integers
	
	var cnt = SHA512JS.create();
	
	SHA512JS.init(cnt);
	
	SHA512JS.updateByNumberArray(cnt, data, 0, data.length, 16);
	
	SHA512JS.finish(cnt);
	
	var hash = SHA512JS.toHexString(cnt); // d8022f2060ad6efd297ab73dcc5355c9b214054b0d1776a136a669d26a7d3b14f73aa0d0ebff19ee333368f0164b6419a96da49e3e481753e7e96b716bdccb6f
	
</script>
```


###Example4
Be careful   
NumberArray(32) [ 0x61626364 ] == ByteArray [ 0x61, 0x62, 0x63, 0x64 ].  
NumberArray(32) [ 0x61626300 ] == ByteArray [ 0x61, 0x62, 0x63, 0x00 ].  
NumberArray(32) [ 0x626364 ] == ByteArray [ 0x00, 0x62, 0x63, 0x64 ].  

```html
<script type="text/javascript" src="sha512.js"></script>
<script type="text/javascript">
	
	var data = [ 0x61626364 ]; // Array of 32bit Integers
	
	var cnt = SHA512JS.create();
	
	SHA512JS.init(cnt);
	
	SHA512JS.updateByNumberArray(cnt, data, 0, data.length, 32);
	
	SHA512JS.finish(cnt);
	
	var hash = SHA512JS.toHexString(cnt); // d8022f2060ad6efd297ab73dcc5355c9b214054b0d1776a136a669d26a7d3b14f73aa0d0ebff19ee333368f0164b6419a96da49e3e481753e7e96b716bdccb6f
	
</script>
```


###Reference

```
SHA512JS.create()
-----------------------------------------------------------	
	 
	 return : container
	 
	 create a container to calculate SHA512 hash  




SHA512JS.init(cnt)
-----------------------------------------------------------	
	cnt : container
	
	return : undefined (nothing)
	
	initialize container




SHA512JS.updateByByteArray(cnt, bytearray, offset, length)
-----------------------------------------------------------	
	cnt       : container
	bytearray : 8bit integer array
	offset    : array index offset
	length    : using array data count
	
	return : undefined (nothing)
	
	calculate SHA512 hash by byte array data




SHA512JS.updateByByteString(cnt, string, offset, length)
-----------------------------------------------------------	
	cnt       : container
	bytearray : string (use lower 8bit of character code)
	offset    : string index offset
	length    : using character count
	
	return : undefined (nothing)
	
	calculate SHA512 hash by string




SHA512JS.updateByNumberArray(cnt, numarray, offset, length, bits)
-----------------------------------------------------------	
	cnt      : container
	numarray : integer array (16bit integer or 32bit integer)
	offset   : array index offset
	length   : using array data count
	bits     : integer bits (16 or 32)
	
	return : undefined (nothing)
	
	calculate SHA512 hash by integer array




SHA52JS.finish(cnt)
-----------------------------------------------------------	
	cnt       : container
	
	return : undefined (nothing)
	
	you must call this method when reached to end of all data to update
	this method writes finite flag, zero and bits count, finally calculate hash




SHA512JS.getHash(cnt, bytearry, offset)
-----------------------------------------------------------	
	cnt       : container
	bytearray : array to copy 64 8bit-integers of hash
	offset    : array index offset
	
	return : undefined (nothing)
	
	copy SHA512 hash data(64bytes) to array



SHA512JS.toHexString(cnt)
-----------------------------------------------------------	
	cnt       : container
	
	return : hex-number-character string (length 128)
	
	make SHA512 hash string (convert each bytes to 2-hex-number-charecter string[0-9a-f])




SHA512JS.toByteString(cnt)
-----------------------------------------------------------	
	cnt       : container
	
	return : string (length 64)
	
	make SHA512 data byte-string (convert each bytes to character code[0-255])
	be careful, this string includes unvisible character code



````