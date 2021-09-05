cmake_minimum_required(VERSION 3.20)
project(clox1 C)

set(CMAKE_C_STANDARD 99)

add_executable(clox1 main.c compiler.c compiler.h chunk.c chunk.h common.h debug.c debug.h memory.c memory.h scanner.c scanner.h value.c value.h vm.c vm.c object.h object.c table.h table.c)
