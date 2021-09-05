
#ifndef clox_vm_h
#define clox_vm_h

#include "chunk.h"
#include "value.h"
#include "table.h"

#define STACK_MAX 256

typedef struct {
	Chunk* chunk;
	uint8_t* ip;
	Value stack[STACK_MAX];
	Value* stackTop;
    Obj* objects;
    Table strings;
    Table globals;
} VM;

extern VM vm;

void initVM();

void freeVM();

typedef enum {
	INTERPRET_OK,
	INTERPRET_COMPILE_ERROR,
	INTERPRET_RUNTIME_ERROR,
} InterpertResult;

InterpertResult interpret(const char* source);


static void push(Value value);

static Value pop();

#endif

static InterpertResult run();
