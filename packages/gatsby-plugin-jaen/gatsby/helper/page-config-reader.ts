import fs from 'fs'
import path from 'path'
import {parse, ParserOptions} from '@babel/parser'
import traverse, {NodePath} from '@babel/traverse'
import * as t from '@babel/types'
import ts from 'typescript'

function readFileContent(filePath: string): string {
  return fs.readFileSync(filePath, 'utf-8')
}

function parseFileContent(
  content: string,
  isTypeScript: boolean
): t.File | undefined {
  const parserOptions: ParserOptions = isTypeScript
    ? {
        plugins: ['jsx', 'typescript'],
        sourceType: 'module'
      }
    : {
        plugins: ['jsx'],
        sourceType: 'module'
      }

  try {
    return parse(content, parserOptions)
  } catch (err) {
    console.error('Error parsing file:', err)
    return undefined
  }
}

function extractDataFromConfig(configObject: t.ObjectExpression): object {
  const data: any = {} // Use any as the type for now since we don't know the structure of the config object

  configObject.properties.forEach(property => {
    if (t.isObjectProperty(property) && t.isIdentifier(property.key)) {
      const key = property.key.name
      const value = property.value

      // You may want to handle other types of property values as needed (e.g., arrays, nested objects)
      if (
        t.isStringLiteral(value) ||
        t.isNumericLiteral(value) ||
        t.isBooleanLiteral(value)
      ) {
        data[key] = value.value
      }
      // handle arrays
      else if (t.isArrayExpression(value)) {
        data[key] = []
        value.elements.forEach(element => {
          if (t.isStringLiteral(element)) {
            data[key].push(element.value)
          }
        })
      }
    }
  })

  return data
}

function findConfigObject(ast: t.File): t.ObjectExpression | undefined {
  let configObject: t.ObjectExpression | undefined = undefined

  traverse(ast, {
    ExportNamedDeclaration(path: NodePath<t.ExportNamedDeclaration>) {
      const node = path.node.declaration
      if (node && t.isVariableDeclaration(node)) {
        const declarationName = (node.declarations[0]?.id as t.Identifier)?.name
        if (
          declarationName === 'config' &&
          t.isObjectExpression(node.declarations[0]?.init)
        ) {
          configObject = node.declarations[0]?.init
        }
      }
    }
  })

  return configObject
}

function readConfigFromFile(filePath: string): object | undefined {
  const fileContent = readFileContent(filePath)
  const fileExtension = path.extname(filePath).toLowerCase()
  const isTypeScript = fileExtension === '.ts' || fileExtension === '.tsx'

  const ast = parseFileContent(fileContent, isTypeScript)
  if (!ast) {
    console.error('Could not parse the file:', filePath)
    return undefined
  }

  const configObject = findConfigObject(ast)
  if (!configObject) {
    // console.error('No "config" object found in the file:', filePath)
    return undefined
  }

  const data = extractDataFromConfig(configObject)
  return data
}

interface PageConfig {
  label: string
  childTemplates: string[]
}

export const readPageConfig = (filePath: string): PageConfig | undefined => {
  const configObject = readConfigFromFile(filePath)

  if (!configObject) {
    return undefined
  }

  console.log(configObject)

  const label = (configObject as any).label
  let childTemplates = (configObject as any).childTemplates || []

  // Prepend `JaenTemplate` to child templates if not already present
  childTemplates = childTemplates.map((childTemplate: string) => {
    if (childTemplate.startsWith('JaenTemplate')) {
      return childTemplate
    } else {
      return `JaenTemplate ${childTemplate}`
    }
  })

  return {
    label,
    childTemplates
  }
}
