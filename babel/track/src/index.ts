import { declare } from '@babel/helper-plugin-utils'
import * as t from '@babel/types'
import type { NodePath } from '@babel/core'
import template from '@babel/template'
// @ts-expect-error no typings
import { addDefault } from '@babel/helper-module-imports'

export const autoTrackPlugin = declare((api, options) => {
  api.assertVersion(7)

  const { trackerPackageName = 'tracker-module', importName = 'tracker' } =
    options || {}

  return {
    name: 'track',

    visitor: {
      Program(path, state) {
        path.traverse({
          ImportDeclaration(decl) {
            if (decl.node.source.value === trackerPackageName) {
              const specifier: NodePath<t.ImportSpecifier> = decl.get(
                'specifiers.0'
              ) as any
              if (specifier.isImportSpecifier()) {
                state.trackerId = specifier.node.local.name
              }
            }
          },
        })

        if (!state.trackerId) {
          state.trackerId = addDefault(path, importName, {
            nameHint: path.scope.generateUid(importName),
          }).name
        }
      },

      'ClassMethod|FunctionDeclaration|FunctionExpression|ArrowFunctionExpression'(
        path: NodePath<
          | t.ClassMethod
          | t.FunctionDeclaration
          | t.FunctionExpression
          | t.ArrowFunctionExpression
        >,
        state: any
      ) {
        const body = path.get('body')
        if (body.isBlockStatement()) {
          body.node.body.unshift(template.statement(`${importName}();`)())
        } else {
          const ast = template.statement(
            `{${state.trackerId}();return PREV_BODY;}`
          )({ PREV_BODY: body.node })
          body.replaceWith(ast)
        }
      },
    },
  }
})
