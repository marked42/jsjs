//
// Created by 张鹏辉 on 2021/9/5.
//

#include <stdlib.h>
#include <string.h>

#include "memory.h"
#include "object.h"
#include "table.h"
#include "value.h"

void initTable(Table* table) {
    table->capacity = 0;
    table->count = 0;
    table->entries = NULL;
}

void freeTable(Table* table) {
    FREE_ARRAY(Entry, table->entries, table->capacity);
    initTable(table);
}

static Entry* findEntry(Entry* entries, int capacity, ObjString* key) {
    uint32_t index = key->hash  % capacity;
    Entry* tombstone = NULL;
    for (;;) {
        Entry *entry = &entries[index];
        if (entry->key == NULL) {
            if (IS_NIL(entry->value)) {
                return tombstone != NULL ? tombstone : entry;
            } else {
                if (tombstone == NULL) { tombstone = entry; }
            }
        } else if (entry->key == key) {
            return entry;
        }

        index = (index + 1) % capacity;
    }
}

bool tableGet(Table* table, ObjString* key, Value* value) {
    if (table->count == 0)     { return false; }

    Entry* entry = findEntry(table->entries, table->capacity, key);
    // tombstone or empty
    if (entry->key == NULL) { return false; }

    *value = entry->value;

    return true;
}

bool tableDelete(Table* table, ObjString* key) {
    if (table->count == 0) { return false;}

    Entry* entry = findEntry(table->entries, table->capacity, key);
    // tombstone or empty
    if (entry->key == NULL) { return false; }

    // tombstone
    entry->key = NULL;
    entry->value = BOOL_VAL(true);

    return true;
}

static void adjustCapacity(Table* table, int capacity) {
    Entry* entries = ALLOCATE(Entry, capacity);
    for (int i = 0; i < capacity; i++) {
        entries[i].key = NULL;
        entries[i].value = NIL_VAL;
    }

    table->count = 0;
    for (int i = 0; i < table->capacity; i++) {
        Entry* entry = &table->entries[i];
        // empty or tombstone
        if (entry->key == NULL) { continue; }

        // 不存在重复元素，所以找到的都是空的Entry，直接写入新数据
        Entry* dest = findEntry(entries, capacity, entry->key);
        dest->key = entry->key;
        dest->value = entry->value;

        table->count++;
    }

    FREE_ARRAY(Entry, table->entries, table->capacity);

    table->entries = entries;
    table->capacity = capacity;
}

bool tableSet(Table* table, ObjString* key, Value value) {
    if (table->count + 1 > table->capacity * TABLE_MAX_LOAD) {
        int capacity = GROW_CAPACITY(table->capacity);
        adjustCapacity(table, capacity);
    }

    Entry* entry = findEntry(table->entries, table->capacity, key);
    bool isNewKey = entry->key == NULL;
    // 不是tombstone时count加1，count表示tombstone Entry和普通entry的总数
    if (isNewKey && IS_NIL(entry->value)) {
        table->count++;
    }

    entry->key = key;
    entry->value = value;

    return isNewKey;
}

void tableAddAll(Table* from, Table* to) {
    for (int i = 0; i < from->capacity; i++) {
        Entry* entry = &from->entries[i];
        if (entry->key != NULL) {
            tableSet(to, entry->key, entry->value);
        }
    }
}

ObjString* tableFindString(Table* table, const char* chars, int length, uint32_t hash) {
    if (table->count == 0) { return NULL; }

    uint32_t index = hash % table->capacity;
    for (;;) {
        Entry* entry = &table->entries[index];

        // Empty or tombstone element
        if (entry->key == NULL) {
            // empty element means no string exist
            if (IS_NIL(entry->value))  {
                return NULL;
            }
            // continue on tome stone
        }  else if (entry->key->length == length && entry->key->hash == hash && memcmp(entry->key->chars, chars, length) == 0) {
            return entry->key;
        }

        index = (index + 1) % table->capacity;
    }
}
