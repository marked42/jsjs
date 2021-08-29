import { declare } from '@babel/helper-plugin-utils'
import * as t from '@babel/types'
import type { NodePath } from '@babel/core'
import template from '@babel/template'
// @ts-expect-error no typings
import { addDefault } from '@babel/helper-module-imports'

export const autoTrackPlugin = declare((api, options) => {
  api.assertVersion(7)

  return {
    name: 'track',

    visitor: {
      Program(path, state) {
        path.traverse({
          ImportDeclaration(decl) {
            if (decl.node.source.value === 'track') {
              const specifier = decl.get('specifiers.0')
              // if (specifier.isImportSpecifier()) {
              // }
            }
          },
        })
      },

      'ClassMethod|FunctionDeclaration|FunctionExpression|ArrowFunctionExpression'(
        path: NodePath<
          | t.ClassMethod
          | t.FunctionDeclaration
          | t.FunctionExpression
          | t.ArrowFunctionExpression
        >
      ) {
        const body = path.get('body')
        if (body.isBlockStatement()) {
          body.node.body.unshift(template.statement('pre();')())
        }
      },
    },
  }
})
