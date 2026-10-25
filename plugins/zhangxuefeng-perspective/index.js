import { readFileSync, readdirSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { join, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse as parseYaml } from 'yaml'

export const name = 'dsh-zhangxuefeng-perspective'
export const inject = ['skills']

const skillRoot = fileURLToPath(new URL('./skills/', import.meta.url))

function parseSkill(raw, path) {
  const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/u.exec(raw)
  if (frontmatter?.[1] === undefined) {
    throw new Error(`zhangxuefeng-perspective: ${path} has no YAML frontmatter`)
  }

  const metadata = parseYaml(frontmatter[1])
  if (typeof metadata !== 'object' || metadata === null) {
    throw new Error(`zhangxuefeng-perspective: ${path} has invalid frontmatter`)
  }

  const description = typeof metadata.description === 'string'
    ? metadata.description.trim()
    : ''
  if (description.length === 0) {
    throw new Error(`zhangxuefeng-perspective: ${path} has no description`)
  }

  return {
    name: metadata.name,
    description,
    content: raw.slice(frontmatter[0].length).trim(),
  }
}

function listCandidates() {
  return readdirSync(skillRoot, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map((entry) => {
      const directory = join(skillRoot, entry.name)
      const path = join(directory, 'SKILL.md')
      const parsed = parseSkill(readFileSync(path, 'utf8'), path)
      return {
        name: parsed.name,
        description: parsed.description,
        invocation: {
          modelInvocable: true,
          userInvocable: true,
        },
        provider: 'zhangxuefeng-perspective',
        source: 'bundled',
        rank: 600,
        resourceBase: {
          kind: 'directory',
          path: directory.split(sep).join('/'),
        },
        locator: path,
      }
    })
}

export function apply(ctx) {
  const candidates = listCandidates()
  const provider = {
    name: 'zhangxuefeng-perspective',
    list: () => Promise.resolve(candidates),
    async get(candidate, options) {
      const { rank: _rank, locator, ...summary } = candidate
      const raw = await readFile(locator, { encoding: 'utf8', signal: options.signal })
      const parsed = parseSkill(raw, locator)
      return {
        ...summary,
        content: parsed.content,
      }
    },
  }

  ctx.skills.registerProvider(() => provider)
}
