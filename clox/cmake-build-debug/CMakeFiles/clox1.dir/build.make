# CMAKE generated file: DO NOT EDIT!
# Generated by "Unix Makefiles" Generator, CMake Version 3.20

# Delete rule output on recipe failure.
.DELETE_ON_ERROR:

#=============================================================================
# Special targets provided by cmake.

# Disable implicit rules so canonical targets will work.
.SUFFIXES:

# Disable VCS-based implicit rules.
% : %,v

# Disable VCS-based implicit rules.
% : RCS/%

# Disable VCS-based implicit rules.
% : RCS/%,v

# Disable VCS-based implicit rules.
% : SCCS/s.%

# Disable VCS-based implicit rules.
% : s.%

.SUFFIXES: .hpux_make_needs_suffix_list

# Command-line flag to silence nested $(MAKE).
$(VERBOSE)MAKESILENT = -s

#Suppress display of executed commands.
$(VERBOSE).SILENT:

# A target that is always out of date.
cmake_force:
.PHONY : cmake_force

#=============================================================================
# Set environment variables for the build.

# The shell in which to execute make rules.
SHELL = /bin/sh

# The CMake executable.
CMAKE_COMMAND = /Applications/CLion.app/Contents/bin/cmake/mac/bin/cmake

# The command to remove a file.
RM = /Applications/CLion.app/Contents/bin/cmake/mac/bin/cmake -E rm -f

# Escaping for special characters.
EQUALS = =

# The top-level source directory on which CMake was run.
CMAKE_SOURCE_DIR = /Users/penghui/coding/jsjs/clox

# The top-level build directory on which CMake was run.
CMAKE_BINARY_DIR = /Users/penghui/coding/jsjs/clox/cmake-build-debug

# Include any dependencies generated for this target.
include CMakeFiles/clox1.dir/depend.make
# Include the progress variables for this target.
include CMakeFiles/clox1.dir/progress.make

# Include the compile flags for this target's objects.
include CMakeFiles/clox1.dir/flags.make

CMakeFiles/clox1.dir/main.c.o: CMakeFiles/clox1.dir/flags.make
CMakeFiles/clox1.dir/main.c.o: ../main.c
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/Users/penghui/coding/jsjs/clox/cmake-build-debug/CMakeFiles --progress-num=$(CMAKE_PROGRESS_1) "Building C object CMakeFiles/clox1.dir/main.c.o"
	/Library/Developer/CommandLineTools/usr/bin/cc $(C_DEFINES) $(C_INCLUDES) $(C_FLAGS) -o CMakeFiles/clox1.dir/main.c.o -c /Users/penghui/coding/jsjs/clox/main.c

CMakeFiles/clox1.dir/main.c.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing C source to CMakeFiles/clox1.dir/main.c.i"
	/Library/Developer/CommandLineTools/usr/bin/cc $(C_DEFINES) $(C_INCLUDES) $(C_FLAGS) -E /Users/penghui/coding/jsjs/clox/main.c > CMakeFiles/clox1.dir/main.c.i

CMakeFiles/clox1.dir/main.c.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling C source to assembly CMakeFiles/clox1.dir/main.c.s"
	/Library/Developer/CommandLineTools/usr/bin/cc $(C_DEFINES) $(C_INCLUDES) $(C_FLAGS) -S /Users/penghui/coding/jsjs/clox/main.c -o CMakeFiles/clox1.dir/main.c.s

CMakeFiles/clox1.dir/compiler.c.o: CMakeFiles/clox1.dir/flags.make
CMakeFiles/clox1.dir/compiler.c.o: ../compiler.c
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/Users/penghui/coding/jsjs/clox/cmake-build-debug/CMakeFiles --progress-num=$(CMAKE_PROGRESS_2) "Building C object CMakeFiles/clox1.dir/compiler.c.o"
	/Library/Developer/CommandLineTools/usr/bin/cc $(C_DEFINES) $(C_INCLUDES) $(C_FLAGS) -o CMakeFiles/clox1.dir/compiler.c.o -c /Users/penghui/coding/jsjs/clox/compiler.c

CMakeFiles/clox1.dir/compiler.c.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing C source to CMakeFiles/clox1.dir/compiler.c.i"
	/Library/Developer/CommandLineTools/usr/bin/cc $(C_DEFINES) $(C_INCLUDES) $(C_FLAGS) -E /Users/penghui/coding/jsjs/clox/compiler.c > CMakeFiles/clox1.dir/compiler.c.i

CMakeFiles/clox1.dir/compiler.c.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling C source to assembly CMakeFiles/clox1.dir/compiler.c.s"
	/Library/Developer/CommandLineTools/usr/bin/cc $(C_DEFINES) $(C_INCLUDES) $(C_FLAGS) -S /Users/penghui/coding/jsjs/clox/compiler.c -o CMakeFiles/clox1.dir/compiler.c.s

CMakeFiles/clox1.dir/chunk.c.o: CMakeFiles/clox1.dir/flags.make
CMakeFiles/clox1.dir/chunk.c.o: ../chunk.c
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/Users/penghui/coding/jsjs/clox/cmake-build-debug/CMakeFiles --progress-num=$(CMAKE_PROGRESS_3) "Building C object CMakeFiles/clox1.dir/chunk.c.o"
	/Library/Developer/CommandLineTools/usr/bin/cc $(C_DEFINES) $(C_INCLUDES) $(C_FLAGS) -o CMakeFiles/clox1.dir/chunk.c.o -c /Users/penghui/coding/jsjs/clox/chunk.c

CMakeFiles/clox1.dir/chunk.c.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing C source to CMakeFiles/clox1.dir/chunk.c.i"
	/Library/Developer/CommandLineTools/usr/bin/cc $(C_DEFINES) $(C_INCLUDES) $(C_FLAGS) -E /Users/penghui/coding/jsjs/clox/chunk.c > CMakeFiles/clox1.dir/chunk.c.i

CMakeFiles/clox1.dir/chunk.c.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling C source to assembly CMakeFiles/clox1.dir/chunk.c.s"
	/Library/Developer/CommandLineTools/usr/bin/cc $(C_DEFINES) $(C_INCLUDES) $(C_FLAGS) -S /Users/penghui/coding/jsjs/clox/chunk.c -o CMakeFiles/clox1.dir/chunk.c.s

CMakeFiles/clox1.dir/debug.c.o: CMakeFiles/clox1.dir/flags.make
CMakeFiles/clox1.dir/debug.c.o: ../debug.c
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/Users/penghui/coding/jsjs/clox/cmake-build-debug/CMakeFiles --progress-num=$(CMAKE_PROGRESS_4) "Building C object CMakeFiles/clox1.dir/debug.c.o"
	/Library/Developer/CommandLineTools/usr/bin/cc $(C_DEFINES) $(C_INCLUDES) $(C_FLAGS) -o CMakeFiles/clox1.dir/debug.c.o -c /Users/penghui/coding/jsjs/clox/debug.c

CMakeFiles/clox1.dir/debug.c.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing C source to CMakeFiles/clox1.dir/debug.c.i"
	/Library/Developer/CommandLineTools/usr/bin/cc $(C_DEFINES) $(C_INCLUDES) $(C_FLAGS) -E /Users/penghui/coding/jsjs/clox/debug.c > CMakeFiles/clox1.dir/debug.c.i

CMakeFiles/clox1.dir/debug.c.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling C source to assembly CMakeFiles/clox1.dir/debug.c.s"
	/Library/Developer/CommandLineTools/usr/bin/cc $(C_DEFINES) $(C_INCLUDES) $(C_FLAGS) -S /Users/penghui/coding/jsjs/clox/debug.c -o CMakeFiles/clox1.dir/debug.c.s

CMakeFiles/clox1.dir/memory.c.o: CMakeFiles/clox1.dir/flags.make
CMakeFiles/clox1.dir/memory.c.o: ../memory.c
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/Users/penghui/coding/jsjs/clox/cmake-build-debug/CMakeFiles --progress-num=$(CMAKE_PROGRESS_5) "Building C object CMakeFiles/clox1.dir/memory.c.o"
	/Library/Developer/CommandLineTools/usr/bin/cc $(C_DEFINES) $(C_INCLUDES) $(C_FLAGS) -o CMakeFiles/clox1.dir/memory.c.o -c /Users/penghui/coding/jsjs/clox/memory.c

CMakeFiles/clox1.dir/memory.c.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing C source to CMakeFiles/clox1.dir/memory.c.i"
	/Library/Developer/CommandLineTools/usr/bin/cc $(C_DEFINES) $(C_INCLUDES) $(C_FLAGS) -E /Users/penghui/coding/jsjs/clox/memory.c > CMakeFiles/clox1.dir/memory.c.i

CMakeFiles/clox1.dir/memory.c.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling C source to assembly CMakeFiles/clox1.dir/memory.c.s"
	/Library/Developer/CommandLineTools/usr/bin/cc $(C_DEFINES) $(C_INCLUDES) $(C_FLAGS) -S /Users/penghui/coding/jsjs/clox/memory.c -o CMakeFiles/clox1.dir/memory.c.s

CMakeFiles/clox1.dir/scanner.c.o: CMakeFiles/clox1.dir/flags.make
CMakeFiles/clox1.dir/scanner.c.o: ../scanner.c
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/Users/penghui/coding/jsjs/clox/cmake-build-debug/CMakeFiles --progress-num=$(CMAKE_PROGRESS_6) "Building C object CMakeFiles/clox1.dir/scanner.c.o"
	/Library/Developer/CommandLineTools/usr/bin/cc $(C_DEFINES) $(C_INCLUDES) $(C_FLAGS) -o CMakeFiles/clox1.dir/scanner.c.o -c /Users/penghui/coding/jsjs/clox/scanner.c

CMakeFiles/clox1.dir/scanner.c.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing C source to CMakeFiles/clox1.dir/scanner.c.i"
	/Library/Developer/CommandLineTools/usr/bin/cc $(C_DEFINES) $(C_INCLUDES) $(C_FLAGS) -E /Users/penghui/coding/jsjs/clox/scanner.c > CMakeFiles/clox1.dir/scanner.c.i

CMakeFiles/clox1.dir/scanner.c.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling C source to assembly CMakeFiles/clox1.dir/scanner.c.s"
	/Library/Developer/CommandLineTools/usr/bin/cc $(C_DEFINES) $(C_INCLUDES) $(C_FLAGS) -S /Users/penghui/coding/jsjs/clox/scanner.c -o CMakeFiles/clox1.dir/scanner.c.s

CMakeFiles/clox1.dir/value.c.o: CMakeFiles/clox1.dir/flags.make
CMakeFiles/clox1.dir/value.c.o: ../value.c
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/Users/penghui/coding/jsjs/clox/cmake-build-debug/CMakeFiles --progress-num=$(CMAKE_PROGRESS_7) "Building C object CMakeFiles/clox1.dir/value.c.o"
	/Library/Developer/CommandLineTools/usr/bin/cc $(C_DEFINES) $(C_INCLUDES) $(C_FLAGS) -o CMakeFiles/clox1.dir/value.c.o -c /Users/penghui/coding/jsjs/clox/value.c

CMakeFiles/clox1.dir/value.c.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing C source to CMakeFiles/clox1.dir/value.c.i"
	/Library/Developer/CommandLineTools/usr/bin/cc $(C_DEFINES) $(C_INCLUDES) $(C_FLAGS) -E /Users/penghui/coding/jsjs/clox/value.c > CMakeFiles/clox1.dir/value.c.i

CMakeFiles/clox1.dir/value.c.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling C source to assembly CMakeFiles/clox1.dir/value.c.s"
	/Library/Developer/CommandLineTools/usr/bin/cc $(C_DEFINES) $(C_INCLUDES) $(C_FLAGS) -S /Users/penghui/coding/jsjs/clox/value.c -o CMakeFiles/clox1.dir/value.c.s

CMakeFiles/clox1.dir/vm.c.o: CMakeFiles/clox1.dir/flags.make
CMakeFiles/clox1.dir/vm.c.o: ../vm.c
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/Users/penghui/coding/jsjs/clox/cmake-build-debug/CMakeFiles --progress-num=$(CMAKE_PROGRESS_8) "Building C object CMakeFiles/clox1.dir/vm.c.o"
	/Library/Developer/CommandLineTools/usr/bin/cc $(C_DEFINES) $(C_INCLUDES) $(C_FLAGS) -o CMakeFiles/clox1.dir/vm.c.o -c /Users/penghui/coding/jsjs/clox/vm.c

CMakeFiles/clox1.dir/vm.c.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing C source to CMakeFiles/clox1.dir/vm.c.i"
	/Library/Developer/CommandLineTools/usr/bin/cc $(C_DEFINES) $(C_INCLUDES) $(C_FLAGS) -E /Users/penghui/coding/jsjs/clox/vm.c > CMakeFiles/clox1.dir/vm.c.i

CMakeFiles/clox1.dir/vm.c.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling C source to assembly CMakeFiles/clox1.dir/vm.c.s"
	/Library/Developer/CommandLineTools/usr/bin/cc $(C_DEFINES) $(C_INCLUDES) $(C_FLAGS) -S /Users/penghui/coding/jsjs/clox/vm.c -o CMakeFiles/clox1.dir/vm.c.s

# Object files for target clox1
clox1_OBJECTS = \
"CMakeFiles/clox1.dir/main.c.o" \
"CMakeFiles/clox1.dir/compiler.c.o" \
"CMakeFiles/clox1.dir/chunk.c.o" \
"CMakeFiles/clox1.dir/debug.c.o" \
"CMakeFiles/clox1.dir/memory.c.o" \
"CMakeFiles/clox1.dir/scanner.c.o" \
"CMakeFiles/clox1.dir/value.c.o" \
"CMakeFiles/clox1.dir/vm.c.o"

# External object files for target clox1
clox1_EXTERNAL_OBJECTS =

clox1: CMakeFiles/clox1.dir/main.c.o
clox1: CMakeFiles/clox1.dir/compiler.c.o
clox1: CMakeFiles/clox1.dir/chunk.c.o
clox1: CMakeFiles/clox1.dir/debug.c.o
clox1: CMakeFiles/clox1.dir/memory.c.o
clox1: CMakeFiles/clox1.dir/scanner.c.o
clox1: CMakeFiles/clox1.dir/value.c.o
clox1: CMakeFiles/clox1.dir/vm.c.o
clox1: CMakeFiles/clox1.dir/build.make
clox1: CMakeFiles/clox1.dir/link.txt
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --bold --progress-dir=/Users/penghui/coding/jsjs/clox/cmake-build-debug/CMakeFiles --progress-num=$(CMAKE_PROGRESS_9) "Linking C executable clox1"
	$(CMAKE_COMMAND) -E cmake_link_script CMakeFiles/clox1.dir/link.txt --verbose=$(VERBOSE)

# Rule to build all files generated by this target.
CMakeFiles/clox1.dir/build: clox1
.PHONY : CMakeFiles/clox1.dir/build

CMakeFiles/clox1.dir/clean:
	$(CMAKE_COMMAND) -P CMakeFiles/clox1.dir/cmake_clean.cmake
.PHONY : CMakeFiles/clox1.dir/clean

CMakeFiles/clox1.dir/depend:
	cd /Users/penghui/coding/jsjs/clox/cmake-build-debug && $(CMAKE_COMMAND) -E cmake_depends "Unix Makefiles" /Users/penghui/coding/jsjs/clox /Users/penghui/coding/jsjs/clox /Users/penghui/coding/jsjs/clox/cmake-build-debug /Users/penghui/coding/jsjs/clox/cmake-build-debug /Users/penghui/coding/jsjs/clox/cmake-build-debug/CMakeFiles/clox1.dir/DependInfo.cmake --color=$(COLOR)
.PHONY : CMakeFiles/clox1.dir/depend

