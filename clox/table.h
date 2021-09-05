//
// Created by 张鹏辉 on 2021/9/5.
//

#ifndef CLOX1_TABLE_H
#define CLOX1_TABLE_H

#include "common.h"
#include "value.h"

#define TABLE_MAX_LOAD 0.75

typedef struct {
    ObjString* key;
    Value value;
} Entry;

typedef struct {
    int count;
    int capacity;
    Entry* entries;
} Table;

void initTable(Table* table);

void freeTable(Table* table);

bool tableSet(Table* table, ObjString* key, Value value);

bool tableDelete(Table* table, ObjString* key);

bool tableGet(Table* table, ObjString* key, Value* value);

void tableAddAll(Table* from, Table* to);

ObjString* tableFindString(Table* table, const char* chars, int length, uint32_t hash);

#endif //CLOX1_TABLE_H
