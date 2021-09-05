#ifndef clox_chunk_h
#define clox_chunk_h

#include "common.h"
#include "value.h"

typedef enum {
	OP_RETURN,
	OP_NEGATE,
	OP_ADD,
	OP_SUBTRACT,
	OP_MULTIPLY,
	OP_DIVIDE,
	OP_CONSTANT,
    OP_NIL,
    OP_TRUE,
    OP_FALSE,
    OP_NOT,
    OP_EQUAL,
    OP_LESS,
    OP_GREATER,
} OpCode;

typedef struct {
	int count;
	int capacity;
	uint8_t* code;
	int* lines;
	ValueArray constants;
} Chunk;

void initChunk(Chunk* chunk);

void writeChunk(Chunk* chunk, uint8_t byte, int line);

void freeChunk(Chunk* chunk);

int addConstant(Chunk* chunk, Value value);

#endif
