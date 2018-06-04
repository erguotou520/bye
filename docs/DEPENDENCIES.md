# 构建后的ss-local依赖关系

## Windows

使用vs自带的`dumpbin.exe`命令`dumpbin.exe /dependents /path/to/ss-local.exe`查看，结果如下

```
File Type: EXECUTABLE IMAGE

  Image has the following dependencies:

    ADVAPI32.dll
    KERNEL32.dll
    msvcrt.dll
    libwinpthread-1.dll
    USER32.dll
    WS2_32.dll
    libssp-0.dll
    LIBEAY32.dll
    libpcre-1.dll

  Summary

        1000 .CRT
        7000 .bss
        1000 .data
        E000 .debug_abbrev
        2000 .debug_aranges
        B000 .debug_frame
       F5000 .debug_info
       17000 .debug_line
       6F000 .debug_loc
       17000 .debug_ranges
        4000 .debug_str
        2000 .idata
        3000 .pdata
        7000 .rdata
        1000 .rsrc
       36000 .text
        1000 .tls
        3000 .xdata
```
其中需要拷贝出来的`dll`文件在目录`c:/msys64/mingw64/bin/`下

## Linux

使用`ldd ss-local`命令查看，结果为
```
linux-vdso.so.1 =>  (0x00007fffa4134000)
libcrypto.so.1.0.0 => /lib/x86_64-linux-gnu/libcrypto.so.1.0.0 (0x00007f9268662000)
libm.so.6 => /lib/x86_64-linux-gnu/libm.so.6 (0x00007f9268359000)
libpcre.so.3 => /lib/x86_64-linux-gnu/libpcre.so.3 (0x00007f92680e8000)
libz.so.1 => /lib/x86_64-linux-gnu/libz.so.1 (0x00007f9267ece000)
libdl.so.2 => /lib/x86_64-linux-gnu/libdl.so.2 (0x00007f9267cca000)
libpthread.so.0 => /lib/x86_64-linux-gnu/libpthread.so.0 (0x00007f9267aac000)
libc.so.6 => /lib/x86_64-linux-gnu/libc.so.6 (0x00007f92676e2000)
/lib64/ld-linux-x86-64.so.2 (0x0000558a9edb9000)
```

## Mac

使用命令`otool -L ss-local`查看，依赖`libcrypto.1.0.0.dylib`和`libpcre.1.dylib`，使用命令修改绝对路径为相对路径

```bash
install_name_tool -change /usr/local/opt/openssl/lib/libcrypto.1.0.0.dylib @executable_path/libcrypto.1.0.0.dylib src/ss-local
install_name_tool -change /usr/local/opt/pcre/lib/libpcre.1.dylib @executable_path/libpcre.1.dylib src/ss-local
```
